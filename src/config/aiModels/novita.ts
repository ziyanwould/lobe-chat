import { AIChatModelCard } from '@/types/aiModel';

// https://novita.ai/pricing
const novitaChatModels: AIChatModelCard[] = [
  {
    abilities: {
      reasoning: true,
    },
    contextWindowTokens: 131_072,
    displayName: 'Kimi K2 Instruct',
    id: 'moonshotai/kimi-k2-instruct',
    pricing: {
      units: [
        { name: 'textInput', rate: 0.57, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 2.3, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },
  {
    abilities: {
      reasoning: true,
      vision: true,
    },
    contextWindowTokens: 65_536,
    displayName: 'GLM 4.1V 9B Thinking',
    id: 'thudm/glm-4.1v-9b-thinking',
    pricing: {
      units: [
        { name: 'textInput', rate: 0.035, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 0.138, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },
  {
    contextWindowTokens: 120_000,
    displayName: 'ERNIE 4.5 0.3B',
    id: 'baidu/ernie-4.5-0.3b',
    pricing: {
      units: [
        { name: 'textInput', rate: 0, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 0, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },
  {
    contextWindowTokens: 120_000,
    displayName: 'ERNIE 4.5 21B A3B',
    id: 'baidu/ernie-4.5-21B-a3b',
    pricing: {
      units: [
        { name: 'textInput', rate: 0, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 0, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },
  {
    abilities: {
      reasoning: true,
    },
    contextWindowTokens: 123_000,
    displayName: 'ERNIE 4.5 300B A47B Paddle',
    id: 'baidu/ernie-4.5-300b-a47b-paddle',
    pricing: {
      units: [
        { name: 'textInput', rate: 0.28, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 1.1, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },
  {
    abilities: {
      reasoning: true,
      vision: true,
    },
    contextWindowTokens: 30_000,
    displayName: 'ERNIE 4.5 VL 28B A3B',
    id: 'baidu/ernie-4.5-vl-28b-a3b',
    pricing: {
      units: [
        { name: 'textInput', rate: 0, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 0, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
      reasoning: true,
      vision: true,
    },
    contextWindowTokens: 123_000,
    displayName: 'ERNIE 4.5 VL 424B A47B',
    id: 'baidu/ernie-4.5-vl-424b-a47b',
    pricing: {
      units: [
        { name: 'textInput', rate: 0.42, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 1.25, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
      reasoning: true,
    },
    contextWindowTokens: 1_000_000,
    displayName: 'MiniMax M1 80K',
    id: 'minimaxai/minimax-m1-80k',
    pricing: {
      units: [
        { name: 'textInput', rate: 0.55, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 2.2, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },
  {
    abilities: {
      reasoning: true,
    },
    contextWindowTokens: 128_000,
    displayName: 'Qwen3 4B FP8',
    id: 'qwen/qwen3-4b-fp8',
    pricing: {
      units: [
        { name: 'textInput', rate: 0, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 0, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },
  {
    abilities: {
      reasoning: true,
    },
    contextWindowTokens: 40_960,
    displayName: 'Qwen3 235B A22B FP8',
    id: 'qwen/qwen3-235b-a22b-fp8',
    pricing: {
      units: [
        { name: 'textInput', rate: 0.2, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 0.8, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },
  {
    abilities: {
      reasoning: true,
    },
    contextWindowTokens: 40_960,
    displayName: 'Qwen3 30B A3B FP8',
    id: 'qwen/qwen3-30b-a3b-fp8',
    pricing: {
      units: [
        { name: 'textInput', rate: 0.1, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 0.45, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },
  {
    abilities: {
      reasoning: true,
    },
    contextWindowTokens: 40_960,
    displayName: 'Qwen3 32B FP8',
    id: 'qwen/qwen3-32b-fp8',
    pricing: {
      units: [
        { name: 'textInput', rate: 0.1, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 0.45, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
    },
    contextWindowTokens: 131_072,
    displayName: 'Llama 3.3 70B Instruct',
    id: 'meta-llama/llama-3.3-70b-instruct',
    pricing: {
      units: [
        { name: 'textInput', rate: 0.13, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 0.39, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },
  {
    contextWindowTokens: 128_000,
    displayName: 'Qwen3 8B FP8',
    id: 'qwen/qwen3-8b-fp8',
    pricing: {
      units: [
        { name: 'textInput', rate: 0.035, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 0.138, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
    },
    contextWindowTokens: 131_072,
    displayName: 'Llama 4 Scout 17B Instruct',
    enabled: true,
    id: 'meta-llama/llama-4-scout-17b-16e-instruct',
    pricing: {
      units: [
        { name: 'textInput', rate: 0.1, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 0.5, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
    },
    contextWindowTokens: 1_048_576,
    displayName: 'Llama 4 Maverick 17B Instruct',
    enabled: true,
    id: 'meta-llama/llama-4-maverick-17b-128e-instruct-fp8',
    pricing: {
      units: [
        { name: 'textInput', rate: 0.2, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 0.85, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },
  {
    contextWindowTokens: 16_384,
    description: 'Llama 3.1 8B Instruct  优化了高质量对话场景，表现优于许多领先的闭源模型。',
    displayName: 'Llama 3.1 8B Instruct',
    id: 'meta-llama/llama-3.1-8b-instruct',
    pricing: {
      units: [
        { name: 'textInput', rate: 0.02, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 0.05, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },
  {
    contextWindowTokens: 8192,
    description: 'Llama 3 8B Instruct 优化了高质量对话场景，性能优于许多闭源模型。',
    displayName: 'Llama 3 8B Instruct',
    id: 'meta-llama/llama-3-8b-instruct',
    pricing: {
      units: [
        { name: 'textInput', rate: 0.04, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 0.04, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },
  {
    contextWindowTokens: 8192,
    description: 'Llama 3 70B Instruct 优化用于高质量对话场景，在各类人类评估中表现优异。',
    displayName: 'Llama 3 70B Instruct',
    id: 'meta-llama/llama-3-70b-instruct',
    pricing: {
      units: [
        { name: 'textInput', rate: 0.51, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 0.74, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },
  {
    contextWindowTokens: 32_000,
    description: 'Gemma 3 27B 是谷歌的一款开源语言模型，以其在效率和性能方面设立了新的标准。',
    displayName: 'Gemma 3 27B',
    id: 'google/gemma-3-27b-it',
    pricing: {
      units: [
        { name: 'textInput', rate: 0.2, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 0.2, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },
  {
    contextWindowTokens: 32_768,
    description: 'Gemma 3 1B 是谷歌的一款开源语言模型，以其在效率和性能方面设立了新的标准。',
    displayName: 'Gemma 3 1B',
    id: 'google/gemma-3-1b-it',
    pricing: {
      units: [
        { name: 'textInput', rate: 0, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 0, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },
  {
    contextWindowTokens: 60_288,
    description: 'Mistral Nemo 是多语言支持和高性能编程的7.3B参数模型。',
    displayName: 'Mistral Nemo',
    id: 'mistralai/mistral-nemo',
    pricing: {
      units: [
        { name: 'textInput', rate: 0.04, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 0.17, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },
  {
    contextWindowTokens: 32_768,
    description: 'Mistral 7B Instruct 是一款兼有速度优化和长上下文支持的高性能行业标准模型。',
    displayName: 'Mistral 7B Instruct',
    id: 'mistralai/mistral-7b-instruct',
    pricing: {
      units: [
        { name: 'textInput', rate: 0.029, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 0.059, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },
  {
    contextWindowTokens: 65_535,
    description: 'WizardLM-2 8x22B 是微软AI最先进的Wizard模型，显示出极其竞争力的表现。',
    displayName: 'WizardLM-2 8x22B',
    id: 'microsoft/wizardlm-2-8x22b',
    pricing: {
      units: [
        { name: 'textInput', rate: 0.62, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 0.62, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },
  {
    contextWindowTokens: 16_000,
    description: 'Dolphin Mixtral 8x22B 是一款为指令遵循、对话和编程设计的模型。',
    displayName: 'Dolphin Mixtral 8x22B',
    id: 'cognitivecomputations/dolphin-mixtral-8x22b',
    pricing: {
      units: [
        { name: 'textInput', rate: 0.9, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 0.9, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },
  {
    contextWindowTokens: 8192,
    description: 'Hermes 2 Pro Llama 3 8B 是 Nous Hermes 2的升级版本，包含最新的内部开发的数据集。',
    displayName: 'Hermes 2 Pro Llama 3 8B',
    id: 'nousresearch/hermes-2-pro-llama-3-8b',
    pricing: {
      units: [
        { name: 'textInput', rate: 0.14, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 0.14, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },
  {
    contextWindowTokens: 4096,
    description: 'MythoMax l2 13B 是一款合并了多个顶尖模型的创意与智能相结合的语言模型。',
    displayName: 'MythoMax l2 13B',
    id: 'gryphe/mythomax-l2-13b',
    pricing: {
      units: [
        { name: 'textInput', rate: 0.09, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 0.09, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },
  {
    contextWindowTokens: 160_000,
    displayName: 'Deepseek Prover V2 671B',
    id: 'deepseek/deepseek-prover-v2-671b',
    pricing: {
      units: [
        { name: 'textInput', rate: 0.7, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 2.5, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
    },
    contextWindowTokens: 64_000,
    displayName: 'Deepseek V3 Turbo',
    id: 'deepseek/deepseek-v3-turbo',
    pricing: {
      units: [
        { name: 'textInput', rate: 0.4, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 1.3, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
    },
    contextWindowTokens: 163_840,
    displayName: 'Deepseek V3 0324',
    enabled: true,
    id: 'deepseek/deepseek-v3-0324',
    pricing: {
      units: [
        { name: 'textInput', rate: 0.28, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 1.14, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
      reasoning: true,
    },
    contextWindowTokens: 163_840,
    displayName: 'Deepseek R1 0528',
    enabled: true,
    id: 'deepseek/deepseek-r1-0528',
    pricing: {
      units: [
        { name: 'textInput', rate: 0.7, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 2.5, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },
  {
    abilities: {
      reasoning: true,
    },
    contextWindowTokens: 128_000,
    displayName: 'DeepSeek R1 0528 Qwen3 8B',
    id: 'deepseek/deepseek-r1-0528-qwen3-8b',
    pricing: {
      units: [
        { name: 'textInput', rate: 0.06, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 0.09, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
      reasoning: true,
    },
    contextWindowTokens: 64_000,
    displayName: 'Deepseek R1 Turbo',
    id: 'deepseek/deepseek-r1-turbo',
    pricing: {
      units: [
        { name: 'textInput', rate: 0.7, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 2.5, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },
  {
    abilities: {
      reasoning: true,
    },
    contextWindowTokens: 32_000,
    displayName: 'Deepseek R1 Distill Llama 70B',
    id: 'deepseek/deepseek-r1-distill-llama-70b',
    pricing: {
      units: [
        { name: 'textInput', rate: 0.8, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 0.8, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },
  {
    abilities: {
      reasoning: true,
    },
    contextWindowTokens: 64_000,
    displayName: 'Deepseek R1 Distill Qwen 14B',
    id: 'deepseek/deepseek-r1-distill-qwen-14b',
    pricing: {
      units: [
        { name: 'textInput', rate: 0.15, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 0.15, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },
  {
    abilities: {
      reasoning: true,
    },
    contextWindowTokens: 64_000,
    displayName: 'Deepseek R1 Distill Qwen 32B',
    id: 'deepseek/deepseek-r1-distill-qwen-32b',
    pricing: {
      units: [
        { name: 'textInput', rate: 0.3, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 0.3, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },
  {
    contextWindowTokens: 8192,
    displayName: 'L3 8B Stheno v3.2',
    id: 'Sao10K/L3-8B-Stheno-v3.2',
    pricing: {
      units: [
        { name: 'textInput', rate: 0.05, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 0.05, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },
  {
    abilities: {
      reasoning: true,
    },
    contextWindowTokens: 32_000,
    displayName: 'Deepseek R1 Distill Llama 8B',
    id: 'deepseek/deepseek-r1-distill-llama-8b',
    pricing: {
      units: [
        { name: 'textInput', rate: 0.04, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 0.04, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
    },
    contextWindowTokens: 32_000,
    displayName: 'Qwen2.5 72B Instruct',
    id: 'qwen/qwen-2.5-72b-instruct',
    pricing: {
      units: [
        { name: 'textInput', rate: 0.38, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 0.4, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },
  {
    contextWindowTokens: 8192,
    displayName: 'L3 70B Euryale v2.1',
    id: 'sao10k/l3-70b-euryale-v2.1',
    pricing: {
      units: [
        { name: 'textInput', rate: 1.48, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 1.48, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },
  {
    contextWindowTokens: 4096,
    displayName: 'Midnight Rose 70B',
    id: 'sophosympatheia/midnight-rose-70b',
    pricing: {
      units: [
        { name: 'textInput', rate: 0.8, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 0.8, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },
  {
    contextWindowTokens: 8192,
    displayName: 'L3 8B Lunaris',
    id: 'sao10k/l3-8b-lunaris',
    pricing: {
      units: [
        { name: 'textInput', rate: 0.05, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 0.05, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },
  {
    abilities: {
      vision: true,
    },
    contextWindowTokens: 32_768,
    displayName: 'Qwen2.5 VL 72B Instruct',
    enabled: true,
    id: 'qwen/qwen2.5-vl-72b-instruct',
    pricing: {
      units: [
        { name: 'textInput', rate: 0.8, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 0.8, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },
  {
    contextWindowTokens: 131_000,
    displayName: 'Llama 3.2 1B Instruct',
    id: 'meta-llama/llama-3.2-1b-instruct',
    pricing: {
      units: [
        { name: 'textInput', rate: 0, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 0, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
    },
    contextWindowTokens: 32_768,
    displayName: 'Llama 3.2 3B Instruct',
    id: 'meta-llama/llama-3.2-3b-instruct',
    pricing: {
      units: [
        { name: 'textInput', rate: 0.03, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 0.05, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },
  {
    contextWindowTokens: 8192,
    displayName: 'Llama 3.1 8B Instruct BF16',
    id: 'meta-llama/llama-3.1-8b-instruct-bf16',
    pricing: {
      units: [
        { name: 'textInput', rate: 0.06, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 0.06, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },
  {
    contextWindowTokens: 8192,
    displayName: 'L31 70B Euryale v2.2',
    id: 'sao10k/l31-70b-euryale-v2.2',
    pricing: {
      units: [
        { name: 'textInput', rate: 1.48, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 1.48, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
    },
    contextWindowTokens: 32_000,
    displayName: 'Qwen2.5 7B Instruct',
    id: 'qwen/qwen2.5-7b-instruct',
    pricing: {
      units: [
        { name: 'textInput', rate: 0, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 0, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
    },
    contextWindowTokens: 32_000,
    displayName: 'GLM 4 32B 0414',
    id: 'thudm/glm-4-32b-0414',
    pricing: {
      units: [
        { name: 'textInput', rate: 0.24, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 0.24, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },
];

export const allModels = [...novitaChatModels];

export default allModels;
