/*
 * @Author: Liu Jiarong
 * @Date: 2024-10-31 21:41:53
 * @LastEditors: Liu Jiarong
 * @LastEditTime: 2024-11-24 00:10:52
 * @FilePath: /lobe-chat/src/app/(backend)/webapi/chat/[provider]/route.ts
 * @Description: 
 * 
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
 */
import { checkAuth } from '@/app/(backend)/middleware/auth';
import {
  AGENT_RUNTIME_ERROR_SET,
  AgentRuntime,
  ChatCompletionErrorPayload,
} from '@/libs/agent-runtime';
import { createTraceOptions, initAgentRuntimeWithUserPayload } from '@/server/modules/AgentRuntime';
import { ChatErrorType } from '@/types/fetch';
import { ChatStreamPayload } from '@/types/openai/chat';
import { createErrorResponse } from '@/utils/errorResponse';
import { getTracePayload } from '@/utils/trace';

export const runtime = 'edge';

export const POST = checkAuth(async (req: Request, { params, jwtPayload, createRuntime }) => {
  const { provider } = params;
  // 从请求头中获取用户的真实IP地址
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || req.headers.get('remote-address') || 'unknown';

  try {
    // ============  1. init chat model   ============ //
    let agentRuntime: AgentRuntime;
    if (createRuntime) {
      agentRuntime = createRuntime(jwtPayload);
    } else {
      agentRuntime = await initAgentRuntimeWithUserPayload(provider, jwtPayload);
    }

    // ============  2. create chat completion   ============ //

    const data = (await req.json()) as ChatStreamPayload;

    const tracePayload = getTracePayload(req);

    let traceOptions = {};
    // If user enable trace
    if (tracePayload?.enabled) {
      traceOptions = createTraceOptions(data, {
        provider,
        trace: tracePayload,
      });
    }

    return await agentRuntime.chat(data, {ip, user: jwtPayload.userId, ...traceOptions });
  } catch (e) {
    const {
      errorType = ChatErrorType.InternalServerError,
      error: errorContent,
      ...res
    } = e as ChatCompletionErrorPayload;

    const error = errorContent || e;

    const logMethod = AGENT_RUNTIME_ERROR_SET.has(errorType as string) ? 'warn' : 'error';
    // track the error at server side
    console[logMethod](`Route: [${provider}] ${errorType}:`, error);

    return createErrorResponse(errorType, { error, ...res, provider });
  }
});
