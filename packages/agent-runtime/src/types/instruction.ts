import type { FinishReason } from './event';
import { AgentState, ToolRegistry, ToolsCalling } from './state';
import type { Cost, CostCalculationContext, Usage } from './usage';

/**
 * Runtime execution context passed to Agent runner
 */
export interface RuntimeContext {
  /** Phase-specific payload/context */
  payload?: unknown;
  /** Current execution phase */
  phase:
    | 'init'
    | 'user_input'
    | 'llm_result'
    | 'tool_result'
    | 'human_response'
    | 'human_approved_tool'
    | 'error';
  /** Session metadata */
  session: {
    eventCount: number;
    messageCount: number;
    sessionId: string;
    status: AgentState['status'];
    stepCount: number;
  };
}

/**
 * Represents the "Brain" of an agent.
 * It contains all the decision-making logic and is completely stateless.
 */
export interface Agent {
  /**
   * Calculate cost from usage statistics
   * @param context - Cost calculation context with usage and limits
   * @returns Updated cost information
   */
  calculateCost?(context: CostCalculationContext): Cost;

  /**
   * Calculate usage statistics from operation results
   * @param operationType - Type of operation that was performed
   * @param operationResult - Result data from the operation
   * @param previousUsage - Previous usage statistics
   * @returns Updated usage statistics
   */
  calculateUsage?(
    operationType: 'llm' | 'tool' | 'human_interaction',
    operationResult: any,
    previousUsage: Usage,
  ): Usage;

  /** Optional custom executors mapping to extend runtime behaviors */
  executors?: Partial<Record<AgentInstruction['type'], any>>;

  /**
   * Model runtime function for LLM calls - Agent owns its model integration
   * @param payload - LLM call payload (messages, tools, etc.)
   * @returns Async iterable of streaming response chunks
   */
  modelRuntime?: (payload: unknown) => AsyncIterable<any>;

  /**
   * The core runner method. Based on the current execution context and state,
   * it decides what the next action should be.
   * @param context - Current runtime context with phase and payload
   * @param state - Complete agent state for reference
   */
  runner(context: RuntimeContext, state: AgentState): Promise<AgentInstruction>;

  /** Optional tools registry held by the agent */
  tools?: ToolRegistry;
}

export interface AgentInstructionCallLlm {
  payload: unknown;
  type: 'call_llm';
}

export interface AgentInstructionCallTool {
  toolCall: ToolsCalling;
  type: 'call_tool';
}

export interface AgentInstructionRequestHumanPrompt {
  metadata?: Record<string, unknown>;
  prompt: string;
  reason?: string;
  type: 'request_human_prompt';
}

export interface AgentInstructionRequestHumanSelect {
  metadata?: Record<string, unknown>;
  multi?: boolean;
  options: Array<{ label: string; value: string }>;
  prompt?: string;
  reason?: string;
  type: 'request_human_select';
}

export interface AgentInstructionRequestHumanApprove {
  pendingToolsCalling: ToolsCalling[];
  reason?: string;
  type: 'request_human_approve';
}

export interface AgentInstructionFinish {
  reason: FinishReason;
  reasonDetail?: string;
  type: 'finish';
}

/**
 * A serializable instruction object that the "Agent" (Brain) returns
 * to the "AgentRuntime" (Engine) to execute.
 */
export type AgentInstruction =
  | AgentInstructionCallLlm
  | AgentInstructionCallTool
  | AgentInstructionRequestHumanPrompt
  | AgentInstructionRequestHumanSelect
  | AgentInstructionRequestHumanApprove
  | AgentInstructionFinish;
