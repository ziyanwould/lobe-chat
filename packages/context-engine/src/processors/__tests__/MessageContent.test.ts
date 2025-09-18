import { ChatImageItem, ChatMessage } from '@lobechat/types';
import { describe, expect, it, vi } from 'vitest';

import type { PipelineContext } from '../../types';
import { MessageContentProcessor } from '../MessageContent';

vi.mock('@lobechat/utils', () => ({
  imageUrlToBase64: vi.fn().mockResolvedValue({
    base64: 'base64-data',
    mimeType: 'image/png',
  }),
  isLocalUrl: vi.fn((url: string) => url.includes('localhost') || url.includes('127.0.0.1')),
  parseDataUri: vi.fn((url: string) => {
    if (url.startsWith('data:')) {
      return { type: 'data' };
    }
    return { type: 'url' };
  }),
}));

const createContext = (messages: ChatMessage[]): PipelineContext => ({
  initialState: { messages: [] } as any,
  messages,
  metadata: { model: 'gpt-4', provider: 'openai', maxTokens: 100000 },
  isAborted: false,
});

const mockIsCanUseVision = vi.fn();

describe('MessageContentProcessor', () => {
  describe('Image processing functionality', () => {
    it('should return empty content parts if model cannot use vision', async () => {
      mockIsCanUseVision.mockReturnValue(false);

      const processor = new MessageContentProcessor({
        model: 'any-model',
        provider: 'any-provider',
        isCanUseVision: mockIsCanUseVision,
        fileContext: { enabled: false },
      });

      const messages: ChatMessage[] = [
        {
          id: 'test',
          role: 'user',
          content: 'Hello',
          imageList: [{ url: 'image_url', alt: '', id: 'test' } as ChatImageItem],
          createdAt: Date.now(),
          updatedAt: Date.now(),
          meta: {},
        },
      ];

      const result = await processor.process(createContext(messages));

      // Since vision is not supported, should return plain text content
      expect(result.messages[0].content).toBe('Hello');
    });

    it('should process images if model can use vision', async () => {
      mockIsCanUseVision.mockReturnValue(true);

      const processor = new MessageContentProcessor({
        model: 'gpt-4-vision',
        provider: 'openai',
        isCanUseVision: mockIsCanUseVision,
        fileContext: { enabled: false },
      });

      const messages: ChatMessage[] = [
        {
          id: 'test',
          role: 'user',
          content: 'Hello',
          imageList: [
            { url: 'http://example.com/image.jpg', alt: '', id: 'test' } as ChatImageItem,
          ],
          createdAt: Date.now(),
          updatedAt: Date.now(),
          meta: {},
        },
      ];

      const result = await processor.process(createContext(messages));

      // Should return structured content with image
      expect(Array.isArray(result.messages[0].content)).toBe(true);
      const content = result.messages[0].content as any[];
      expect(content).toHaveLength(2);
      expect(content[0].type).toBe('text');
      expect(content[1].type).toBe('image_url');
      expect(content[1].image_url.url).toBe('http://example.com/image.jpg');
    });

    it('should handle vision disabled scenario correctly', async () => {
      mockIsCanUseVision.mockReturnValue(false);

      const processor = new MessageContentProcessor({
        model: 'text-model',
        provider: 'openai',
        isCanUseVision: mockIsCanUseVision,
        fileContext: { enabled: false },
      });

      const messages: ChatMessage[] = [
        {
          id: 'test',
          role: 'user',
          content: 'Hello',
          imageList: [{ url: 'image_url', alt: '', id: 'test' } as ChatImageItem],
          createdAt: Date.now(),
          updatedAt: Date.now(),
          meta: {},
        },
      ];

      const result = await processor.process(createContext(messages));

      expect(mockIsCanUseVision).toHaveBeenCalledWith('text-model', 'openai');
      // Should return plain text since vision is not supported
      expect(result.messages[0].content).toBe('Hello');
    });

    it('should process local image URLs to base64', async () => {
      mockIsCanUseVision.mockReturnValue(true);

      const processor = new MessageContentProcessor({
        model: 'gpt-4-vision',
        provider: 'openai',
        isCanUseVision: mockIsCanUseVision,
        fileContext: { enabled: false },
      });

      const messages: ChatMessage[] = [
        {
          id: 'test',
          role: 'user',
          content: 'Hello',
          imageList: [
            { url: 'http://localhost:3000/image.jpg', alt: '', id: 'test' } as ChatImageItem,
          ],
          createdAt: Date.now(),
          updatedAt: Date.now(),
          meta: {},
        },
      ];

      const result = await processor.process(createContext(messages));

      const content = result.messages[0].content as any[];
      expect(content[1].image_url.url).toBe('data:image/png;base64,base64-data');
    });
  });

  describe('Assistant message with images', () => {
    it('should handle assistant message with imageList and content', async () => {
      mockIsCanUseVision.mockReturnValue(true);

      const processor = new MessageContentProcessor({
        model: 'gpt-4-vision',
        provider: 'openai',
        isCanUseVision: mockIsCanUseVision,
        fileContext: { enabled: false },
      });

      const messages: ChatMessage[] = [
        {
          id: 'test',
          role: 'assistant',
          content: 'Here is an image.',
          imageList: [
            { id: 'img1', url: 'http://example.com/image.png', alt: 'test.png' } as ChatImageItem,
          ],
          createdAt: Date.now(),
          updatedAt: Date.now(),
          meta: {},
        },
      ];

      const result = await processor.process(createContext(messages));

      const content = result.messages[0].content as any[];
      expect(content).toEqual([
        { text: 'Here is an image.', type: 'text' },
        { image_url: { detail: 'auto', url: 'http://example.com/image.png' }, type: 'image_url' },
      ]);
    });

    it('should handle assistant message with imageList but no content', async () => {
      mockIsCanUseVision.mockReturnValue(true);

      const processor = new MessageContentProcessor({
        model: 'gpt-4-vision',
        provider: 'openai',
        isCanUseVision: mockIsCanUseVision,
        fileContext: { enabled: false },
      });

      const messages: ChatMessage[] = [
        {
          id: 'test',
          role: 'assistant',
          content: '',
          imageList: [
            { id: 'img1', url: 'http://example.com/image.png', alt: 'test.png' } as ChatImageItem,
          ],
          createdAt: Date.now(),
          updatedAt: Date.now(),
          meta: {},
        },
      ];

      const result = await processor.process(createContext(messages));

      const content = result.messages[0].content as any[];
      expect(content).toEqual([
        { image_url: { detail: 'auto', url: 'http://example.com/image.png' }, type: 'image_url' },
      ]);
    });
  });

  describe('File context processing', () => {
    it('should add file context when enabled', async () => {
      mockIsCanUseVision.mockReturnValue(false);

      const processor = new MessageContentProcessor({
        model: 'gpt-4',
        provider: 'openai',
        isCanUseVision: mockIsCanUseVision,
        fileContext: { enabled: true },
      });

      const messages: ChatMessage[] = [
        {
          id: 'test',
          role: 'user',
          content: 'Hello',
          imageList: [{ id: 'img1', url: 'http://example.com/image.jpg', alt: 'test.png' }],
          fileList: [
            {
              id: 'file1',
              name: 'test.txt',
              fileType: 'text/plain',
              size: 100,
              url: 'http://example.com/test.txt',
            },
          ],
          createdAt: Date.now(),
          updatedAt: Date.now(),
          meta: {},
        },
      ];

      const result = await processor.process(createContext(messages));

      // Should return structured content when has files and images
      expect(Array.isArray(result.messages[0].content)).toBe(true);
      const content = result.messages[0].content as any[];
      expect(content).toHaveLength(1);
      expect(content[0].type).toBe('text');
      expect(content[0].text).toContain('SYSTEM CONTEXT');
      expect(content[0].text).toContain('Hello');
    });

    it('should not add file context when disabled', async () => {
      mockIsCanUseVision.mockReturnValue(false);

      const processor = new MessageContentProcessor({
        model: 'gpt-4',
        provider: 'openai',
        isCanUseVision: mockIsCanUseVision,
        fileContext: { enabled: false },
      });

      const messages: ChatMessage[] = [
        {
          id: 'test',
          role: 'user',
          content: 'Hello',
          fileList: [
            {
              id: 'file1',
              name: 'test.txt',
              fileType: 'text/plain',
              size: 100,
              url: 'http://example.com/test.txt',
            },
          ],
          createdAt: Date.now(),
          updatedAt: Date.now(),
          meta: {},
        },
      ];

      const result = await processor.process(createContext(messages));

      // Should not include file context
      expect(result.messages[0].content).toBe('Hello');
    });
  });

  describe('Reasoning/thinking content', () => {
    it('should handle assistant messages with reasoning correctly', async () => {
      const processor = new MessageContentProcessor({
        model: 'gpt-4',
        provider: 'openai',
        isCanUseVision: mockIsCanUseVision,
        fileContext: { enabled: false },
      });

      const messages: ChatMessage[] = [
        {
          id: 'test',
          role: 'assistant',
          content: 'The answer is 42.',
          reasoning: {
            content: 'I need to calculate the answer to life, universe, and everything.',
            signature: 'thinking_process',
          },
          createdAt: Date.now(),
          updatedAt: Date.now(),
          meta: {},
        },
      ];

      const result = await processor.process(createContext(messages));

      const content = result.messages[0].content as any[];
      expect(content).toEqual([
        {
          signature: 'thinking_process',
          thinking: 'I need to calculate the answer to life, universe, and everything.',
          type: 'thinking',
        },
        {
          text: 'The answer is 42.',
          type: 'text',
        },
      ]);
    });
  });

  describe('Message processing metadata', () => {
    it('should update processing metadata correctly', async () => {
      mockIsCanUseVision.mockReturnValue(false);

      const processor = new MessageContentProcessor({
        model: 'gpt-4',
        provider: 'openai',
        isCanUseVision: mockIsCanUseVision,
        fileContext: { enabled: true },
      });

      const messages: ChatMessage[] = [
        {
          id: 'test1',
          role: 'user',
          content: 'Hello',
          imageList: [{ id: 'img1', url: 'http://example.com/image.jpg', alt: 'test.png' }],
          fileList: [
            {
              id: 'file1',
              name: 'test.txt',
              fileType: 'text/plain',
              size: 100,
              url: 'http://example.com/test.txt',
            },
          ],
          createdAt: Date.now(),
          updatedAt: Date.now(),
          meta: {},
        },
        {
          id: 'test2',
          role: 'assistant',
          content: 'Response',
          reasoning: {
            content: 'Thinking...',
            signature: 'thinking',
          },
          createdAt: Date.now(),
          updatedAt: Date.now(),
          meta: {},
        },
      ];

      const result = await processor.process(createContext(messages));

      expect(result.metadata.messageContentProcessed).toBe(2);
      expect(result.metadata.userMessagesProcessed).toBe(1);
      expect(result.metadata.assistantMessagesProcessed).toBe(1);
    });
  });
});
