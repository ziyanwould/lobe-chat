import type { ChatModelCard } from '@lobechat/types';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import debug from 'debug';
import { LOBE_DEFAULT_MODEL_LIST } from 'model-bank';
import type { AiModelType } from 'model-bank';
import OpenAI, { ClientOptions } from 'openai';
import { Stream } from 'openai/streaming';

import { responsesAPIModels } from '../../const/models';
import {
  ChatCompletionErrorPayload,
  ChatCompletionTool,
  ChatMethodOptions,
  ChatStreamCallbacks,
  ChatStreamPayload,
  Embeddings,
  EmbeddingsOptions,
  EmbeddingsPayload,
  GenerateObjectOptions,
  GenerateObjectPayload,
  TextToImagePayload,
  TextToSpeechOptions,
  TextToSpeechPayload,
} from '../../types';
import { AgentRuntimeErrorType, ILobeAgentRuntimeErrorType } from '../../types/error';
import { CreateImagePayload, CreateImageResponse } from '../../types/image';
import { AgentRuntimeError } from '../../utils/createError';
import { debugResponse, debugStream } from '../../utils/debugStream';
import { desensitizeUrl } from '../../utils/desensitizeUrl';
import { getModelPropertyWithFallback } from '../../utils/getFallbackModelProperty';
import { getModelPricing } from '../../utils/getModelPricing';
import { handleOpenAIError } from '../../utils/handleOpenAIError';
import { postProcessModelList } from '../../utils/postProcessModelList';
import { StreamingResponse } from '../../utils/response';
import { LobeRuntimeAI } from '../BaseAI';
import { convertOpenAIMessages, convertOpenAIResponseInputs } from '../contextBuilders/openai';
import { OpenAIResponsesStream, OpenAIStream, OpenAIStreamOptions } from '../streams';
import { createOpenAICompatibleImage } from './createImage';
import { transformResponseAPIToStream, transformResponseToStream } from './nonStreamToStream';

export * from './nonStreamToStream';

// the model contains the following keywords is not a chat model, so we should filter them out
export const CHAT_MODELS_BLOCK_LIST = [
  'embedding',
  'davinci',
  'curie',
  'moderation',
  'ada',
  'babbage',
  'tts',
  'whisper',
  'dall-e',
];

type ConstructorOptions<T extends Record<string, any> = any> = ClientOptions & T;
export type CreateImageOptions = Omit<ClientOptions, 'apiKey'> & {
  apiKey: string;
  ip?: string;
  provider: string;
  user?: string;
};

export interface CustomClientOptions<T extends Record<string, any> = any> {
  createChatCompletionStream?: (
    client: any,
    payload: ChatStreamPayload,
    instance: any,
  ) => ReadableStream<any>;
  createClient?: (options: ConstructorOptions<T>) => any;
}

export interface OpenAICompatibleFactoryOptions<T extends Record<string, any> = any> {
  apiKey?: string;
  baseURL?: string;
  chatCompletion?: {
    excludeUsage?: boolean;
    handleError?: (
      error: any,
      options: ConstructorOptions<T>,
    ) => Omit<ChatCompletionErrorPayload, 'provider'> | undefined;
    handlePayload?: (
      payload: ChatStreamPayload,
      options: ConstructorOptions<T>,
    ) => OpenAI.ChatCompletionCreateParamsStreaming;
    handleStream?: (
      stream: Stream<OpenAI.ChatCompletionChunk> | ReadableStream,
      { callbacks, inputStartAt }: { callbacks?: ChatStreamCallbacks; inputStartAt?: number },
    ) => ReadableStream;
    handleStreamBizErrorType?: (error: {
      message: string;
      name: string;
    }) => ILobeAgentRuntimeErrorType | undefined;
    handleTransformResponseToStream?: (
      data: OpenAI.ChatCompletion,
    ) => ReadableStream<OpenAI.ChatCompletionChunk>;
    noUserId?: boolean;
    /**
     * If true, route chat requests to Responses API path directly
     */
    useResponse?: boolean;
    /**
     * Allow only some models to use Responses API by simple matching.
     * If any string appears in model id or RegExp matches, Responses API is used.
     */
    useResponseModels?: Array<string | RegExp>;
  };
  constructorOptions?: ConstructorOptions<T>;
  createImage?: (
    payload: CreateImagePayload,
    options: CreateImageOptions,
  ) => Promise<CreateImageResponse>;
  customClient?: CustomClientOptions<T>;
  debug?: {
    chatCompletion: () => boolean;
    responses?: () => boolean;
  };
  errorType?: {
    bizError: ILobeAgentRuntimeErrorType;
    invalidAPIKey: ILobeAgentRuntimeErrorType;
  };
  generateObject?: {
    /**
     * If true, route generateObject requests to Responses API path directly
     */
    useResponse?: boolean;
    /**
     * Allow only some models to use Responses API by simple matching.
     * If any string appears in model id or RegExp matches, Responses API is used.
     */
    useResponseModels?: Array<string | RegExp>;
    /**
     * Use tool calling to simulate structured output for providers that don't support native structured output
     */
    useToolsCalling?: boolean;
  };
  models?:
    | ((params: { client: OpenAI }) => Promise<ChatModelCard[]>)
    | {
        transformModel?: (model: OpenAI.Model) => ChatModelCard;
      };
  provider: string;
  responses?: {
    handlePayload?: (
      payload: ChatStreamPayload,
      options: ConstructorOptions<T>,
    ) => ChatStreamPayload;
  };
}

export const createOpenAICompatibleRuntime = <T extends Record<string, any> = any>({
  provider,
  baseURL: DEFAULT_BASE_URL,
  apiKey: DEFAULT_API_LEY,
  errorType,
  debug: debugParams,
  constructorOptions,
  chatCompletion,
  models,
  customClient,
  responses,
  createImage: customCreateImage,
  generateObject: generateObjectConfig,
}: OpenAICompatibleFactoryOptions<T>) => {
  const ErrorType = {
    bizError: errorType?.bizError || AgentRuntimeErrorType.ProviderBizError,
    invalidAPIKey: errorType?.invalidAPIKey || AgentRuntimeErrorType.InvalidProviderAPIKey,
  };

  return class LobeOpenAICompatibleAI implements LobeRuntimeAI {
    client!: OpenAI;

    private id: string;
    private logPrefix: string;

    baseURL!: string;
    protected _options: ConstructorOptions<T>;

    constructor(options: ClientOptions & Record<string, any> = {}) {
      const _options = {
        ...options,
        apiKey: options.apiKey?.trim() || DEFAULT_API_LEY,
        baseURL: options.baseURL?.trim() || DEFAULT_BASE_URL,
      };
      const { apiKey, baseURL = DEFAULT_BASE_URL, ...res } = _options;
      this._options = _options as ConstructorOptions<T>;

      if (!apiKey) throw AgentRuntimeError.createError(ErrorType?.invalidAPIKey);

      const initOptions = { apiKey, baseURL, ...constructorOptions, ...res };

      // if the custom client is provided, use it as client
      if (customClient?.createClient) {
        this.client = customClient.createClient(initOptions as any);
      } else {
        this.client = new OpenAI(initOptions);
      }

      this.baseURL = baseURL || this.client.baseURL;

      this.id = options.id || provider;
      this.logPrefix = `lobe-model-runtime:${this.id}`;
    }

    async chat({ responseMode, ...payload }: ChatStreamPayload, options?: ChatMethodOptions) {
      try {
        const log = debug(`${this.logPrefix}:chat`);
        const inputStartAt = Date.now();

        log('chat called with model: %s, stream: %s', payload.model, payload.stream ?? true);

        // 工厂级 Responses API 路由控制（支持实例覆盖）
        const modelId = (payload as any).model as string | undefined;
        const shouldUseResponses = (() => {
          const instanceChat = ((this._options as any).chatCompletion || {}) as {
            useResponse?: boolean;
            useResponseModels?: Array<string | RegExp>;
          };
          const flagUseResponse =
            instanceChat.useResponse ?? (chatCompletion ? chatCompletion.useResponse : undefined);
          const flagUseResponseModels =
            instanceChat.useResponseModels ?? chatCompletion?.useResponseModels;

          if (!chatCompletion && !instanceChat) return false;
          if (flagUseResponse) return true;
          if (!modelId || !flagUseResponseModels?.length) return false;
          return flagUseResponseModels.some((m: string | RegExp) =>
            typeof m === 'string' ? modelId.includes(m) : (m as RegExp).test(modelId),
          );
        })();

        let processedPayload: any = payload;
        if (shouldUseResponses) {
          log('using Responses API mode');
          processedPayload = { ...payload, apiMode: 'responses' } as any;
        } else {
          log('using Chat Completions API mode');
        }

        // 再进行工厂级处理
        const postPayload = chatCompletion?.handlePayload
          ? chatCompletion.handlePayload(processedPayload, this._options)
          : ({
              ...processedPayload,
              stream: processedPayload.stream ?? true,
            } as OpenAI.ChatCompletionCreateParamsStreaming);

        if ((postPayload as any).apiMode === 'responses') {
          return this.handleResponseAPIMode(processedPayload, options);
        }

        const messages = await convertOpenAIMessages(postPayload.messages);

        let response: Stream<OpenAI.Chat.Completions.ChatCompletionChunk>;

        const streamOptions: OpenAIStreamOptions = {
          bizErrorTypeTransformer: chatCompletion?.handleStreamBizErrorType,
          callbacks: options?.callback,
          payload: {
            model: payload.model,
            pricing: await getModelPricing(payload.model, this.id),
            provider: this.id,
          },
        };

        const customHeaders = {
          ...options?.requestHeaders,
          'x-user-id': options?.user,
          'x-user-ip': options?.ip,
        };

        if (customClient?.createChatCompletionStream) {
          log('using custom client for chat completion stream');
          response = customClient.createChatCompletionStream(
            this.client,
            processedPayload,
            this,
          ) as any;
        } else {
          const finalPayload = {
            ...postPayload,
            messages,
            ...(chatCompletion?.noUserId ? {} : { user: options?.user }),
            stream_options:
              postPayload.stream && !chatCompletion?.excludeUsage
                ? { include_usage: true }
                : undefined,
          };

          log('sending chat completion request with %d messages', messages.length);

          if (debugParams?.chatCompletion?.()) {
            console.log('[requestPayload]');
            console.log(JSON.stringify(finalPayload), '\n');
          }

          response = await this.client.chat.completions.create(finalPayload, {
            // https://github.com/lobehub/lobe-chat/pull/318
            headers: { Accept: '*/*', ...customHeaders },
            signal: options?.signal,
          });
        }

        if (postPayload.stream) {
          log('processing streaming response');
          const [prod, useForDebug] = response.tee();

          if (debugParams?.chatCompletion?.()) {
            const useForDebugStream =
              useForDebug instanceof ReadableStream ? useForDebug : useForDebug.toReadableStream();

            debugStream(useForDebugStream).catch(console.error);
          }

          return StreamingResponse(
            chatCompletion?.handleStream
              ? chatCompletion.handleStream(prod, {
                  callbacks: streamOptions.callbacks,
                  inputStartAt,
                })
              : OpenAIStream(prod, {
                  ...streamOptions,
                  inputStartAt,
                }),
            {
              headers: options?.headers,
            },
          );
        }

        if (debugParams?.chatCompletion?.()) {
          debugResponse(response);
        }

        if (responseMode === 'json') {
          log('returning JSON response mode');
          return Response.json(response);
        }

        log('transforming non-streaming response to stream');
        const transformHandler =
          chatCompletion?.handleTransformResponseToStream || transformResponseToStream;
        const stream = transformHandler(response as unknown as OpenAI.ChatCompletion);

        return StreamingResponse(
          chatCompletion?.handleStream
            ? chatCompletion.handleStream(stream, {
                callbacks: streamOptions.callbacks,
                inputStartAt,
              })
            : OpenAIStream(stream, { ...streamOptions, enableStreaming: false, inputStartAt }),
          {
            headers: options?.headers,
          },
        );
      } catch (error) {
        throw this.handleError(error);
      }
    }

    async createImage(payload: CreateImagePayload, options?: ChatMethodOptions) {
      const log = debug(`${this.logPrefix}:createImage`);

      // If custom createImage implementation is provided, use it
      if (customCreateImage) {
        log('using custom createImage implementation');
        return customCreateImage(payload, {
          ...this._options,
          apiKey: this._options.apiKey!,
          ip: options?.ip,
          provider,
          user: options?.user,
        });
      }

      log('using default createOpenAICompatibleImage');
      // Use the new createOpenAICompatibleImage function
      const headers: Record<string, string> = {
        'Accept': '*/*',
        'x-user-id': options?.user || 'unknown',
        'x-user-ip': options?.ip || 'unknown',
      };
      return createOpenAICompatibleImage(this.client, payload, this.id, headers);
    }

    async models() {
      const log = debug(`${this.logPrefix}:models`);
      log('fetching available models');

      let resultModels: ChatModelCard[] = [];
      if (typeof models === 'function') {
        log('using custom models function');
        resultModels = await models({ client: this.client });
      } else {
        log('fetching models from client API');
        const list = await this.client.models.list();
        resultModels = list.data
          .filter((model) => {
            return CHAT_MODELS_BLOCK_LIST.every(
              (keyword) => !model.id.toLowerCase().includes(keyword),
            );
          })
          .map((item) => {
            if (models?.transformModel) {
              return models.transformModel(item);
            }

            const toReleasedAt = () => {
              if (!item.created) return;
              dayjs.extend(utc);

              // guarantee item.created in Date String format
              if (
                typeof (item.created as any) === 'string' ||
                // or in milliseconds
                item.created.toFixed(0).length === 13
              ) {
                return dayjs.utc(item.created).format('YYYY-MM-DD');
              }

              // by default, the created time is in seconds
              return dayjs.utc(item.created * 1000).format('YYYY-MM-DD');
            };

            // TODO: should refactor after remove v1 user/modelList code
            const knownModel = LOBE_DEFAULT_MODEL_LIST.find((model) => model.id === item.id);

            if (knownModel) {
              const releasedAt = knownModel.releasedAt ?? toReleasedAt();

              return { ...knownModel, releasedAt };
            }

            return {
              id: item.id,
              releasedAt: toReleasedAt(),
            };
          })

          .filter(Boolean) as ChatModelCard[];
      }

      log('fetched %d models', resultModels.length);

      return await postProcessModelList(resultModels, (modelId) =>
        getModelPropertyWithFallback<AiModelType>(modelId, 'type'),
      );
    }

    async generateObject(payload: GenerateObjectPayload, options?: GenerateObjectOptions) {
      const { messages, schema, model, responseApi, tools } = payload;

      const log = debug(`${this.logPrefix}:generateObject`);
      log(
        'generateObject called with model: %s, hasTools: %s, hasSchema: %s',
        model,
        !!tools,
        !!schema,
      );

      if (tools) {
        log('using tools-based generation');
        return this.generateObjectWithTools(payload, options);
      }

      if (!schema) throw new Error('tools or schema is required');

      // Use tool calling fallback if configured
      if (generateObjectConfig?.useToolsCalling) {
        log('using tool calling fallback for structured output');
        const tool: ChatCompletionTool = {
          function: {
            description:
              schema.description || 'Generate structured output according to the provided schema',
            name: schema.name || 'structured_output',
            parameters: schema.schema,
          },
          type: 'function',
        };

        const res = await this.client.chat.completions.create(
          {
            messages,
            model,
            tool_choice: { function: { name: tool.function.name }, type: 'function' },
            tools: [tool],
            user: options?.user,
          },
          { headers: options?.headers, signal: options?.signal },
        );

        const toolCalls = res.choices[0].message.tool_calls!;

        try {
          return toolCalls.map((item) => ({
            arguments: JSON.parse(item.function.arguments),
            name: item.function.name,
          }));
        } catch {
          console.error('parse tool call arguments error:', toolCalls);
          return undefined;
        }
      }

      // Factory-level Responses API routing control (supports instance override)
      const shouldUseResponses = (() => {
        const instanceGenerateObject = ((this._options as any).generateObject || {}) as {
          useResponse?: boolean;
          useResponseModels?: Array<string | RegExp>;
        };
        const flagUseResponse =
          instanceGenerateObject.useResponse ??
          (generateObjectConfig ? generateObjectConfig.useResponse : undefined);
        const flagUseResponseModels =
          instanceGenerateObject.useResponseModels ?? generateObjectConfig?.useResponseModels;

        if (responseApi) {
          log('using Responses API due to explicit responseApi flag');
          return true;
        }

        if (flagUseResponse) {
          log('using Responses API due to useResponse flag');
          return true;
        }

        // Use factory-configured model list if provided
        if (model && flagUseResponseModels?.length) {
          const matches = flagUseResponseModels.some((m: string | RegExp) =>
            typeof m === 'string' ? model.includes(m) : (m as RegExp).test(model),
          );
          if (matches) {
            log('using Responses API: model %s matches useResponseModels config', model);
            return true;
          }
        }

        // Default: use built-in responsesAPIModels
        if (model && responsesAPIModels.has(model)) {
          log('using Responses API: model %s in built-in responsesAPIModels', model);
          return true;
        }

        log('using Chat Completions API for generateObject');
        return false;
      })();

      if (shouldUseResponses) {
        log('calling responses.create for structured output');
        const res = await this.client!.responses.create(
          {
            input: messages,
            model,
            text: { format: { strict: true, type: 'json_schema', ...schema } },
            user: options?.user,
          },
          { headers: options?.headers, signal: options?.signal },
        );

        const text = res.output_text;
        log('received structured output from Responses API, length: %d', text?.length || 0);
        try {
          const result = JSON.parse(text);
          log('successfully parsed JSON output');
          return result;
        } catch (error) {
          log('failed to parse JSON output: %O', error);
          console.error('parse json error:', text);
          return undefined;
        }
      }

      log('calling chat.completions.create for structured output');
      const res = await this.client.chat.completions.create(
        {
          messages,
          model,
          response_format: { json_schema: schema, type: 'json_schema' },
          user: options?.user,
        },
        { headers: options?.headers, signal: options?.signal },
      );
      const text = res.choices[0].message.content!;

      log('received structured output from Chat Completions API, length: %d', text?.length || 0);

      try {
        const result = JSON.parse(text);
        log('successfully parsed JSON output');
        return result;
      } catch (error) {
        log('failed to parse JSON output: %O', error);
        console.error('parse json error:', text);
        return undefined;
      }
    }

    async embeddings(
      payload: EmbeddingsPayload,
      options?: EmbeddingsOptions,
    ): Promise<Embeddings[]> {
      const log = debug(`${this.logPrefix}:embeddings`);
      log(
        'embeddings called with model: %s, input items: %d',
        payload.model,
        Array.isArray(payload.input) ? payload.input.length : 1,
      );

      try {
        const res = await this.client.embeddings.create(
          { ...payload, encoding_format: 'float', user: options?.user },
          { headers: options?.headers, signal: options?.signal },
        );

        log('received %d embeddings', res.data.length);
        return res.data.map((item) => item.embedding);
      } catch (error) {
        throw this.handleError(error);
      }
    }

    async textToImage(payload: TextToImagePayload) {
      const log = debug(`${this.logPrefix}:textToImage`);
      log('textToImage called with prompt length: %d', payload.prompt?.length || 0);

      try {
        const res = await this.client.images.generate(payload);
        log('generated %d images', res.data?.length || 0);
        return (res.data || []).map((o) => o.url) as string[];
      } catch (error) {
        throw this.handleError(error);
      }
    }

    async textToSpeech(payload: TextToSpeechPayload, options?: TextToSpeechOptions) {
      const log = debug(`${this.logPrefix}:textToSpeech`);
      log(
        'textToSpeech called with input length: %d, voice: %s',
        payload.input?.length || 0,
        payload.voice,
      );

      try {
        const mp3 = await this.client.audio.speech.create(payload as any, {
          headers: options?.headers,
          signal: options?.signal,
        });
        const buffer = await mp3.arrayBuffer();
        log('generated audio with size: %d bytes', buffer.byteLength);
        return buffer;
      } catch (error) {
        throw this.handleError(error);
      }
    }

    protected handleError(error: any): ChatCompletionErrorPayload {
      const log = debug(`${this.logPrefix}:error`);
      log('handling error: %O', error);

      let desensitizedEndpoint = this.baseURL;

      // refs: https://github.com/lobehub/lobe-chat/issues/842
      if (this.baseURL !== DEFAULT_BASE_URL) {
        desensitizedEndpoint = desensitizeUrl(this.baseURL);
      }

      if (chatCompletion?.handleError) {
        log('using custom error handler');
        const errorResult = chatCompletion.handleError(error, this._options);

        if (errorResult)
          return AgentRuntimeError.chat({
            ...errorResult,
            provider: this.id,
          } as ChatCompletionErrorPayload);
      }

      if ('status' in (error as any)) {
        const status = (error as Response).status;
        log('HTTP error with status: %d', status);

        switch (status) {
          case 401: {
            log('invalid API key error');
            return AgentRuntimeError.chat({
              endpoint: desensitizedEndpoint,
              error: error as any,
              errorType: ErrorType.invalidAPIKey,
              provider: this.id,
            });
          }

          default: {
            break;
          }
        }
      }

      const { errorResult, RuntimeError } = handleOpenAIError(error);

      log('error code: %s, message: %s', errorResult.code, errorResult.message);

      switch (errorResult.code) {
        case 'insufficient_quota': {
          log('insufficient quota error');
          return AgentRuntimeError.chat({
            endpoint: desensitizedEndpoint,
            error: errorResult,
            errorType: AgentRuntimeErrorType.InsufficientQuota,
            provider: this.id,
          });
        }

        case 'model_not_found': {
          log('model not found error');
          return AgentRuntimeError.chat({
            endpoint: desensitizedEndpoint,
            error: errorResult,
            errorType: AgentRuntimeErrorType.ModelNotFound,
            provider: this.id,
          });
        }

        // content too long
        case 'context_length_exceeded':
        case 'string_above_max_length': {
          log('context length exceeded error');
          return AgentRuntimeError.chat({
            endpoint: desensitizedEndpoint,
            error: errorResult,
            errorType: AgentRuntimeErrorType.ExceededContextWindow,
            provider: this.id,
          });
        }
      }

      log('returning generic error');
      return AgentRuntimeError.chat({
        endpoint: desensitizedEndpoint,
        error: errorResult,
        errorType: RuntimeError || ErrorType.bizError,
        provider: this.id,
      });
    }

    private async handleResponseAPIMode(
      payload: ChatStreamPayload,
      options?: ChatMethodOptions,
    ): Promise<Response> {
      const log = debug(`${this.logPrefix}:handleResponseAPIMode`);
      log('handleResponseAPIMode called with model: %s', payload.model);

      const inputStartAt = Date.now();

      const { messages, reasoning_effort, tools, reasoning, responseMode, ...res } =
        responses?.handlePayload
          ? (responses?.handlePayload(payload, this._options) as ChatStreamPayload)
          : payload;

      // remove penalty params
      delete res.apiMode;
      delete res.frequency_penalty;
      delete res.presence_penalty;

      const input = await convertOpenAIResponseInputs(messages as any);

      const isStreaming = payload.stream !== false;
      log(
        'isStreaming: %s, hasTools: %s, hasReasoning: %s',
        isStreaming,
        !!tools,
        !!(reasoning || reasoning_effort),
      );

      const postPayload = {
        ...res,
        ...(reasoning || reasoning_effort
          ? {
              reasoning: {
                ...reasoning,
                ...(reasoning_effort && { effort: reasoning_effort }),
              },
            }
          : {}),
        input,
        store: false,
        stream: !isStreaming ? undefined : isStreaming,
        tools: tools?.map((tool) => this.convertChatCompletionToolToResponseTool(tool)),
      } as OpenAI.Responses.ResponseCreateParamsStreaming | OpenAI.Responses.ResponseCreateParams;

      if (debugParams?.responses?.()) {
        console.log('[requestPayload]');
        console.log(JSON.stringify(postPayload), '\n');
      }

      log('sending responses.create request');

      const response = await this.client.responses.create(postPayload, {
        headers: options?.requestHeaders,
        signal: options?.signal,
      });

      const streamOptions: OpenAIStreamOptions = {
        bizErrorTypeTransformer: chatCompletion?.handleStreamBizErrorType,
        callbacks: options?.callback,
        payload: {
          model: payload.model,
          pricing: await getModelPricing(payload.model, this.id),
          provider: this.id,
        },
      };

      if (isStreaming) {
        log('processing streaming Responses API response');
        const stream = response as Stream<OpenAI.Responses.ResponseStreamEvent>;
        const [prod, useForDebug] = stream.tee();

        if (debugParams?.responses?.()) {
          const useForDebugStream =
            useForDebug instanceof ReadableStream ? useForDebug : useForDebug.toReadableStream();

          debugStream(useForDebugStream).catch(console.error);
        }

        return StreamingResponse(OpenAIResponsesStream(prod, { ...streamOptions, inputStartAt }), {
          headers: options?.headers,
        });
      }

      log('processing non-streaming Responses API response');

      // Handle non-streaming response
      if (debugParams?.responses?.()) {
        debugResponse(response);
      }

      if (responseMode === 'json') {
        log('returning JSON response mode');
        return Response.json(response);
      }

      log('transforming non-streaming Responses API response to stream');
      const stream = transformResponseAPIToStream(response as OpenAI.Responses.Response);

      return StreamingResponse(
        OpenAIResponsesStream(stream, { ...streamOptions, enableStreaming: false, inputStartAt }),
        {
          headers: options?.headers,
        },
      );
    }

    private convertChatCompletionToolToResponseTool = (
      tool: ChatCompletionTool,
    ): OpenAI.Responses.Tool => {
      return { type: tool.type, ...tool.function } as any;
    };

    private async generateObjectWithTools(
      payload: GenerateObjectPayload,
      options?: GenerateObjectOptions,
    ) {
      const { messages, model, tools, responseApi } = payload;
      const log = debug(`${this.logPrefix}:generateObject`);

      log(
        'generateObjectWithTools called with model: %s, toolsCount: %d',
        model,
        tools?.length || 0,
      );

      // Factory-level Responses API routing control (supports instance override)
      const shouldUseResponses = (() => {
        const instanceGenerateObject = ((this._options as any).generateObject || {}) as {
          useResponse?: boolean;
          useResponseModels?: Array<string | RegExp>;
        };
        const flagUseResponse =
          instanceGenerateObject.useResponse ??
          (generateObjectConfig ? generateObjectConfig.useResponse : undefined);
        const flagUseResponseModels =
          instanceGenerateObject.useResponseModels ?? generateObjectConfig?.useResponseModels;

        if (responseApi) {
          log('using Responses API due to explicit responseApi flag');
          return true;
        }

        if (flagUseResponse) {
          log('using Responses API due to useResponse flag');
          return true;
        }

        // Use factory-configured model list if provided
        if (model && flagUseResponseModels?.length) {
          const matches = flagUseResponseModels.some((m: string | RegExp) =>
            typeof m === 'string' ? model.includes(m) : (m as RegExp).test(model),
          );
          if (matches) {
            log('using Responses API: model %s matches useResponseModels config', model);
            return true;
          }
        }

        // Default: use built-in responsesAPIModels
        if (model && responsesAPIModels.has(model)) {
          log('using Responses API: model %s in built-in responsesAPIModels', model);
          return true;
        }

        log('using Chat Completions API for tool calling');
        return false;
      })();

      if (shouldUseResponses) {
        log('calling responses.create for tool calling');
        const input = await convertOpenAIResponseInputs(messages as any);

        const res = await this.client.responses.create(
          {
            input,
            model,
            tool_choice: 'required',
            tools: tools!.map((tool) => this.convertChatCompletionToolToResponseTool(tool)),
            user: options?.user,
          },
          { headers: options?.headers, signal: options?.signal },
        );

        const functionCalls = res.output?.filter((item: any) => item.type === 'function_call');

        log('received %d function calls from Responses API', functionCalls?.length || 0);

        try {
          const result = functionCalls?.map((item: any) => ({
            arguments:
              typeof item.arguments === 'string' ? JSON.parse(item.arguments) : item.arguments,
            name: item.name,
          }));
          log(
            'successfully parsed function calls: %O',
            result?.map((r) => r.name),
          );
          return result;
        } catch (error) {
          log('failed to parse tool call arguments: %O', error);
          console.error('parse tool call arguments error:', res);
          return undefined;
        }
      }

      log('calling chat.completions.create for tool calling');
      const msgs = messages;

      const res = await this.client.chat.completions.create(
        {
          messages: msgs,
          model,
          tool_choice: 'required',
          tools,
          user: options?.user,
        },
        { headers: options?.headers, signal: options?.signal },
      );

      const toolCalls = res.choices[0].message.tool_calls!;

      log('received %d tool calls from Chat Completions API', toolCalls?.length || 0);

      try {
        const result = toolCalls.map((item) => ({
          arguments: JSON.parse(item.function.arguments),
          name: item.function.name,
        }));
        log(
          'successfully parsed tool calls: %O',
          result.map((r) => r.name),
        );
        return result;
      } catch (error) {
        log('failed to parse tool call arguments: %O', error);
        console.error('parse tool call arguments error:', res);
        return undefined;
      }
    }
  };
};
