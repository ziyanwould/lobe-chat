// @vitest-environment node
import { ModelProvider } from '@lobechat/model-runtime';

import { testProvider } from '../../providerTestUtils';
import { LobeFireworksAI } from './index';

const provider = ModelProvider.FireworksAI;
const defaultBaseURL = 'https://api.fireworks.ai/inference/v1';

testProvider({
  Runtime: LobeFireworksAI,
  provider,
  defaultBaseURL,
  chatDebugEnv: 'DEBUG_FIREWORKSAI_CHAT_COMPLETION',
  chatModel: 'deepseek-r1',
});
