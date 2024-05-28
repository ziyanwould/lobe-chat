/*
 * @Author: liujiarong godisljr@163.com
 * @Date: 2024-05-28 15:10:15
 * @LastEditors: liujiarong godisljr@163.com
 * @LastEditTime: 2024-05-28 15:11:06
 * @FilePath: /lobe-chat/src/const/settings/systemAgent.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { SystemAgentItem, UserSystemAgentConfig } from '@/types/user/settings';

import { DEFAULT_MODEL, DEFAULT_PROVIDER } from './llm';

export const DEFAULT_SYSTEM_AGENT_ITEM: SystemAgentItem = {
  model: DEFAULT_MODEL,
  provider: DEFAULT_PROVIDER,
};

export const DEFAULT_SYSTEM_AGENT_CONFIG: UserSystemAgentConfig = {
  topic: DEFAULT_SYSTEM_AGENT_ITEM,
  translation: DEFAULT_SYSTEM_AGENT_ITEM,
};
