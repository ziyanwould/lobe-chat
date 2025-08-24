import { AgentRuntimeErrorType } from '../error';
import { ChatCompletionErrorPayload, ModelProvider } from '../types';
import { processMultiProviderModelList } from '../utils/modelParse';
import { createOpenAICompatibleRuntime } from '../utils/openaiCompatibleFactory';

export interface Ai302ModelCard {
  id: string;
}

export const Lobe302AI = createOpenAICompatibleRuntime({
  baseURL: 'https://api.302.ai/v1',
  chatCompletion: {
    handleError: (error: any): Omit<ChatCompletionErrorPayload, 'provider'> | undefined => {
      let errorResponse: Response | undefined;
      if (error instanceof Response) {
        errorResponse = error;
      } else if ('status' in (error as any)) {
        errorResponse = error as Response;
      }
      if (errorResponse && errorResponse.status === 401) {
        return {
          error: errorResponse.status,
          errorType: AgentRuntimeErrorType.InvalidProviderAPIKey,
        };
      }

      return {
        error,
      };
    },
  },
  debug: {
    chatCompletion: () => process.env.DEBUG_SILICONCLOUD_CHAT_COMPLETION === '1',
  },
  errorType: {
    bizError: AgentRuntimeErrorType.ProviderBizError,
    invalidAPIKey: AgentRuntimeErrorType.InvalidProviderAPIKey,
  },
  models: async ({ client }) => {
    const modelsPage = (await client.models.list()) as any;
    const modelList: Ai302ModelCard[] = modelsPage.data;

    return processMultiProviderModelList(modelList, 'ai302');
  },
  provider: ModelProvider.Ai302,
});
