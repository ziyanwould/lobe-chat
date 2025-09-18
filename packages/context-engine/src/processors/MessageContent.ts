import { filesPrompts } from '@lobechat/prompts';
import { imageUrlToBase64, isLocalUrl, parseDataUri } from '@lobechat/utils';
import debug from 'debug';

import { BaseProcessor } from '../base/BaseProcessor';
import type { PipelineContext, ProcessorOptions } from '../types';

const log = debug('context-engine:processor:MessageContentProcessor');

export interface FileContextConfig {
  /** Whether to enable file context injection */
  enabled?: boolean;
  /** Whether to include file URLs in file context prompts */
  includeFileUrl?: boolean;
}

export interface MessageContentConfig {
  /** File context configuration */
  fileContext?: FileContextConfig;
  /** Function to check if vision is supported */
  isCanUseVision?: (model: string, provider: string) => boolean | undefined;
  /** Model name */
  model: string;
  /** Provider name */
  provider: string;
}

export interface UserMessageContentPart {
  image_url?: {
    detail?: string;
    url: string;
  };
  signature?: string;
  text?: string;
  thinking?: string;
  type: 'text' | 'image_url' | 'thinking';
}

/**
 * Message Content Processor
 * Responsible for handling content format conversion of user and assistant messages
 */
export class MessageContentProcessor extends BaseProcessor {
  readonly name = 'MessageContentProcessor';

  constructor(
    private config: MessageContentConfig,
    options: ProcessorOptions = {},
  ) {
    super(options);
  }

  protected async doProcess(context: PipelineContext): Promise<PipelineContext> {
    const clonedContext = this.cloneContext(context);

    let processedCount = 0;
    let userMessagesProcessed = 0;
    let assistantMessagesProcessed = 0;

    // 处理每条消息的内容
    for (let i = 0; i < clonedContext.messages.length; i++) {
      const message = clonedContext.messages[i];

      try {
        let updatedMessage = message;

        if (message.role === 'user') {
          updatedMessage = await this.processUserMessage(message);
          if (updatedMessage !== message) {
            userMessagesProcessed++;
            processedCount++;
          }
        } else if (message.role === 'assistant') {
          updatedMessage = await this.processAssistantMessage(message);
          if (updatedMessage !== message) {
            assistantMessagesProcessed++;
            processedCount++;
          }
        }

        if (updatedMessage !== message) {
          clonedContext.messages[i] = updatedMessage;
          log(`Processed message content ${message.id}, role: ${message.role}`);
        }
      } catch (error) {
        log.extend('error')(`Error processing message ${message.id} content: ${error}`);
        // 继续处理其他消息
      }
    }

    // 更新元数据
    clonedContext.metadata.messageContentProcessed = processedCount;
    clonedContext.metadata.userMessagesProcessed = userMessagesProcessed;
    clonedContext.metadata.assistantMessagesProcessed = assistantMessagesProcessed;

    log(
      `Message content processing completed, processed ${processedCount} messages (user: ${userMessagesProcessed}, assistant: ${assistantMessagesProcessed})`,
    );

    return this.markAsExecuted(clonedContext);
  }

  /**
   * Process user message content
   */
  private async processUserMessage(message: any): Promise<any> {
    // Check if images or files need processing
    const hasImages = message.imageList && message.imageList.length > 0;
    const hasFiles = message.fileList && message.fileList.length > 0;

    // If no images and files, return plain text content directly
    if (!hasImages && !hasFiles) {
      return {
        ...message,
        content: message.content,
      };
    }

    const contentParts: UserMessageContentPart[] = [];

    // Add text content
    let textContent = message.content || '';

    // Add file context (if file context is enabled and has files or images)
    if ((hasFiles || hasImages) && this.config.fileContext?.enabled) {
      const filesContext = filesPrompts({
        addUrl: this.config.fileContext.includeFileUrl ?? true,
        fileList: message.fileList,
        imageList: message.imageList,
      });

      if (filesContext) {
        textContent = (textContent + '\n\n' + filesContext).trim();
      }
    }

    // Add text part
    if (textContent) {
      contentParts.push({
        text: textContent,
        type: 'text',
      });
    }

    // Process image content
    if (hasImages && this.config.isCanUseVision?.(this.config.model, this.config.provider)) {
      const imageContentParts = await this.processImageList(message.imageList || []);
      contentParts.push(...imageContentParts);
    }

    // 明确返回的字段，只保留必要的消息字段
    const hasFileContext = (hasFiles || hasImages) && this.config.fileContext?.enabled;
    const hasVisionContent =
      hasImages && this.config.isCanUseVision?.(this.config.model, this.config.provider);

    // 如果只有文本内容且没有添加文件上下文也没有视觉内容，返回纯文本
    if (
      contentParts.length === 1 &&
      contentParts[0].type === 'text' &&
      !hasFileContext &&
      !hasVisionContent
    ) {
      return {
        content: contentParts[0].text,
        createdAt: message.createdAt,
        id: message.id,
        meta: message.meta,
        role: message.role,
        updatedAt: message.updatedAt,
        // 保留其他可能需要的字段，但移除已处理的文件相关字段
        ...(message.tools && { tools: message.tools }),
        ...(message.tool_calls && { tool_calls: message.tool_calls }),
        ...(message.tool_call_id && { tool_call_id: message.tool_call_id }),
        ...(message.name && { name: message.name }),
      };
    }

    // 返回结构化内容
    return {
      content: contentParts,
      createdAt: message.createdAt,
      id: message.id,
      meta: message.meta,
      role: message.role,
      updatedAt: message.updatedAt,
      // 保留其他可能需要的字段，但移除已处理的文件相关字段
      ...(message.tools && { tools: message.tools }),
      ...(message.tool_calls && { tool_calls: message.tool_calls }),
      ...(message.tool_call_id && { tool_call_id: message.tool_call_id }),
      ...(message.name && { name: message.name }),
    };
  }

  /**
   * 处理助手消息内容
   */
  private async processAssistantMessage(message: any): Promise<any> {
    // 检查是否有推理内容（thinking mode）
    const shouldIncludeThinking = message.reasoning && !!message.reasoning?.signature;

    if (shouldIncludeThinking) {
      const contentParts: UserMessageContentPart[] = [
        {
          signature: message.reasoning!.signature,
          thinking: message.reasoning!.content,
          type: 'thinking',
        },
        {
          text: message.content,
          type: 'text',
        },
      ];

      return {
        ...message,
        content: contentParts,
      };
    }

    // 检查是否有图片（助手消息也可能包含图片）
    const hasImages = message.imageList && message.imageList.length > 0;

    if (hasImages && this.config.isCanUseVision?.(this.config.model, this.config.provider)) {
      // 创建结构化内容
      const contentParts: UserMessageContentPart[] = [];

      if (message.content) {
        contentParts.push({
          text: message.content,
          type: 'text',
        });
      }

      // 处理图片内容
      const imageContentParts = await this.processImageList(message.imageList || []);
      contentParts.push(...imageContentParts);

      return {
        ...message,
        content: contentParts,
      };
    }

    // 普通助手消息，返回纯文本内容
    return {
      ...message,
      content: message.content,
    };
  }

  /**
   * 处理图片列表
   */
  private async processImageList(imageList: any[]): Promise<UserMessageContentPart[]> {
    if (!imageList || imageList.length === 0) {
      return [];
    }

    return Promise.all(
      imageList.map(async (image) => {
        const { type } = parseDataUri(image.url);

        let processedUrl = image.url;
        if (type === 'url' && isLocalUrl(image.url)) {
          const { base64, mimeType } = await imageUrlToBase64(image.url);
          processedUrl = `data:${mimeType};base64,${base64}`;
        }

        return {
          image_url: { detail: 'auto', url: processedUrl },
          type: 'image_url',
        } as UserMessageContentPart;
      }),
    );
  }

  /**
   * 验证内容部分格式
   */
  private validateContentPart(part: UserMessageContentPart): boolean {
    if (!part || !part.type) return false;

    switch (part.type) {
      case 'text': {
        return typeof part.text === 'string';
      }
      case 'image_url': {
        return !!(part.image_url && part.image_url.url);
      }
      case 'thinking': {
        return !!(part.thinking && part.signature);
      }
      default: {
        return false;
      }
    }
  }
}
