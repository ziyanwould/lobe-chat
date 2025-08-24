import type { ChatModelCard } from '@/types/llm';

import type { ModelProviderKey } from '../types';

export interface ModelProcessorConfig {
  excludeKeywords?: readonly string[]; // 对符合的模型不添加标签
  functionCallKeywords?: readonly string[];
  reasoningKeywords?: readonly string[];
  visionKeywords?: readonly string[];
}

// 模型能力标签关键词配置
export const MODEL_LIST_CONFIGS = {
  anthropic: {
    functionCallKeywords: ['claude'],
    reasoningKeywords: ['-3-7', '3.7', '-4'],
    visionKeywords: ['claude'],
  },
  deepseek: {
    functionCallKeywords: ['v3', 'r1'],
    reasoningKeywords: ['r1'],
  },
  google: {
    functionCallKeywords: ['gemini'],
    reasoningKeywords: ['thinking', '-2.5-'],
    visionKeywords: ['gemini', 'learnlm'],
  },
  llama: {
    functionCallKeywords: ['llama-3.2', 'llama-3.3', 'llama-4'],
    reasoningKeywords: [],
    visionKeywords: ['llava'],
  },
  moonshot: {
    functionCallKeywords: ['moonshot', 'kimi'],
    reasoningKeywords: ['thinking'],
    visionKeywords: ['vision', 'kimi-latest', 'kimi-thinking-preview'],
  },
  openai: {
    excludeKeywords: ['audio'],
    functionCallKeywords: ['4o', '4.1', 'o3', 'o4', 'oss'],
    reasoningKeywords: ['o1', 'o3', 'o4', 'oss'],
    visionKeywords: ['4o', '4.1', 'o4'],
  },
  qwen: {
    functionCallKeywords: [
      'qwen-max',
      'qwen-plus',
      'qwen-turbo',
      'qwen-long',
      'qwen1.5',
      'qwen2',
      'qwen2.5',
      'qwen3',
    ],
    reasoningKeywords: ['qvq', 'qwq', 'qwen3', '!-instruct-', '!-coder-'],
    visionKeywords: ['qvq', 'vl'],
  },
  v0: {
    functionCallKeywords: ['v0'],
    reasoningKeywords: ['v0-1.5'],
    visionKeywords: ['v0'],
  },
  volcengine: {
    functionCallKeywords: ['1.5', '1-5', '1.6', '1-6'],
    reasoningKeywords: ['thinking', 'seed', 'ui-tars'],
    visionKeywords: ['vision', '-m', 'seed', 'ui-tars'],
  },
  xai: {
    functionCallKeywords: ['grok'],
    reasoningKeywords: ['mini', 'grok-4'],
    visionKeywords: ['vision', 'grok-4'],
  },
  zeroone: {
    functionCallKeywords: ['fc'],
    visionKeywords: ['vision'],
  },
  zhipu: {
    functionCallKeywords: ['glm-4', 'glm-z1'],
    reasoningKeywords: ['glm-zero', 'glm-z1', 'glm-4.5'],
    visionKeywords: ['glm-4v', 'glm-4.1v', 'glm-4.5v'],
  },
} as const;

// 模型提供商关键词配置
export const PROVIDER_DETECTION_CONFIG = {
  anthropic: ['claude'],
  deepseek: ['deepseek'],
  google: ['gemini', 'imagen'],
  llama: ['llama', 'llava'],
  moonshot: ['moonshot', 'kimi'],
  openai: ['o1', 'o3', 'o4', 'gpt-'],
  qwen: ['qwen', 'qwq', 'qvq'],
  v0: ['v0'],
  volcengine: ['doubao'],
  xai: ['grok'],
  zeroone: ['yi-'],
  zhipu: ['glm'],
} as const;

// 图像模型关键词配置
export const IMAGE_MODEL_KEYWORDS = [
  'dall-e',
  'dalle',
  'midjourney',
  'stable-diffusion',
  'sd',
  'flux',
  'imagen',
  'firefly',
  'cogview',
  'wanxiang',
  'DESCRIBE',
  'UPSCALE',
  '-image',
  '^V3',
  '^V_2',
  '^V_1',
] as const;

/**
 * 检测关键词列表是否匹配模型ID（支持多种匹配模式）
 * @param modelId 模型ID（小写）
 * @param keywords 关键词列表，支持以下前缀：
 *   - ^ 开头：只在模型ID开头匹配
 *   - ! 开头：排除匹配，优先级最高
 *   - 无前缀：包含匹配（默认行为）
 * @returns 是否匹配（排除逻辑优先）
 */
const isKeywordListMatch = (modelId: string, keywords: readonly string[]): boolean => {
  // 先检查排除规则（感叹号开头）
  const excludeKeywords = keywords.filter((keyword) => keyword.startsWith('!'));
  const includeKeywords = keywords.filter((keyword) => !keyword.startsWith('!'));

  // 如果匹配任何排除规则，直接返回 false
  for (const excludeKeyword of excludeKeywords) {
    const keywordWithoutPrefix = excludeKeyword.slice(1);
    const isMatch = keywordWithoutPrefix.startsWith('^')
      ? modelId.startsWith(keywordWithoutPrefix.slice(1))
      : modelId.includes(keywordWithoutPrefix);

    if (isMatch) {
      return false;
    }
  }

  // 检查包含规则
  return includeKeywords.some((keyword) => {
    if (keyword.startsWith('^')) {
      // ^ 开头则只在开头匹配
      const keywordWithoutPrefix = keyword.slice(1);
      return modelId.startsWith(keywordWithoutPrefix);
    }
    // 默认行为：包含匹配
    return modelId.includes(keyword);
  });
};

/**
 * 根据提供商类型查找对应的本地模型配置
 * @param modelId 模型ID
 * @param provider 提供商类型
 * @returns 匹配的本地模型配置
 */
const findKnownModelByProvider = async (
  modelId: string,
  provider: keyof typeof MODEL_LIST_CONFIGS,
): Promise<any> => {
  const lowerModelId = modelId.toLowerCase();

  try {
    // 动态构建导入路径
    const modulePath = `@/config/aiModels/${provider}`;

    // 尝试动态导入对应的配置文件
    const moduleImport = await import(modulePath);
    const providerModels = moduleImport.default;

    // 如果导入成功且有数据，进行查找
    if (Array.isArray(providerModels)) {
      return providerModels.find((m) => m.id.toLowerCase() === lowerModelId);
    }

    return null;
  } catch {
    // 如果导入失败（文件不存在或其他错误），返回 null
    return null;
  }
};

/**
 * 检测单个模型的提供商类型
 * @param modelId 模型ID
 * @returns 检测到的提供商配置键名，默认为 'openai'
 */
export const detectModelProvider = (modelId: string): keyof typeof MODEL_LIST_CONFIGS => {
  const lowerModelId = modelId.toLowerCase();

  for (const [provider, keywords] of Object.entries(PROVIDER_DETECTION_CONFIG)) {
    const hasKeyword = isKeywordListMatch(lowerModelId, keywords);

    if (hasKeyword && provider in MODEL_LIST_CONFIGS) {
      return provider as keyof typeof MODEL_LIST_CONFIGS;
    }
  }

  return 'openai';
};

/**
 * 将时间戳转换为日期字符串
 * @param timestamp 时间戳（秒）
 * @returns 格式化的日期字符串 (YYYY-MM-DD)
 */
const formatTimestampToDate = (timestamp: number): string => {
  const date = new Date(timestamp * 1000); // 将秒转换为毫秒
  return date.toISOString().split('T')[0]; // 返回 YYYY-MM-DD 格式
};

/**
 * 处理 releasedAt 字段
 * @param model 模型对象
 * @param knownModel 已知模型配置
 * @returns 处理后的 releasedAt 值
 */
const processReleasedAt = (model: any, knownModel?: any): string | undefined => {
  // 优先检查 model.created
  if (model.created !== undefined && model.created !== null) {
    // 检查是否为时间戳格式
    if (typeof model.created === 'number' && model.created > 1_630_000_000) {
      // AiHubMix 错误时间戳为 1626777600
      return formatTimestampToDate(model.created);
    }
    // 如果 created 是字符串且已经是日期格式，直接返回
    if (typeof model.created === 'string') {
      // Anthropic：若为 '2025-02-19T00:00:00Z' 只取日期部分
      if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(model.created)) {
        return model.created.split('T')[0];
      }
      return model.created;
    }
  }

  // 回退到原有逻辑
  return model.releasedAt ?? knownModel?.releasedAt ?? undefined;
};

/**
 * 处理模型卡片的通用逻辑
 */
const processModelCard = (
  model: { [key: string]: any; id: string },
  config: ModelProcessorConfig,
  knownModel?: any,
): ChatModelCard | undefined => {
  const {
    functionCallKeywords = [],
    visionKeywords = [],
    reasoningKeywords = [],
    excludeKeywords = [],
  } = config;

  const isExcludedModel = isKeywordListMatch(model.id.toLowerCase(), excludeKeywords);
  const modelType =
    model.type ||
    knownModel?.type ||
    (isKeywordListMatch(
      model.id.toLowerCase(),
      IMAGE_MODEL_KEYWORDS.map((k) => k.toLowerCase()),
    )
      ? 'image'
      : 'chat');

  // image model can't find parameters
  if (modelType === 'image' && !model.parameters && !knownModel?.parameters) {
    return undefined;
  }

  return {
    contextWindowTokens: model.contextWindowTokens ?? knownModel?.contextWindowTokens ?? undefined,
    description: model.description ?? knownModel?.description ?? '',
    displayName: (model.displayName ?? knownModel?.displayName ?? model.id)
      .replaceAll(/\s*[(（][^)）]*[)）]\s*/g, '')
      .trim(), // 去除括号内容
    enabled: model?.enabled || false,
    functionCall:
      model.functionCall ??
      knownModel?.abilities?.functionCall ??
      ((isKeywordListMatch(model.id.toLowerCase(), functionCallKeywords) && !isExcludedModel) ||
        false),
    id: model.id,
    maxOutput: model.maxOutput ?? knownModel?.maxOutput ?? undefined,
    // pricing: knownModel?.pricing ?? undefined,
    reasoning:
      model.reasoning ??
      knownModel?.abilities?.reasoning ??
      (isKeywordListMatch(model.id.toLowerCase(), reasoningKeywords) || false),
    releasedAt: processReleasedAt(model, knownModel),
    type: modelType,
    // current, only image model use the parameters field
    ...(modelType === 'image' && {
      parameters: model.parameters ?? knownModel?.parameters,
    }),
    vision:
      model.vision ??
      knownModel?.abilities?.vision ??
      ((isKeywordListMatch(model.id.toLowerCase(), visionKeywords) && !isExcludedModel) || false),
  };
};

/**
 * 处理单一提供商的模型列表
 * @param modelList 模型列表
 * @param config 提供商配置
 * @param provider 提供商类型（可选，用于优先匹配对应的本地配置）
 * @returns 处理后的模型卡片列表
 */
export const processModelList = async (
  modelList: Array<{ id: string }>,
  config: ModelProcessorConfig,
  provider?: keyof typeof MODEL_LIST_CONFIGS,
): Promise<ChatModelCard[]> => {
  const { LOBE_DEFAULT_MODEL_LIST } = await import('@/config/aiModels');

  return Promise.all(
    modelList.map(async (model) => {
      let knownModel: any = null;

      // 如果提供了provider，优先使用提供商特定的配置
      if (provider) {
        knownModel = await findKnownModelByProvider(model.id, provider);
      }

      // 如果未找到，回退到全局配置
      if (!knownModel) {
        knownModel = LOBE_DEFAULT_MODEL_LIST.find(
          (m) => model.id.toLowerCase() === m.id.toLowerCase(),
        );
      }

      return processModelCard(model, config, knownModel);
    }),
  ).then((results) => results.filter((result) => !!result));
};

/**
 * 处理混合提供商的模型列表
 * @param modelList 模型列表
 * @param providerid 可选的提供商ID，用于获取其本地配置文件
 * @returns 处理后的模型卡片列表
 */
export const processMultiProviderModelList = async (
  modelList: Array<{ id: string }>,
  providerid?: ModelProviderKey,
): Promise<ChatModelCard[]> => {
  const { LOBE_DEFAULT_MODEL_LIST } = await import('@/config/aiModels');

  // 如果提供了 providerid，尝试获取该提供商的本地配置
  let providerLocalConfig: any[] | null = null;
  if (providerid) {
    try {
      const moduleImport = await import(`@/config/aiModels/${providerid}`);
      providerLocalConfig = moduleImport.default;
    } catch {
      // 如果配置文件不存在或导入失败，保持为 null
      providerLocalConfig = null;
    }
  }

  return Promise.all(
    modelList.map(async (model) => {
      const detectedProvider = detectModelProvider(model.id);
      const config = MODEL_LIST_CONFIGS[detectedProvider];

      // 优先使用提供商特定的配置
      let knownModel = await findKnownModelByProvider(model.id, detectedProvider);

      // 如果未找到，回退到全局配置
      if (!knownModel) {
        knownModel = LOBE_DEFAULT_MODEL_LIST.find(
          (m) => model.id.toLowerCase() === m.id.toLowerCase(),
        );
      }

      // 如果提供了 providerid 且有本地配置，尝试从中获取模型的 enabled 状态
      let providerLocalModelConfig = null;
      if (providerLocalConfig && Array.isArray(providerLocalConfig)) {
        providerLocalModelConfig = providerLocalConfig.find((m) => m.id === model.id);
      }

      const processedModel = processModelCard(model, config, knownModel);

      // 如果找到了本地配置中的模型，使用其 enabled 状态
      if (
        processedModel &&
        providerLocalModelConfig &&
        typeof providerLocalModelConfig.enabled === 'boolean'
      ) {
        processedModel.enabled = providerLocalModelConfig.enabled;
      }

      return processedModel;
    }),
  ).then((results) => results.filter((result) => !!result));
};
