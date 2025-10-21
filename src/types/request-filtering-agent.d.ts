import type { Agent } from 'node:http';

declare module 'request-filtering-agent' {
  export interface RequestFilteringAgentOptions {
    allowIPAddressList?: string[];
    allowMetaIPAddress?: boolean;
    allowPrivateIPAddress?: boolean;
    denyIPAddressList?: string[];
  }

  export function useAgent(url: string, options?: RequestFilteringAgentOptions): Agent;
}
