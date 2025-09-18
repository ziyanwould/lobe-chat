import { INBOX_SESSION_ID, isDesktop, isServerMode } from '@lobechat/const';
import {
  type AgentState,
  ContextEngine,
  HistorySummaryProvider,
  HistoryTruncateProcessor,
  InboxGuideProvider,
  InputTemplateProcessor,
  MessageCleanupProcessor,
  MessageContentProcessor,
  PlaceholderVariablesProcessor,
  SystemRoleInjector,
  ToolCallProcessor,
  ToolMessageReorder,
  ToolSystemRoleProvider,
} from '@lobechat/context-engine';
import { historySummaryPrompt } from '@lobechat/prompts';
import { ChatMessage, OpenAIChatMessage } from '@lobechat/types';

import { INBOX_GUIDE_SYSTEMROLE } from '@/const/guide';
import { getToolStoreState } from '@/store/tool';
import { toolSelectors } from '@/store/tool/selectors';
import { VARIABLE_GENERATORS } from '@/utils/client/parserPlaceholder';
import { genToolCallingName } from '@/utils/toolCall';

import { isCanUseFC, isCanUseVision } from './helper';
import { FetchOptions } from './types';

export const contextEngineering = async (
  {
    messages = [],
    tools,
    model,
    provider,
    systemRole,
    inputTemplate,
    enableHistoryCount,
    historyCount,
  }: {
    enableHistoryCount?: boolean;
    historyCount?: number;
    inputTemplate?: string;
    messages: ChatMessage[];
    model: string;
    provider: string;
    systemRole?: string;
    tools?: string[];
  },
  options?: FetchOptions,
): Promise<OpenAIChatMessage[]> => {
  const pipeline = new ContextEngine({
    pipeline: [
      // 1. History truncation (MUST be first, before any message injection)
      new HistoryTruncateProcessor({ enableHistoryCount, historyCount }),

      // --------- Create system role injection providers

      // 2. System role injection (agent's system role)
      new SystemRoleInjector({ systemRole }),

      // 3. Inbox guide system role injection
      new InboxGuideProvider({
        inboxGuideSystemRole: INBOX_GUIDE_SYSTEMROLE,
        inboxSessionId: INBOX_SESSION_ID,
        isWelcomeQuestion: options?.isWelcomeQuestion,
        sessionId: options?.trace?.sessionId,
      }),

      // 4. Tool system role injection
      new ToolSystemRoleProvider({
        getToolSystemRoles: (tools) => toolSelectors.enabledSystemRoles(tools)(getToolStoreState()),
        isCanUseFC,
        model,
        provider,
        tools,
      }),

      // 5. History summary injection
      new HistorySummaryProvider({
        formatHistorySummary: historySummaryPrompt,
        historySummary: options?.historySummary,
      }),

      // Create message processing processors

      // 6. Input template processing
      new InputTemplateProcessor({
        inputTemplate,
      }),

      // 7. Placeholder variables processing
      new PlaceholderVariablesProcessor({ variableGenerators: VARIABLE_GENERATORS }),

      // 8. Message content processing
      new MessageContentProcessor({
        fileContext: { enabled: isServerMode, includeFileUrl: !isDesktop },
        isCanUseVision,
        model,
        provider,
      }),

      // 9. Tool call processing
      new ToolCallProcessor({ genToolCallingName, isCanUseFC, model, provider }),

      // 10. Tool message reordering
      new ToolMessageReorder(),

      // 11. Message cleanup (final step, keep only necessary fields)
      new MessageCleanupProcessor(),
    ],
  });

  const initialState: AgentState = { messages, model, provider, systemRole, tools };

  const result = await pipeline.process({
    initialState,
    maxTokens: 10_000_000,
    messages,
    model,
  });

  return result.messages;
};
