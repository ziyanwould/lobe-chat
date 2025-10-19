declare module '@aws-sdk/client-bedrock-runtime' {
  export interface InvokeModelCommandInput {
    accept: string;
    body: string | Uint8Array;
    contentType: string;
    modelId: string;
  }

  export interface InvokeModelCommandOutput {
    body: Uint8Array;
    contentType: string;
  }

  export interface InvokeModelWithResponseStreamCommandInput {
    accept: string;
    body: string | Uint8Array;
    contentType: string;
    modelId: string;
  }

  export interface InvokeModelWithResponseStreamResponse {
    body: any;
    contentType?: string;
  }

  export interface ResponseStream {
    chunk?: {
      bytes: Uint8Array;
    };
  }

  export class BedrockRuntimeClient {
    constructor(config: any);
    send(command: any, context?: any): Promise<any>;
  }

  export class InvokeModelCommand {
    constructor(input: InvokeModelCommandInput);
  }

  export class InvokeModelWithResponseStreamCommand {
    constructor(input: InvokeModelWithResponseStreamCommandInput);
  }
}
