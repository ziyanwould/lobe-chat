// @vitest-environment node
import { ModelProvider } from '@lobechat/model-runtime';

import { testProvider } from '../../providerTestUtils';
import { LobeMinimaxAI } from './index';

const provider = ModelProvider.Minimax;
const defaultBaseURL = 'https://api.minimax.chat/v1';

testProvider({
  Runtime: LobeMinimaxAI,
  provider,
  defaultBaseURL,
  chatDebugEnv: 'DEBUG_MINIMAX_CHAT_COMPLETION',
  chatModel: 'abab6.5s-chat',
  test: {
    skipAPICall: true,
  },
});
