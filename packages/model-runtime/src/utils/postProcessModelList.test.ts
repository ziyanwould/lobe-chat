import type { AiModelType } from 'model-bank';
import { describe, expect, it, vi } from 'vitest';

import type { ChatModelCard } from '@/types/llm';

import { IMAGE_GENERATION_MODEL_WHITELIST, postProcessModelList } from './postProcessModelList';

// Mock model-bank
vi.mock('model-bank', () => ({
  CHAT_MODEL_IMAGE_GENERATION_PARAMS: {
    max_tokens: 1000,
    temperature: 0.7,
  },
}));

describe('IMAGE_GENERATION_MODEL_WHITELIST', () => {
  it('should contain expected whitelisted models', () => {
    expect(IMAGE_GENERATION_MODEL_WHITELIST).toContain('gemini-2.5-flash-image-preview');
    expect(IMAGE_GENERATION_MODEL_WHITELIST).toContain('gemini-2.5-flash-image-preview:free');
  });
});

describe('postProcessModelList', () => {
  const mockModels: ChatModelCard[] = [
    {
      id: 'gpt-3.5-turbo',
      displayName: 'GPT-3.5 Turbo',
      enabled: true,
    },
    {
      id: 'gemini-2.5-flash-image-preview',
      displayName: 'Gemini 2.5 Flash Image Preview',
      enabled: true,
    },
    {
      id: 'claude-3-opus',
      displayName: 'Claude 3 Opus',
      enabled: true,
      type: 'chat' as AiModelType,
    },
  ];

  it('should ensure all models have type field with default "chat"', async () => {
    const result = await postProcessModelList(mockModels);

    expect(result.length).toBeGreaterThanOrEqual(mockModels.length);
    // Filter out generated image models for this test
    const originalModels = result.filter((model) => !model.id.endsWith(':image'));
    originalModels.forEach((model) => {
      expect(model.type).toBeDefined();
      if (!mockModels.find((m) => m.id === model.id)?.type) {
        expect(model.type).toBe('chat');
      }
    });
  });

  it('should preserve existing type field', async () => {
    const result = await postProcessModelList(mockModels);
    const claudeModel = result.find((m) => m.id === 'claude-3-opus');

    expect(claudeModel?.type).toBe('chat');
  });

  it('should use getModelTypeProperty when type is missing', async () => {
    const modelsWithoutType: ChatModelCard[] = [
      {
        id: 'custom-model',
        displayName: 'Custom Model',
        enabled: true,
      },
    ];

    const getModelTypeProperty = vi.fn().mockResolvedValue('embedding' as AiModelType);
    const result = await postProcessModelList(modelsWithoutType, getModelTypeProperty);

    expect(getModelTypeProperty).toHaveBeenCalledWith('custom-model');
    expect(result[0].type).toBe('embedding');
  });

  it('should generate image models for whitelisted models', async () => {
    const result = await postProcessModelList(mockModels);
    const imageModel = result.find((m) => m.id === 'gemini-2.5-flash-image-preview:image');

    expect(imageModel).toBeDefined();
    expect(imageModel?.type).toBe('image');
    expect(imageModel?.displayName).toBe('Gemini 2.5 Flash Image Preview');
    expect(imageModel?.enabled).toBe(true);
    expect(imageModel?.parameters).toEqual({
      max_tokens: 1000,
      temperature: 0.7,
    });
  });

  it('should handle models that partially match whitelist patterns', async () => {
    const modelsWithPartialMatch: ChatModelCard[] = [
      {
        id: 'custom-gemini-2.5-flash-image-preview',
        displayName: 'Custom Gemini',
        enabled: true,
      },
      {
        id: 'gemini-2.5-flash-image-preview-custom',
        displayName: 'Gemini Custom',
        enabled: false,
      },
    ];

    const result = await postProcessModelList(modelsWithPartialMatch);

    // Should generate image model for the one that ends with whitelist pattern
    const imageModel = result.find((m) => m.id === 'custom-gemini-2.5-flash-image-preview:image');
    expect(imageModel).toBeDefined();
    expect(imageModel?.enabled).toBe(true);

    // Should not generate for the one that doesn't end with whitelist pattern
    const noImageModel = result.find((m) => m.id === 'gemini-2.5-flash-image-preview-custom:image');
    expect(noImageModel).toBeUndefined();
  });

  it('should handle empty model list', async () => {
    const result = await postProcessModelList([]);
    expect(result).toEqual([]);
  });

  it('should handle multiple whitelisted models', async () => {
    const multipleWhitelistedModels: ChatModelCard[] = [
      {
        id: 'test-gemini-2.5-flash-image-preview',
        displayName: 'Test Gemini',
        enabled: true,
      },
      {
        id: 'another-gemini-2.5-flash-image-preview:free',
        displayName: 'Another Gemini Free',
        enabled: false,
      },
    ];

    const result = await postProcessModelList(multipleWhitelistedModels);

    // Should have original models plus image versions
    expect(result).toHaveLength(4);

    const imageModel1 = result.find((m) => m.id === 'test-gemini-2.5-flash-image-preview:image');
    const imageModel2 = result.find(
      (m) => m.id === 'another-gemini-2.5-flash-image-preview:free:image',
    );

    expect(imageModel1).toBeDefined();
    expect(imageModel2).toBeDefined();
    expect(imageModel1?.type).toBe('image');
    expect(imageModel2?.type).toBe('image');
  });

  it('should preserve all original model properties in image versions', async () => {
    const modelWithManyProps: ChatModelCard[] = [
      {
        id: 'gemini-2.5-flash-image-preview',
        displayName: 'Gemini Flash',
        enabled: true,
        contextWindowTokens: 4096,
        description: 'A flash model',
        functionCall: true,
        vision: true,
        reasoning: false,
        maxOutput: 2048,
      },
    ];

    const result = await postProcessModelList(modelWithManyProps);
    const imageModel = result.find((m) => m.id === 'gemini-2.5-flash-image-preview:image');

    expect(imageModel).toMatchObject({
      id: 'gemini-2.5-flash-image-preview:image',
      displayName: 'Gemini Flash',
      enabled: true,
      contextWindowTokens: 4096,
      description: 'A flash model',
      functionCall: true,
      vision: true,
      reasoning: false,
      maxOutput: 2048,
      type: 'image',
      parameters: {
        max_tokens: 1000,
        temperature: 0.7,
      },
    });
  });
});
