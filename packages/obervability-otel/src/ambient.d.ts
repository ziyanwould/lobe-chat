/// <reference types="vitest" />

declare module '@opentelemetry/auto-instrumentations-node' {
  export function getNodeAutoInstrumentations(): any[];
}

declare module '@opentelemetry/instrumentation-pg' {
  import { InstrumentationBase } from '@opentelemetry/instrumentation';

  export class PgInstrumentation extends InstrumentationBase {
    constructor();
  }
}
