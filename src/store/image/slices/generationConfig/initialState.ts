/* eslint-disable sort-keys-fix/sort-keys-fix, typescript-sort-keys/interface */
import { ModelProvider } from '@lobechat/model-runtime';
import {
  ModelParamsSchema,
  RuntimeImageGenParams,
  extractDefaultValues,
  gptImage1ParamsSchema,
} from 'model-bank';

export const DEFAULT_AI_IMAGE_PROVIDER = ModelProvider.SiliconCloud;
export const DEFAULT_AI_IMAGE_MODEL = 'Qwen/Qwen-Image';
export const DEFAULT_IMAGE_NUM = 4;

export interface GenerationConfigState {
  parameters: RuntimeImageGenParams;
  parametersSchema: ModelParamsSchema;

  provider: string;
  model: string;
  imageNum: number;

  isAspectRatioLocked: boolean;
  activeAspectRatio: string | null; // string - 虚拟比例; null - 原生比例

  /**
   * 标记配置是否已初始化（包括从记忆中恢复）
   */
  isInit: boolean;
}

export const DEFAULT_IMAGE_GENERATION_PARAMETERS: RuntimeImageGenParams =
  extractDefaultValues(gptImage1ParamsSchema);

export const initialGenerationConfigState: GenerationConfigState = {
  model: DEFAULT_AI_IMAGE_MODEL,
  provider: DEFAULT_AI_IMAGE_PROVIDER,
  imageNum: DEFAULT_IMAGE_NUM,
  parameters: DEFAULT_IMAGE_GENERATION_PARAMETERS,
  parametersSchema: gptImage1ParamsSchema,
  isAspectRatioLocked: false,
  activeAspectRatio: null,
  isInit: false,
};
