/**
 * Token usage tracking for different types of operations
 */
export interface TokenUsage {
  /** Input tokens consumed */
  input: number;
  /** Output tokens generated */
  output: number;
  /** Total tokens (input + output) */
  total: number;
}

/**
 * Usage statistics for different operation types
 */
export interface Usage {
  /** Human interaction statistics */
  humanInteraction: {
    /** Number of approval requests */
    approvalRequests: number;
    /** Number of prompt requests */
    promptRequests: number;
    /** Number of selection requests */
    selectRequests: number;
    /** Total waiting time for human input */
    totalWaitingTimeMs: number;
  };

  /** LLM model usage */
  llm: {
    /** Number of LLM API calls made */
    apiCalls: number;
    /** Total processing time in milliseconds */
    processingTimeMs: number;
    /** Total token usage across all LLM calls */
    tokens: TokenUsage;
  };

  /** Tool usage statistics */
  tools: {
    /** Usage breakdown by tool name */
    byTool: Record<
      string,
      {
        calls: number;
        errors: number;
        totalTimeMs: number;
      }
    >;
    /** Number of tool calls executed */
    totalCalls: number;
    /** Total tool execution time */
    totalTimeMs: number;
  };
}

/**
 * Cost calculation result
 */
export interface Cost {
  /** Cost calculation timestamp */
  calculatedAt: string;

  currency: string;

  /** LLM API costs */
  llm: {
    /** Cost per model used */
    byModel: Record<
      string,
      {
        currency: string;
        inputTokens: number;
        outputTokens: number;
        totalCost: number;
      }
    >;
    currency: string;
    /** Total LLM cost */
    total: number;
  };
  /** Tool execution costs */
  tools: {
    /** Cost per tool (if tool has associated costs) */
    byTool: Record<
      string,
      {
        calls: number;
        currency: string;
        totalCost: number;
      }
    >;
    currency: string;
    /** Total tool cost */
    total: number;
  };

  /** Total session cost */
  total: number;
}

/**
 * Cost limit configuration
 */
export interface CostLimit {
  /** Currency for cost limits */
  currency: string;
  /** Maximum LLM cost allowed */
  maxLlmCost?: number;
  /** Maximum tool cost allowed */
  maxToolCost?: number;
  /** Maximum total cost allowed */
  maxTotalCost: number;
  /** Action to take when limit is exceeded */
  onExceeded: 'stop' | 'warn' | 'interrupt';
}

/**
 * Cost calculation context passed to Agent
 */
export interface CostCalculationContext {
  /** Cost limits configuration */
  costLimit?: CostLimit;
  /** Previous cost calculation (if any) */
  previousCost?: Cost;
  /** Current usage statistics */
  usage: Usage;
}
