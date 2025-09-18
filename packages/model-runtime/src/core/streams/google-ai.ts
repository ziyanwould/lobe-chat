import { GenerateContentResponse } from '@google/genai';

import errorLocale from '@/locales/default/error';
import { ModelTokensUsage } from '@/types/message';
import { GroundingSearch } from '@/types/search';

import { ChatStreamCallbacks } from '../../types';
import { nanoid } from '../../utils/uuid';
import {
  StreamContext,
  StreamProtocolChunk,
  StreamToolCallChunkData,
  createCallbacksTransformer,
  createSSEProtocolTransformer,
  createTokenSpeedCalculator,
  generateToolCallId,
} from './protocol';

export const LOBE_ERROR_KEY = '__lobe_error';

const getBlockReasonMessage = (blockReason: string): string => {
  const blockReasonMessages = errorLocale.response.GoogleAIBlockReason;

  return (
    blockReasonMessages[blockReason as keyof typeof blockReasonMessages] ||
    blockReasonMessages.default.replace('{{blockReason}}', blockReason)
  );
};

const transformGoogleGenerativeAIStream = (
  chunk: GenerateContentResponse,
  context: StreamContext,
): StreamProtocolChunk | StreamProtocolChunk[] => {
  // Handle injected internal error marker to pass through detailed error info
  if ((chunk as any)?.[LOBE_ERROR_KEY]) {
    return {
      data: (chunk as any)[LOBE_ERROR_KEY],
      id: context?.id || 'error',
      type: 'error',
    };
  }
  // Handle promptFeedback with blockReason (e.g., PROHIBITED_CONTENT)
  if ('promptFeedback' in chunk && (chunk as any).promptFeedback?.blockReason) {
    const blockReason = (chunk as any).promptFeedback.blockReason;
    const humanFriendlyMessage = getBlockReasonMessage(blockReason);

    return {
      data: {
        body: {
          context: {
            promptFeedback: (chunk as any).promptFeedback,
          },
          message: humanFriendlyMessage,
          provider: 'google',
        },
        type: 'ProviderBizError',
      },
      id: context?.id || 'error',
      type: 'error',
    };
  }

  // maybe need another structure to add support for multiple choices
  const candidate = chunk.candidates?.[0];
  const usage = chunk.usageMetadata;
  const usageChunks: StreamProtocolChunk[] = [];
  if (candidate?.finishReason && usage) {
    // totalTokenCount = promptTokenCount + candidatesTokenCount + thoughtsTokenCount
    const reasoningTokens = usage.thoughtsTokenCount;

    const candidatesDetails = usage.candidatesTokensDetails;
    const candidatesTotal =
      usage.candidatesTokenCount ??
      candidatesDetails?.reduce((s: number, i: any) => s + (i?.tokenCount ?? 0), 0) ??
      0;

    const outputImageTokens =
      candidatesDetails?.find((i: any) => i.modality === 'IMAGE')?.tokenCount ?? 0;
    const outputTextTokens =
      candidatesDetails?.find((i: any) => i.modality === 'TEXT')?.tokenCount ??
      Math.max(0, candidatesTotal - outputImageTokens);

    const totalOutputTokens = candidatesTotal + (reasoningTokens ?? 0);

    usageChunks.push(
      { data: candidate.finishReason, id: context?.id, type: 'stop' },
      {
        data: {
          inputCachedTokens: usage.cachedContentTokenCount,
          inputImageTokens: usage.promptTokensDetails?.find((i) => i.modality === 'IMAGE')
            ?.tokenCount,
          inputTextTokens: usage.promptTokensDetails?.find((i) => i.modality === 'TEXT')
            ?.tokenCount,
          outputImageTokens,
          outputReasoningTokens: reasoningTokens,
          outputTextTokens,
          totalInputTokens: usage.promptTokenCount,
          totalOutputTokens,
          totalTokens: usage.totalTokenCount,
        } as ModelTokensUsage,
        id: context?.id,
        type: 'usage',
      },
    );
  }

  const functionCalls = chunk.functionCalls;

  if (functionCalls) {
    return [
      {
        data: functionCalls.map(
          (value, index): StreamToolCallChunkData => ({
            function: {
              arguments: JSON.stringify(value.args),
              name: value.name,
            },
            id: generateToolCallId(index, value.name),
            index: index,
            type: 'function',
          }),
        ),
        id: context.id,
        type: 'tool_calls',
      },
      ...usageChunks,
    ];
  }

  const text = chunk.text;

  if (candidate) {
    // 首先检查是否为 reasoning 内容 (thought: true)
    if (Array.isArray(candidate.content?.parts) && candidate.content.parts.length > 0) {
      for (const part of candidate.content.parts) {
        if (part && part.text && part.thought === true) {
          return { data: part.text, id: context.id, type: 'reasoning' };
        }
      }
    }

    // return the grounding
    const { groundingChunks, webSearchQueries } = candidate.groundingMetadata ?? {};
    if (groundingChunks) {
      return [
        { data: text, id: context.id, type: 'text' },
        {
          data: {
            citations: groundingChunks?.map((chunk) => ({
              // google 返回的 uri 是经过 google 自己处理过的 url，因此无法展现真实的 favicon
              // 需要使用 title 作为替换
              favicon: chunk.web?.title,
              title: chunk.web?.title,
              url: chunk.web?.uri,
            })),
            searchQueries: webSearchQueries,
          } as GroundingSearch,
          id: context.id,
          type: 'grounding',
        },
        ...usageChunks,
      ];
    }

    // Check for image data before handling finishReason
    if (Array.isArray(candidate.content?.parts) && candidate.content.parts.length > 0) {
      const part = candidate.content.parts[0];

      if (part && part.inlineData && part.inlineData.data && part.inlineData.mimeType) {
        const imageChunk = {
          data: `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`,
          id: context.id,
          type: 'base64_image' as const,
        };

        // If also has finishReason, combine image with finish chunks
        if (candidate.finishReason) {
          const chunks: StreamProtocolChunk[] = [imageChunk];
          if (chunk.usageMetadata) {
            // usageChunks already includes the 'stop' chunk as its first entry when usage exists,
            // so append usageChunks to avoid sending a duplicate 'stop'.
            chunks.push(...usageChunks);
          } else {
            // No usage metadata, we need to send the stop chunk explicitly.
            chunks.push({ data: candidate.finishReason, id: context?.id, type: 'stop' });
          }
          return chunks;
        }

        return imageChunk;
      }
    }

    if (candidate.finishReason) {
      if (chunk.usageMetadata) {
        return [
          !!text ? { data: text, id: context?.id, type: 'text' } : undefined,
          ...usageChunks,
        ].filter(Boolean) as StreamProtocolChunk[];
      }
      return { data: candidate.finishReason, id: context?.id, type: 'stop' };
    }

    if (!!text?.trim()) return { data: text, id: context?.id, type: 'text' };
  }

  return {
    data: text || '',
    id: context?.id,
    type: 'text',
  };
};

export interface GoogleAIStreamOptions {
  callbacks?: ChatStreamCallbacks;
  enableStreaming?: boolean; // 选择 TPS 计算方式（非流式时传 false）
  inputStartAt?: number;
}

export const GoogleGenerativeAIStream = (
  rawStream: ReadableStream<GenerateContentResponse>,
  { callbacks, inputStartAt, enableStreaming = true }: GoogleAIStreamOptions = {},
) => {
  const streamStack: StreamContext = { id: 'chat_' + nanoid() };

  return rawStream
    .pipeThrough(
      createTokenSpeedCalculator(transformGoogleGenerativeAIStream, {
        enableStreaming: enableStreaming,
        inputStartAt,
        streamStack,
      }),
    )
    .pipeThrough(
      createSSEProtocolTransformer((c) => c, streamStack, { requireTerminalEvent: true }),
    )
    .pipeThrough(createCallbacksTransformer(callbacks));
};
