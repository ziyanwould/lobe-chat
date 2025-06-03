/*
 * @Author: liujiarong 448736378@qq.com
 * @Date: 2025-06-03 11:05:27
 * @LastEditors: liujiarong 448736378@qq.com
 * @LastEditTime: 2025-06-03 11:07:42
 * @FilePath: /lobe-chat/src/libs/model-runtime/perplexity/index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import OpenAI from 'openai';

import { ChatStreamPayload, ModelProvider } from '../types';
import { createOpenAICompatibleRuntime } from '../utils/openaiCompatibleFactory';

export const LobePerplexityAI = createOpenAICompatibleRuntime({
  baseURL: 'https://api.perplexity.ai',
  chatCompletion: {
    handlePayload: (payload: ChatStreamPayload) => {
      // Set a default frequency penalty value greater than 0
      const { presence_penalty, frequency_penalty, stream = true, temperature, ...res } = payload;

      let param;

      // Ensure we are only have one frequency_penalty or frequency_penalty
      if (presence_penalty !== 0) {
        param = { presence_penalty };
      } else {
        const defaultFrequencyPenalty = 1;

        param = { frequency_penalty: frequency_penalty || defaultFrequencyPenalty };
      }

      return {
        ...res,
        ...param,
        stream,
        temperature: temperature >= 2 ? undefined : temperature,
      } as OpenAI.ChatCompletionCreateParamsStreaming;
    },
  },
  debug: {
    chatCompletion: () => process.env.DEBUG_PERPLEXITY_CHAT_COMPLETION === '1',
  },
  provider: ModelProvider.Perplexity,
});
