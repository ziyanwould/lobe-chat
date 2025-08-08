import { AIChatModelCard } from '@/types/aiModel';

const aihubmixModels: AIChatModelCard[] = [
  {
    abilities: {
      functionCall: true,
      imageOutput: true,
      reasoning: true,
      search: true,
      vision: true,
    },
    contextWindowTokens: 400_000,
    description:
      '跨领域编码和代理任务的最佳模型。GPT-5 在准确性、速度、推理、上下文识别、结构化思维和问题解决方面实现了飞跃。',
    displayName: 'GPT-5',
    enabled: true,
    id: 'gpt-5',
    maxOutput: 128_000,
    pricing: {
      units: [
        { name: 'textInput', rate: 1.25, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 10, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput_cacheRead', rate: 0.13, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    releasedAt: '2025-08-07',
    settings: {
      extendParams: ['reasoningEffort'],
      searchImpl: 'params',
    },
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
      reasoning: true,
      search: true,
      vision: true,
    },
    contextWindowTokens: 400_000,
    description:
      '更快、更经济高效的 GPT-5 版本，适用于明确定义的任务。在保持高质量输出的同时，提供更快的响应速度。',
    displayName: 'GPT-5 mini',
    enabled: true,
    id: 'gpt-5-mini',
    maxOutput: 128_000,
    pricing: {
      units: [
        { name: 'textInput', rate: 0.25, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 2, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput_cacheRead', rate: 0.03, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    releasedAt: '2025-08-07',
    settings: {
      extendParams: ['reasoningEffort'],
      searchImpl: 'params',
    },
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
      reasoning: true,
      vision: true,
    },
    contextWindowTokens: 400_000,
    description: '最快、最经济高效的 GPT-5 版本。非常适合需要快速响应且成本敏感的应用场景。',
    displayName: 'GPT-5 nano',
    enabled: true,
    id: 'gpt-5-nano',
    maxOutput: 128_000,
    pricing: {
      units: [
        { name: 'textInput', rate: 0.05, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 0.4, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput_cacheRead', rate: 0.01, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    releasedAt: '2025-08-07',
    type: 'chat',
  },
  {
    abilities: {
      vision: true,
    },
    contextWindowTokens: 400_000,
    description:
      'ChatGPT 中使用的 GPT-5 模型。结合了强大的语言理解与生成能力，适合对话式交互应用。',
    displayName: 'GPT-5 Chat',
    enabled: true,
    id: 'gpt-5-chat-latest',
    maxOutput: 128_000,
    pricing: {
      units: [
        { name: 'textInput', rate: 1.25, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 10, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput_cacheRead', rate: 0.13, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    releasedAt: '2025-08-07',
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
      reasoning: true,
      search: true,
      vision: true,
    },
    contextWindowTokens: 200_000,
    description:
      'o4-mini 是我们最新的小型 o 系列模型。 它专为快速有效的推理而优化，在编码和视觉任务中表现出极高的效率和性能。',
    displayName: 'o4-mini',
    enabled: true,
    id: 'o4-mini',
    maxOutput: 100_000,
    pricing: {
      units: [
        { name: 'textInput', rate: 1.1, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 4.4, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput_cacheRead', rate: 0.275, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    releasedAt: '2025-04-17',
    settings: {
      extendParams: ['reasoningEffort'],
      searchImpl: 'params',
    },
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
      reasoning: true,
      search: true,
      vision: true,
    },
    contextWindowTokens: 200_000,
    description:
      'o4-mini-deep-research 是我们更快速、更实惠的深度研究模型——非常适合处理复杂的多步骤研究任务。它可以从互联网上搜索和综合信息，也可以通过 MCP 连接器访问并利用你的自有数据。',
    displayName: 'o4-mini Deep Research',
    id: 'o4-mini-deep-research',
    maxOutput: 100_000,
    pricing: {
      units: [
        { name: 'textInput', rate: 2, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 8, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput_cacheRead', rate: 0.5, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    releasedAt: '2025-06-26',
    settings: {
      extendParams: ['reasoningEffort'],
      searchImpl: 'params',
    },
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
      reasoning: true,
      search: true,
      vision: true,
    },
    contextWindowTokens: 200_000,
    description:
      'o3-pro 模型使用更多的计算来更深入地思考并始终提供更好的答案，仅支持 Responses API 下使用。',
    displayName: 'o3-pro',
    id: 'o3-pro',
    maxOutput: 100_000,
    pricing: {
      units: [
        { name: 'textInput', rate: 20, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 80, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    releasedAt: '2025-06-10',
    settings: {
      extendParams: ['reasoningEffort'],
      searchImpl: 'params',
    },
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
      reasoning: true,
      search: true,
      vision: true,
    },
    contextWindowTokens: 200_000,
    description:
      'o3 是一款全能强大的模型，在多个领域表现出色。它为数学、科学、编程和视觉推理任务树立了新标杆。它也擅长技术写作和指令遵循。用户可利用它分析文本、代码和图像，解决多步骤的复杂问题。',
    displayName: 'o3',
    enabled: true,
    id: 'o3',
    maxOutput: 100_000,
    pricing: {
      units: [
        { name: 'textInput', rate: 2, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 8, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput_cacheRead', rate: 0.5, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    releasedAt: '2025-04-16',
    settings: {
      extendParams: ['reasoningEffort'],
      searchImpl: 'params',
    },
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
      reasoning: true,
      search: true,
      vision: true,
    },
    contextWindowTokens: 200_000,
    description:
      'o3-deep-research 是我们最先进的深度研究模型，专为处理复杂的多步骤研究任务而设计。它可以从互联网上搜索和综合信息，也可以通过 MCP 连接器访问并利用你的自有数据。',
    displayName: 'o3 Deep Research',
    id: 'o3-deep-research',
    maxOutput: 100_000,
    pricing: {
      units: [
        { name: 'textInput', rate: 10, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 40, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput_cacheRead', rate: 2.5, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    releasedAt: '2025-06-26',
    settings: {
      extendParams: ['reasoningEffort'],
      searchImpl: 'params',
    },
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
      search: true,
      vision: true,
    },
    contextWindowTokens: 1_047_576,
    description: 'GPT-4.1 是我们用于复杂任务的旗舰模型。它非常适合跨领域解决问题。',
    displayName: 'GPT-4.1',
    id: 'gpt-4.1',
    maxOutput: 32_768,
    pricing: {
      units: [
        { name: 'textInput', rate: 2, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 8, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput_cacheRead', rate: 0.5, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    releasedAt: '2025-04-14',
    settings: {
      searchImpl: 'params',
    },
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
      search: true,
      vision: true,
    },
    contextWindowTokens: 1_047_576,
    description:
      'GPT-4.1 mini 提供了智能、速度和成本之间的平衡，使其成为许多用例中有吸引力的模型。',
    displayName: 'GPT-4.1 mini',
    id: 'gpt-4.1-mini',
    maxOutput: 32_768,
    pricing: {
      units: [
        { name: 'textInput', rate: 0.4, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 1.6, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput_cacheRead', rate: 0.1, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    releasedAt: '2025-04-14',
    settings: {
      searchImpl: 'params',
    },
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
      vision: true,
    },
    contextWindowTokens: 1_047_576,
    description: 'GPT-4.1 nano 是最快，最具成本效益的GPT-4.1模型。',
    displayName: 'GPT-4.1 nano',
    id: 'gpt-4.1-nano',
    maxOutput: 32_768,
    pricing: {
      units: [
        { name: 'textInput', rate: 0.1, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 0.4, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput_cacheRead', rate: 0.025, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    releasedAt: '2025-04-14',
    type: 'chat',
  },
  {
    abilities: {
      vision: true,
    },
    contextWindowTokens: 128_000,
    description:
      'ChatGPT-4o 是一款动态模型，实时更新以保持当前最新版本。它结合了强大的语言理解与生成能力，适合于大规模应用场景，包括客户服务、教育和技术支持。',
    displayName: 'ChatGPT-4o',
    id: 'chatgpt-4o-latest',
    pricing: {
      units: [
        { name: 'textInput', rate: 5, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 15, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
      search: true,
    },
    contextWindowTokens: 131_072,
    description:
      '旗舰级模型，擅长数据提取、编程和文本摘要等企业级应用，拥有金融、医疗、法律和科学等领域的深厚知识。',
    displayName: 'Grok 3',
    enabled: true,
    id: 'grok-3',
    pricing: {
      units: [
        { name: 'textInput', rate: 3, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 15, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput_cacheRead', rate: 0.75, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    releasedAt: '2025-04-03',
    settings: {
      searchImpl: 'params',
    },
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
      reasoning: true,
      search: true,
    },
    contextWindowTokens: 131_072,
    description:
      '轻量级模型，回话前会先思考。运行快速、智能，适用于不需要深层领域知识的逻辑任务，并能获取原始的思维轨迹。',
    displayName: 'Grok 3 Mini',
    enabled: true,
    id: 'grok-3-mini',
    pricing: {
      units: [
        { name: 'textInput', rate: 0.3, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 0.5, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    releasedAt: '2025-04-03',
    settings: {
      extendParams: ['reasoningEffort'],
      searchImpl: 'params',
    },
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
      reasoning: true,
      search: true,
      vision: true,
    },
    contextWindowTokens: 200_000,
    description:
      'Claude Opus 4.1 是 Anthropic 最新的用于处理高度复杂任务的最强大模型。它在性能、智能、流畅性和理解力方面表现卓越。',
    displayName: 'Claude Opus 4.1',
    enabled: true,
    id: 'claude-opus-4-1-20250805',
    maxOutput: 32_000,
    pricing: {
      units: [
        { name: 'textInput', rate: 16.5, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 82.5, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput_cacheRead', rate: 1.5, strategy: 'fixed', unit: 'millionTokens' },
        {
          lookup: { prices: { '5m': 20.625 }, pricingParams: ['ttl'] },
          name: 'textInput_cacheWrite',
          strategy: 'lookup',
          unit: 'millionTokens',
        },
      ],
    },
    releasedAt: '2025-08-05',
    settings: {
      extendParams: ['disableContextCaching', 'enableReasoning', 'reasoningBudgetToken'],
      searchImpl: 'params',
    },
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
      reasoning: true,
      search: true,
      vision: true,
    },
    contextWindowTokens: 200_000,
    description:
      'Claude Opus 4 是 Anthropic 用于处理高度复杂任务的最强大模型。它在性能、智能、流畅性和理解力方面表现卓越。',
    displayName: 'Claude Opus 4',
    id: 'claude-opus-4-20250514',
    maxOutput: 32_000,
    pricing: {
      units: [
        { name: 'textInput', rate: 16.8, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 84, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput_cacheRead', rate: 1.5, strategy: 'fixed', unit: 'millionTokens' },
        {
          lookup: { prices: { '5m': 20.625 }, pricingParams: ['ttl'] },
          name: 'textInput_cacheWrite',
          strategy: 'lookup',
          unit: 'millionTokens',
        },
      ],
    },
    releasedAt: '2025-05-23',
    settings: {
      extendParams: ['disableContextCaching', 'enableReasoning', 'reasoningBudgetToken'],
      searchImpl: 'params',
    },
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
      reasoning: true,
      search: true,
      vision: true,
    },
    contextWindowTokens: 200_000,
    description:
      'Claude Sonnet 4 可以产生近乎即时的响应或延长的逐步思考，用户可以清晰地看到这些过程。API 用户还可以对模型思考的时间进行细致的控制',
    displayName: 'Claude Sonnet 4',
    enabled: true,
    id: 'claude-sonnet-4-20250514',
    maxOutput: 64_000,
    pricing: {
      units: [
        { name: 'textInput', rate: 3.3, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 16.5, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput_cacheRead', rate: 0.3, strategy: 'fixed', unit: 'millionTokens' },
        {
          lookup: { prices: { '5m': 4.125 }, pricingParams: ['ttl'] },
          name: 'textInput_cacheWrite',
          strategy: 'lookup',
          unit: 'millionTokens',
        },
      ],
    },
    releasedAt: '2025-05-23',
    settings: {
      extendParams: ['disableContextCaching', 'enableReasoning', 'reasoningBudgetToken'],
      searchImpl: 'params',
    },
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
      reasoning: true,
      search: true,
      vision: true,
    },
    contextWindowTokens: 200_000,
    description:
      'Claude 3.7 Sonnet 是 Anthropic 迄今为止最智能的模型，也是市场上首个混合推理模型。Claude 3.7 Sonnet 可以产生近乎即时的响应或延长的逐步思考，用户可以清晰地看到这些过程。Sonnet 特别擅长编程、数据科学、视觉处理、代理任务。',
    displayName: 'Claude 3.7 Sonnet',
    id: 'claude-3-7-sonnet-20250219',
    maxOutput: 64_000,
    pricing: {
      units: [
        { name: 'textInput', rate: 3.3, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 16.5, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput_cacheRead', rate: 0.3, strategy: 'fixed', unit: 'millionTokens' },
        {
          lookup: { prices: { '5m': 4.125 }, pricingParams: ['ttl'] },
          name: 'textInput_cacheWrite',
          strategy: 'lookup',
          unit: 'millionTokens',
        },
      ],
    },
    releasedAt: '2025-02-24',
    settings: {
      extendParams: ['disableContextCaching', 'enableReasoning', 'reasoningBudgetToken'],
      searchImpl: 'params',
    },
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
      vision: true,
    },
    contextWindowTokens: 200_000,
    description:
      'Claude 3.5 Haiku 是 Anthropic 最快的下一代模型。与 Claude 3 Haiku 相比，Claude 3.5 Haiku 在各项技能上都有所提升，并在许多智力基准测试中超越了上一代最大的模型 Claude 3 Opus。',
    displayName: 'Claude 3.5 Haiku',
    id: 'claude-3-5-haiku-20241022',
    maxOutput: 8192,
    pricing: {
      units: [
        { name: 'textInput', rate: 1.1, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 5.5, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput_cacheRead', rate: 0.1, strategy: 'fixed', unit: 'millionTokens' },
        {
          lookup: { prices: { '5m': 1.1 }, pricingParams: ['ttl'] },
          name: 'textInput_cacheWrite',
          strategy: 'lookup',
          unit: 'millionTokens',
        },
      ],
    },
    releasedAt: '2024-11-05',
    settings: {
      extendParams: ['disableContextCaching'],
    },
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
      reasoning: true,
    },
    contextWindowTokens: 65_536,
    description:
      '已升级至最新版本250528；字节火山云开源部署的满血 R1，总参数量 671B，输入最高 64k。目前最稳定，推荐用这个。',
    displayName: 'DeepSeek R1',
    enabled: true,
    id: 'DeepSeek-R1',
    pricing: {
      units: [
        { name: 'textInput', rate: 0.546, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 2.184, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
      reasoning: true,
    },
    contextWindowTokens: 65_536,
    description:
      '由微软部署提供； DeepSeek R1型号已进行小版本升级，当前版本为DeepSeek-R1-0528。在最新的更新中，DeepSeek R1通过增加计算资源和引入后训练阶段的算法优化机制，大幅提升了推理深度和推断能力。该模型在数学、编程和通用逻辑等多个基准测试中表现出色，其整体性能已接近领先模型，如O3和Gemini 2.5 Pro 。',
    displayName: 'DeepSeek R1 0528 (Azure)',
    id: 'azure-DeepSeek-R1-0528',
    pricing: {
      units: [
        { name: 'textInput', rate: 0.4, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 1.6, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
    },
    contextWindowTokens: 65_536,
    description: '字节火山云开源部署目前最稳定，推荐用这个。已经自动升级为最新发布的版本 250324 。',
    displayName: 'DeepSeek V3',
    enabled: true,
    id: 'DeepSeek-V3',
    pricing: {
      units: [
        { name: 'textInput', rate: 0.272, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 1.088, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
    },
    contextWindowTokens: 65_536,
    description:
      '模型供应商为：sophnet平台。DeepSeek V3 Fast 是 DeepSeek V3 0324 版本的高TPS极速版，满血非量化，代码与数学能力更强，响应更快！',
    displayName: 'DeepSeek V3 (Fast)',
    id: 'DeepSeek-V3-Fast',
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
      functionCall: true,
      reasoning: true,
      search: true,
      vision: true,
    },
    contextWindowTokens: 1_048_576 + 65_536,
    description:
      'Gemini 2.5 Pro 是 Google 最先进的思维模型，能够对代码、数学和STEM领域的复杂问题进行推理，以及使用长上下文分析大型数据集、代码库和文档。',
    displayName: 'Gemini 2.5 Pro',
    enabled: true,
    id: 'gemini-2.5-pro',
    maxOutput: 65_536,
    pricing: {
      units: [
        { name: 'textInput', rate: 1.25, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 10, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    releasedAt: '2025-06-17',
    settings: {
      extendParams: ['thinkingBudget'],
      searchImpl: 'params',
      searchProvider: 'google',
    },
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
      reasoning: true,
      search: true,
      vision: true,
    },
    contextWindowTokens: 1_048_576 + 65_536,
    description: 'Gemini 2.5 Flash 是 Google 性价比最高的模型，提供全面的功能。',
    displayName: 'Gemini 2.5 Flash',
    enabled: true,
    id: 'gemini-2.5-flash',
    maxOutput: 65_536,
    pricing: {
      units: [
        { name: 'textInput', rate: 0.3, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 2.5, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput_cacheRead', rate: 0.075, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    releasedAt: '2025-06-17',
    settings: {
      extendParams: ['thinkingBudget'],
      searchImpl: 'params',
      searchProvider: 'google',
    },
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
      reasoning: true,
      search: true,
      vision: true,
    },
    contextWindowTokens: 1_048_576 + 65_536,
    description: 'Gemini 2.5 Flash-Lite 是 Google 最小、性价比最高的模型，专为大规模使用而设计。',
    displayName: 'Gemini 2.5 Flash-Lite',
    id: 'gemini-2.5-flash-lite',
    maxOutput: 65_536,
    pricing: {
      units: [
        { name: 'textInput', rate: 0.1, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 0.4, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput_cacheRead', rate: 0.025, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    releasedAt: '2025-07-22',
    settings: {
      extendParams: ['thinkingBudget'],
      searchImpl: 'params',
      searchProvider: 'google',
    },
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
      reasoning: true,
    },
    contextWindowTokens: 131_072,
    description:
      '基于Qwen3的思考模式开源模型，相较上一版本（通义千问3-235B-A22B）逻辑能力、通用能力、知识增强及创作能力均有大幅提升，适用于高难度强推理场景。',
    displayName: 'Qwen3 235B A22B Thinking 2507',
    enabled: true,
    id: 'qwen3-235b-a22b-thinking-2507',
    maxOutput: 32_768,
    organization: 'Qwen',
    pricing: {
      currency: 'CNY',
      units: [
        { name: 'textInput', rate: 0.28, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 2.8, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    releasedAt: '2025-07-25',
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
    },
    contextWindowTokens: 131_072,
    description:
      '基于Qwen3的非思考模式开源模型，相较上一版本（通义千问3-235B-A22B）主观创作能力与模型安全性均有小幅度提升。',
    displayName: 'Qwen3 235B A22B Instruct 2507',
    enabled: true,
    id: 'qwen3-235b-a22b-instruct-2507',
    maxOutput: 32_768,
    organization: 'Qwen',
    pricing: {
      currency: 'CNY',
      units: [
        { name: 'textInput', rate: 0.28, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 1.12, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    releasedAt: '2025-07-22',
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
      reasoning: true,
    },
    contextWindowTokens: 131_072,
    description:
      '基于Qwen3的思考模式开源模型，相较上一版本（通义千问3-30B-A3B）逻辑能力、通用能力、知识增强及创作能力均有大幅提升，适用于高难度强推理场景。',
    displayName: 'Qwen3 30B A3B Thinking 2507',
    enabled: true,
    id: 'qwen3-30b-a3b-thinking-2507',
    maxOutput: 32_768,
    organization: 'Qwen',
    pricing: {
      currency: 'CNY',
      units: [
        { name: 'textInput', rate: 0.12, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 1.2, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    releasedAt: '2025-07-30',
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
    },
    contextWindowTokens: 131_072,
    description:
      '相较上一版本（Qwen3-30B-A3B）中英文和多语言整体通用能力有大幅提升。主观开放类任务专项优化，显著更加符合用户偏好，能够提供更有帮助性的回复。',
    displayName: 'Qwen3 30B A3B Instruct 2507',
    enabled: true,
    id: 'qwen3-30b-a3b-instruct-2507',
    maxOutput: 32_768,
    organization: 'Qwen',
    pricing: {
      currency: 'CNY',
      units: [
        { name: 'textInput', rate: 0.12, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 0.48, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    releasedAt: '2025-07-29',
    type: 'chat',
  },
];

export default aihubmixModels;
