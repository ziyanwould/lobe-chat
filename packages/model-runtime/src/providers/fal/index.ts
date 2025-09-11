import { fal } from '@fal-ai/client';
import debug from 'debug';
import { pick } from 'lodash-es';
import { RuntimeImageGenParamsValue } from 'model-bank';
import { ClientOptions } from 'openai';

import { LobeRuntimeAI } from '../../core/BaseAI';
import { AgentRuntimeErrorType } from '../../types/error';
import { CreateImagePayload, CreateImageResponse } from '../../types/image';
import { AgentRuntimeError } from '../../utils/createError';

// Create debug logger
const log = debug('lobe-image:fal');

type FluxDevOutput = Awaited<ReturnType<typeof fal.subscribe<'fal-ai/flux/dev'>>>['data'];

export class LobeFalAI implements LobeRuntimeAI {
  constructor({ apiKey }: ClientOptions = {}) {
    if (!apiKey) throw AgentRuntimeError.createError(AgentRuntimeErrorType.InvalidProviderAPIKey);

    fal.config({
      credentials: apiKey,
    });
    log('FalAI initialized with apiKey: %s', apiKey ? '*****' : 'Not set');
  }

  async createImage(payload: CreateImagePayload): Promise<CreateImageResponse> {
    const { model, params } = payload;
    log('Creating image with model: %s and params: %O', model, params);

    const paramsMap = new Map<RuntimeImageGenParamsValue, string>([
      ['steps', 'num_inference_steps'],
      ['cfg', 'guidance_scale'],
      ['imageUrl', 'image_url'],
      ['imageUrls', 'image_urls'],
    ]);

    const defaultInput: Record<string, unknown> = {
      enable_safety_checker: false,
      num_images: 1,
    };
    const userInput: Record<string, unknown> = Object.fromEntries(
      (Object.entries(params) as [keyof typeof params, any][])
        .filter(([, value]) => {
          const isEmptyValue =
            value === null || value === undefined || (Array.isArray(value) && value.length === 0);
          return !isEmptyValue;
        })
        .map(([key, value]) => [paramsMap.get(key) ?? key, value]),
    );

    if ('width' in userInput && 'height' in userInput) {
      userInput.image_size = {
        height: userInput.height,
        width: userInput.width,
      };
      delete userInput.width;
      delete userInput.height;
    }

    const modelsAcceleratedByDefault = new Set<string>(['flux/krea']);
    if (modelsAcceleratedByDefault.has(model)) {
      defaultInput['acceleration'] = 'high';
    }

    // Ensure model has fal-ai/ prefix
    let endpoint = model.startsWith('fal-ai/') ? model : `fal-ai/${model}`;
    const hasImageUrls = (params.imageUrls?.length ?? 0) > 0;
    if (endpoint === 'fal-ai/bytedance/seedream/v4') {
      endpoint += hasImageUrls ? '/edit' : '/text-to-image';
    } else if (endpoint === 'fal-ai/nano-banana' && hasImageUrls) {
      endpoint += '/edit';
    }

    const finalInput = {
      ...defaultInput,
      ...userInput,
    };

    log('Calling fal.subscribe with endpoint: %s and input: %O', endpoint, finalInput);
    try {
      const { data } = await fal.subscribe(endpoint, {
        input: finalInput,
      });
      const image = (data as FluxDevOutput).images[0];

      return {
        imageUrl: image.url,
        ...pick(image, ['width', 'height']),
      };
    } catch (error) {
      // https://docs.fal.ai/model-apis/errors/
      if (error instanceof Error && 'status' in error && error.status === 401) {
        throw AgentRuntimeError.createError(AgentRuntimeErrorType.InvalidProviderAPIKey, {
          error,
        });
      }

      throw AgentRuntimeError.createError(AgentRuntimeErrorType.ProviderBizError, { error });
    }
  }
}
