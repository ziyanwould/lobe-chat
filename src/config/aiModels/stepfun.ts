import { AIChatModelCard, AIImageModelCard } from '@/types/aiModel';

// https://platform.stepfun.com/docs/pricing/details

const stepfunChatModels: AIChatModelCard[] = [
  {
    abilities: {
      reasoning: true,
      vision: true,
    },
    contextWindowTokens: 64_000,
    description:
      '该模型拥有强大的视觉感知和复杂推理能力。可准确完成跨领域的复杂知识理解、数学与视觉信息的交叉分析，以及日常生活中的各类视觉分析问题。',
    displayName: 'Step 3',
    enabled: true,
    id: 'step-3',
    pricing: {
      currency: 'CNY',
      units: [
        {
          name: 'textInput',
          strategy: 'tiered',
          tiers: [
            { rate: 1.5, upTo: 0.004 },
            { rate: 4, upTo: 'infinity' },
          ],
          unit: 'millionTokens',
        },
        {
          name: 'textOutput',
          strategy: 'tiered',
          tiers: [
            { rate: 4, upTo: 0.004 },
            { rate: 8, upTo: 'infinity' }, // 仍与文档有出入
          ],
          unit: 'millionTokens',
        },
      ],
    },
    type: 'chat',
  },
  {
    abilities: {
      // functionCall: true,
      reasoning: true,
      // search: true,
      vision: true,
    },
    contextWindowTokens: 100_000,
    description:
      '该模型是拥有强大的图像理解能力的推理大模型，能够处理图像和文字信息，经过深度思考后输出文本生成文本内容。该模型在视觉推理领域表现突出，同时拥有第一梯队的数学、代码、文本推理能力。上下文长度为100k。',
    displayName: 'Step R1 V Mini',
    id: 'step-r1-v-mini',
    pricing: {
      currency: 'CNY',
      units: [
        { name: 'textInput', rate: 2.5, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 8, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    // settings: {
    //   searchImpl: 'params',
    // },
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
      search: true,
    },
    contextWindowTokens: 8000,
    description: '小型模型，适合轻量级任务。',
    displayName: 'Step 1 8K',
    id: 'step-1-8k',
    pricing: {
      currency: 'CNY',
      units: [
        { name: 'textInput', rate: 5, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 20, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    settings: {
      searchImpl: 'params',
    },
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
      search: true,
    },
    contextWindowTokens: 32_000,
    description: '支持中等长度的对话，适用于多种应用场景。',
    displayName: 'Step 1 32K',
    id: 'step-1-32k',
    pricing: {
      currency: 'CNY',
      units: [
        { name: 'textInput', rate: 15, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 70, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    settings: {
      searchImpl: 'params',
    },
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
      search: true,
    },
    contextWindowTokens: 256_000,
    description: '具备超长上下文处理能力，尤其适合长文档分析。',
    displayName: 'Step 1 256K',
    id: 'step-1-256k',
    pricing: {
      currency: 'CNY',
      units: [
        { name: 'textInput', rate: 95, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 300, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    settings: {
      searchImpl: 'params',
    },
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
      search: true,
    },
    contextWindowTokens: 8000,
    description:
      '基于新一代自研Attention架构MFA的极速大模型，用极低成本达到和step1类似的效果，同时保持了更高的吞吐和更快响应时延。能够处理通用任务，在代码能力上具备特长。',
    displayName: 'Step 2 Mini',
    enabled: true,
    id: 'step-2-mini',
    pricing: {
      currency: 'CNY',
      units: [
        { name: 'textInput', rate: 1, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 2, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    releasedAt: '2025-01-14',
    settings: {
      searchImpl: 'params',
    },
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
      search: true,
    },
    contextWindowTokens: 16_000,
    description: '支持大规模上下文交互，适合复杂对话场景。',
    displayName: 'Step 2 16K',
    id: 'step-2-16k',
    pricing: {
      currency: 'CNY',
      units: [
        { name: 'textInput', rate: 38, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 120, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    settings: {
      searchImpl: 'params',
    },
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
      search: true,
    },
    contextWindowTokens: 16_000,
    description: 'step-2模型的实验版本，包含最新的特性，滚动更新中。不推荐在正式生产环境使用。',
    displayName: 'Step 2 16K Exp',
    id: 'step-2-16k-exp',
    pricing: {
      currency: 'CNY',
      units: [
        { name: 'textInput', rate: 38, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 120, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    releasedAt: '2025-01-15',
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
    contextWindowTokens: 8000,
    description: '小型视觉模型，适合基本的图文任务。',
    displayName: 'Step 1V 8K',
    id: 'step-1v-8k',
    pricing: {
      currency: 'CNY',
      units: [
        { name: 'textInput', rate: 5, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 20, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
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
    contextWindowTokens: 32_000,
    description: '支持视觉输入，增强多模态交互体验。',
    displayName: 'Step 1V 32K',
    id: 'step-1v-32k',
    pricing: {
      currency: 'CNY',
      units: [
        { name: 'textInput', rate: 15, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 70, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    settings: {
      searchImpl: 'params',
    },
    type: 'chat',
  },
  {
    abilities: {
      vision: true,
    },
    contextWindowTokens: 32_000,
    description: '该模型拥有强大的图像理解能力。相比于 step-1v 系列模型，拥有更强的视觉性能。',
    displayName: 'Step 1o Vision 32K',
    enabled: true,
    id: 'step-1o-vision-32k',
    pricing: {
      currency: 'CNY',
      units: [
        { name: 'textInput', rate: 15, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 70, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    releasedAt: '2025-01-22',
    type: 'chat',
  },
  {
    abilities: {
      vision: true,
    },
    contextWindowTokens: 32_000,
    description:
      '该模型拥有强大的图像理解能力，在数理、代码领域强于1o。模型比1o更小，输出速度更快。',
    displayName: 'Step 1o Turbo Vision',
    enabled: true,
    id: 'step-1o-turbo-vision',
    pricing: {
      currency: 'CNY',
      units: [
        { name: 'textInput', rate: 2.5, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 8, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    releasedAt: '2025-02-14',
    type: 'chat',
  },
];

const stepfunImageModels: AIImageModelCard[] = [
  // https://platform.stepfun.com/docs/llm/image
  {
    description:
      '阶跃星辰新一代生图模型,该模型专注于图像生成任务,能够根据用户提供的文本描述,生成高质量的图像。新模型生成图片质感更真实，中英文文字生成能力更强。',
    displayName: 'Step 2X Large',
    enabled: true,
    id: 'step-2x-large',
    parameters: {
      prompt: {
        default: '',
      },
      seed: { default: null },
      size: {
        default: '1024x1024',
        enum: ['256x256', '512x512', '768x768', '1024x1024', '1280x800', '800x1280'],
      },
      steps: { default: 50, max: 100, min: 1 },
    },
    releasedAt: '2024-08-07',
    type: 'image',
  },
  {
    description:
      '该模型拥有强大的图像生成能力，支持文本描述作为输入方式。具备原生的中文支持，能够更好的理解和处理中文文本描述，并且能够更准确地捕捉文本描述中的语义信息，并将其转化为图像特征，从而实现更精准的图像生成。模型能够根据输入生成高分辨率、高质量的图像，并具备一定的风格迁移能力。',
    displayName: 'Step 1X Medium',
    enabled: true,
    id: 'step-1x-medium',
    parameters: {
      prompt: {
        default: '',
      },
      seed: { default: null },
      size: {
        default: '1024x1024',
        enum: ['256x256', '512x512', '768x768', '1024x1024', '1280x800', '800x1280'],
      },
      steps: { default: 50, max: 100, min: 1 },
    },
    releasedAt: '2025-07-15',
    type: 'image',
  },
  {
    description:
      '该模型专注于图像编辑任务，能够根据用户提供的图片和文本描述，对图片进行修改和增强。支持多种输入格式，包括文本描述和示例图像。模型能够理解用户的意图，并生成符合要求的图像编辑结果。',
    displayName: 'Step 1X Edit',
    enabled: true,
    id: 'step-1x-edit',
    parameters: {
      imageUrl: { default: null },
      prompt: {
        default: '',
      },
      seed: { default: null },
      size: {
        default: '1024x1024',
        enum: ['512x512', '768x768', '1024x1024'],
      },
      steps: { default: 28, max: 100, min: 1 },
    },
    releasedAt: '2025-03-04',
    type: 'image',
  },
];

export const allModels = [...stepfunChatModels, ...stepfunImageModels];

export default allModels;
