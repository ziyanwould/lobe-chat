import type { Agent } from 'node:http';

export interface RequestFilteringAgentOptions {
  allowIPAddressList?: string[];
  allowMetaIPAddress?: boolean;
  allowPrivateIPAddress?: boolean;
  denyIPAddressList?: string[];
}

type UseAgent = (url: string, options?: RequestFilteringAgentOptions) => Agent;

const loadAgent = (): UseAgent => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires, global-require
    const mod = require('request-filtering-agent') as { useAgent: UseAgent };

    return mod.useAgent;
  } catch (error) {
    throw new Error(
      'request-filtering-agent module is required but could not be loaded. Please ensure it is installed.',
      { cause: error as Error },
    );
  }
};

const requestFilteringAgent = loadAgent();

export const createRequestFilteringAgent = (url: string, options?: RequestFilteringAgentOptions) =>
  requestFilteringAgent(url, options);
