import { createOpenAICompatibleRuntime } from '../../core/openaiCompatibleFactory';
import { ModelProvider } from '../../types';
import { processMultiProviderModelList } from '../../utils/modelParse';

export interface AkashChatModelCard {
  id: string;
}

export const LobeAkashChatAI = createOpenAICompatibleRuntime({
  baseURL: 'https://chatapi.akash.network/api/v1',
  chatCompletion: {
    handlePayload: (payload) => {
      const { model, ...rest } = payload;

      return {
        ...rest,
        model,
        stream: true,
      } as any;
    },
  },
  debug: {
    chatCompletion: () => process.env.DEBUG_AKASH_CHAT_COMPLETION === '1',
  },
  models: async ({ client }) => {
    try {
      const modelsPage = (await client.models.list()) as any;
      const rawList: any[] = modelsPage.data || [];

      // Remove `created` field from each model item
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const modelList: AkashChatModelCard[] = rawList.map(({ created: _, ...rest }) => rest);

      return await processMultiProviderModelList(modelList, 'akashchat');
    } catch (error) {
      console.warn(
        'Failed to fetch AkashChat models. Please ensure your AkashChat API key is valid:',
        error,
      );
      return [];
    }
  },
  provider: ModelProvider.AkashChat,
});
