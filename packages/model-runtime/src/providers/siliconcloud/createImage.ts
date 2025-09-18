import createDebug from 'debug';

import { CreateImageOptions } from '../../core/openaiCompatibleFactory';
import { CreateImagePayload, CreateImageResponse } from '../../types/image';
import { AgentRuntimeError } from '../../utils/createError';

const log = createDebug('lobe-image:siliconcloud');

interface SiliconCloudImageResponse {
  created: number;
  data: Array<{
    url: string;
  }>;
  images?: Array<{
    url: string;
  }>;
  seed?: number;
  shared_id?: string;
  timings?: {
    inference: number;
  };
}

/**
 * Create an image using SiliconCloud API
 * SiliconCloud uses OpenAI-compatible image generation API
 */
export async function createImage(
  payload: CreateImagePayload,
  options: CreateImageOptions,
): Promise<CreateImageResponse> {
  const { model, params } = payload;
  const { apiKey, baseURL = process.env.SILICONCLOUD_BASE_URL || 'https://api.siliconflow.cn/v1' } =
    options;

  const proxyUrl = process.env.SILICONCLOUD_PROXY_URL;

  log('Creating image with model: %s', model);
  log('Parameters: %O', params);

  if (!apiKey) {
    throw AgentRuntimeError.createImage({
      error: { message: 'API key is required for SiliconCloud' },
      errorType: 'InvalidProviderAPIKey',
      provider: 'siliconcloud',
    });
  }

  // Determine the API endpoint
  const endpoint = `${baseURL}/images/generations`;

  // Prepare request body based on model type
  const requestBody: any = {
    model,
    n: 1,
    prompt: params.prompt, // SiliconCloud typically generates one image at a time
  };

  // Add optional parameters
  if (params.size) {
    requestBody.size = params.size;
  }
  if (params.seed !== undefined && params.seed !== null) {
    requestBody.seed = params.seed;
  }

  // For image edit models (like Qwen/Qwen-Image-Edit), add image parameter
  if (model === 'Qwen/Qwen-Image-Edit' && params.imageUrls && params.imageUrls.length > 0) {
    // For image editing, we need to pass the reference images
    requestBody.image = params.imageUrls[0]; // Use first image for editing
  }

  log('Request endpoint: %s', endpoint);
  log('Request body: %O', requestBody);

  const fetchOptions = {
    body: JSON.stringify(requestBody),
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      // Add user tracking headers for upstream middleware capture
      'x-user-id': options?.user || 'unknown',
      'x-user-ip': options?.ip || 'unknown',
    },
    method: 'POST',
  };

  // Use proxy if specified
  const finalUrl = proxyUrl ? proxyUrl.replace('{{url}}', endpoint) : endpoint;

  try {
    const response = await fetch(finalUrl, fetchOptions);

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error?.message || errorData.message || errorMessage;
        log('API error response: %O', errorData);
      } catch {
        // If we can't parse the error response, use the status text
        errorMessage = response.statusText || errorMessage;
      }

      log('Request failed with status: %d, message: %s', response.status, errorMessage);

      // Handle specific error types
      if (response.status === 401) {
        throw AgentRuntimeError.createImage({
          error: { message: 'Invalid API key for SiliconCloud' },
          errorType: 'InvalidProviderAPIKey',
          provider: 'siliconcloud',
        });
      }

      if (response.status === 403) {
        throw AgentRuntimeError.createImage({
          error: {
            message:
              '请检查 API Key 余额是否充足，或者是否在用未实名的 API Key 访问需要实名的模型。',
          },
          errorType: 'ProviderBizError',
          provider: 'siliconcloud',
        });
      }

      throw AgentRuntimeError.createImage({
        error: { message: `SiliconCloud API error: ${errorMessage}` },
        errorType: 'ProviderBizError',
        provider: 'siliconcloud',
      });
    }

    const data: SiliconCloudImageResponse = await response.json();
    log('API response: %O', data);

    // Handle response format - SiliconCloud may return different formats
    const images = data.data || data.images || [];

    if (images.length === 0) {
      throw AgentRuntimeError.createImage({
        error: { message: 'No images returned from SiliconCloud API' },
        errorType: 'ProviderBizError',
        provider: 'siliconcloud',
      });
    }

    // Return the first image URL according to CreateImageResponse interface
    return {
      imageUrl: images[0].url,
    };
  } catch (error) {
    log('Request failed with error: %O', error);

    throw AgentRuntimeError.createImage({
      error: error as any,
      errorType: 'ProviderBizError',
      provider: 'siliconcloud',
    });
  }
}
