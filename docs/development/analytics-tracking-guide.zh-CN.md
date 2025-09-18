# LobeChat 用户追踪与统计网站配置指南

## 📋 目录

- [功能概述](#功能概述)
- [用户 ID 和 IP 追踪](#用户id和ip追踪)
- [统计网站配置](#统计网站配置)
- [环境变量详解](#环境变量详解)
- [配置示例](#配置示例)
- [扩展指南](#扩展指南)
- [维护指南](#维护指南)
- [故障排除](#故障排除)

## 🎯 功能概述

LobeChat 支持两种类型的追踪功能：

1. **用户 ID 和 IP 追踪** - 用于 AI 模型调用时的用户识别和安全控制
2. **统计网站追踪** - 用于网站访问量、用户行为等数据分析

## 🔍 用户 ID 和 IP 追踪

### 功能说明

用户 ID 和 IP 追踪功能会在 AI 模型调用时自动传递用户信息，主要用于：

- 用户行为分析
- 安全控制（防止滥用）
- 个性化服务
- 使用量统计

### 实现位置

#### 1. API 路由层 (`src/app/(backend)/webapi/chat/[provider]/route.ts`)

```typescript
// 第18行：获取用户真实IP地址
const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ||
          req.headers.get('remote-address') || 'unknown';

// 第44-48行：传递给AI模型
return await modelRuntime.chat(data, {
  ip,                    // 用户IP地址
  user: jwtPayload.userId, // 用户ID
  ...traceOptions,
  signal: req.signal,
});
```

#### 2. 类型定义 (`src/libs/model-runtime/types/chat.ts`)

```typescript
// 第139-149行：ChatMethodOptions接口
export interface ChatMethodOptions {
  callback?: ChatStreamCallbacks;
  headers?: Record<string, any>;
  ip?: string; // 用户IP地址
  requestHeaders?: Record<string, any>;
  signal?: AbortSignal;
  user?: string; // 用户ID
}
```

#### 3. AI 模型实现（聊天与绘图）

- OpenAI 兼容工厂（聊天）`packages/model-runtime/src/core/openaiCompatibleFactory/index.ts`
  - 在 `chat()` 中为请求注入 `x-user-id`、`x-user-ip`。
- OpenAI 兼容工厂（绘图）`packages/model-runtime/src/core/openaiCompatibleFactory/createImage.ts`
  - `images.generate/edit` 与 `chat.completions.create`（`:image` 后缀）均附带 `x-user-id`、`x-user-ip`。
- Azure OpenAI（绘图）`packages/model-runtime/src/providers/azureOpenai/index.ts`
  - `createImage(payload, options?)` 支持 headers，附带 `x-user-id`、`x-user-ip`。
- 其他绘图 Provider：统一附带 headers
  - MiniMax：`packages/model-runtime/src/providers/minimax/createImage.ts`
  - Qwen：`packages/model-runtime/src/providers/qwen/createImage.ts`（任务创建 / 查询、编辑）
  - Volcengine：`packages/model-runtime/src/providers/volcengine/createImage.ts`
  - BFL：`packages/model-runtime/src/providers/bfl/*`
  - SiliconCloud：`packages/model-runtime/src/providers/siliconcloud/createImage.ts`
  - Google：聊天已支持 headers 结构；SDK 当前不支持每次请求动态 headers，后续如需可改为按请求实例化 client。

### IP 地址获取逻辑

IP 地址按以下优先级获取：

1. `x-forwarded-for` 头（第一个 IP）
2. `remote-address` 头
3. 默认值 `'unknown'`

### 异步生图链路（重要）

- Lambda 路由上下文提取 IP：`src/libs/trpc/lambda/context.ts`
- 透传至异步 caller：`src/server/routers/lambda/image.ts` → `src/server/routers/async/caller.ts`（设置 `x-forwarded-for`）
- 异步服务端读取 IP：`src/libs/trpc/async/context.ts`
- 执行绘图：`src/server/routers/async/image.ts` 调用 `agentRuntime.createImage({...}, { user, ip })`

注意：若使用 Nginx/Cloudflare 等反向代理，请确保保留 `X-Forwarded-For`。Nginx 示例：

```nginx
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
```

## 📊 统计网站配置

### 支持的统计平台

| 平台                    | 组件文件                | 环境变量                          | 说明            |
| ----------------------- | ----------------------- | --------------------------------- | --------------- |
| **Plausible Analytics** | `Plausible.tsx`         | `PLAUSIBLE_DOMAIN`                | 标准统计        |
| **Plausible Outbound**  | `PlausibleOutbound.tsx` | `PLAUSIBLE_OUTBOUND_DOMAIN`       | 外部链接追踪    |
| **Matomo Analytics**    | `Matomo.tsx`            | `MATOMO_SITE_ID`                  | 开源统计平台    |
| **Umami Analytics**     | `Umami.tsx`             | `UMAMI_WEBSITE_ID`                | 隐私友好统计    |
| **Google Analytics**    | `Google.tsx`            | `GOOGLE_ANALYTICS_MEASUREMENT_ID` | Google 统计     |
| **Vercel Analytics**    | `Vercel.tsx`            | `ENABLE_VERCEL_ANALYTICS`         | Vercel 内置统计 |
| **Microsoft Clarity**   | `Clarity.tsx`           | `CLARITY_PROJECT_ID`              | 用户体验分析    |
| **PostHog Analytics**   | `Posthog.tsx`           | `POSTHOG_KEY`                     | 产品分析平台    |

### 组件架构

所有统计组件都位于 `src/components/Analytics/` 目录下：

```
src/components/Analytics/
├── index.tsx              # 主组件，统一管理所有统计
├── Plausible.tsx          # Plausible标准统计
├── PlausibleOutbound.tsx  # Plausible外部链接追踪
├── Matomo.tsx            # Matomo统计
├── Umami.tsx             # Umami统计
├── Google.tsx            # Google Analytics
├── Vercel.tsx            # Vercel Analytics
├── Clarity.tsx           # Microsoft Clarity
├── Posthog.tsx           # PostHog Analytics
└── Desktop.tsx           # 桌面端统计
```

### 主组件逻辑 (`src/components/Analytics/index.tsx`)

```typescript
const Analytics = () => {
  return (
    <>
      {analyticsEnv.ENABLE_VERCEL_ANALYTICS && <Vercel />}
      {analyticsEnv.ENABLE_GOOGLE_ANALYTICS && <Google />}
      {analyticsEnv.ENABLED_PLAUSIBLE_ANALYTICS && (
        <Plausible
          domain={analyticsEnv.PLAUSIBLE_DOMAIN}
          scriptBaseUrl={analyticsEnv.PLAUSIBLE_SCRIPT_BASE_URL}
        />
      )}
      {analyticsEnv.ENABLED_PLAUSIBLE_OUTBOUND_ANALYTICS &&
        analyticsEnv.PLAUSIBLE_OUTBOUND_DOMAIN && (
          <PlausibleOutbound
            domain={analyticsEnv.PLAUSIBLE_OUTBOUND_DOMAIN}
            scriptBaseUrl={analyticsEnv.PLAUSIBLE_SCRIPT_BASE_URL}
          />
        )}
      {analyticsEnv.ENABLED_MATOMO_ANALYTICS &&
        analyticsEnv.MATOMO_TRACKER_URL &&
        analyticsEnv.MATOMO_SITE_ID && (
          <Matomo
            siteId={analyticsEnv.MATOMO_SITE_ID}
            trackerUrl={analyticsEnv.MATOMO_TRACKER_URL}
          />
        )}
      {analyticsEnv.ENABLED_UMAMI_ANALYTICS && (
        <Umami
          scriptUrl={analyticsEnv.UMAMI_SCRIPT_URL}
          websiteId={analyticsEnv.UMAMI_WEBSITE_ID}
        />
      )}
      {analyticsEnv.ENABLED_CLARITY_ANALYTICS && (
        <Clarity projectId={analyticsEnv.CLARITY_PROJECT_ID} />
      )}
      {!!analyticsEnv.REACT_SCAN_MONITOR_API_KEY && (
        <ReactScan apiKey={analyticsEnv.REACT_SCAN_MONITOR_API_KEY} />
      )}
      {isDesktop && <Desktop />}
    </>
  );
};
```

## 🔧 环境变量详解

### 配置文件位置

所有环境变量配置都在 `src/config/analytics.ts` 文件中定义。

### 用户追踪相关

| 环境变量 | 类型 | 默认值 | 说明                       |
| -------- | ---- | ------ | -------------------------- |
| 无需配置 | -    | -      | 用户 ID 和 IP 追踪自动启用 |

### 统计网站相关

#### Plausible Analytics

| 环境变量                    | 类型   | 默认值                 | 说明         |
| --------------------------- | ------ | ---------------------- | ------------ |
| `PLAUSIBLE_DOMAIN`          | string | -                      | 网站域名     |
| `PLAUSIBLE_SCRIPT_BASE_URL` | string | `https://plausible.io` | 脚本基础 URL |

#### Plausible Outbound Links

| 环境变量                    | 类型   | 默认值                 | 说明             |
| --------------------------- | ------ | ---------------------- | ---------------- |
| `PLAUSIBLE_OUTBOUND_DOMAIN` | string | -                      | 外部链接追踪域名 |
| `PLAUSIBLE_SCRIPT_BASE_URL` | string | `https://plausible.io` | 脚本基础 URL     |

#### Matomo Analytics

| 环境变量             | 类型   | 默认值                     | 说明           |
| -------------------- | ------ | -------------------------- | -------------- |
| `MATOMO_SITE_ID`     | string | -                          | Matomo 站点 ID |
| `MATOMO_TRACKER_URL` | string | `//matomo.liujiarong.top/` | 追踪器 URL     |

#### Umami Analytics

| 环境变量           | 类型   | 默认值                                 | 说明          |
| ------------------ | ------ | -------------------------------------- | ------------- |
| `UMAMI_WEBSITE_ID` | string | -                                      | Umami 网站 ID |
| `UMAMI_SCRIPT_URL` | string | `https://analytics.umami.is/script.js` | 脚本 URL      |

#### Google Analytics

| 环境变量                          | 类型   | 默认值 | 说明        |
| --------------------------------- | ------ | ------ | ----------- |
| `GOOGLE_ANALYTICS_MEASUREMENT_ID` | string | -      | GA4 测量 ID |

#### Vercel Analytics

| 环境变量                  | 类型    | 默认值  | 说明                 |
| ------------------------- | ------- | ------- | -------------------- |
| `ENABLE_VERCEL_ANALYTICS` | boolean | `false` | 是否启用 Vercel 统计 |

#### Microsoft Clarity

| 环境变量             | 类型   | 默认值 | 说明            |
| -------------------- | ------ | ------ | --------------- |
| `CLARITY_PROJECT_ID` | string | -      | Clarity 项目 ID |

#### PostHog Analytics

| 环境变量       | 类型   | 默认值                    | 说明             |
| -------------- | ------ | ------------------------- | ---------------- |
| `POSTHOG_KEY`  | string | -                         | PostHog API 密钥 |
| `POSTHOG_HOST` | string | `https://app.posthog.com` | PostHog 主机 URL |

## 📝 配置示例

### 示例 1：启用所有统计平台

```bash
# .env.local 文件

# Plausible Analytics
PLAUSIBLE_DOMAIN=yourdomain.com
PLAUSIBLE_SCRIPT_BASE_URL=https://plausible.io

# Plausible Outbound Links
PLAUSIBLE_OUTBOUND_DOMAIN=drawaspark.com
PLAUSIBLE_SCRIPT_BASE_URL=https://plausible.liujiarong.top

# Matomo Analytics
MATOMO_SITE_ID=4
MATOMO_TRACKER_URL=//matomo.liujiarong.top/

# Umami Analytics
UMAMI_WEBSITE_ID=e9dfe65d-4e8f-4c7d-b300-e11c019d36e7
UMAMI_SCRIPT_URL=https://umami.liujiarong.top/script.js

# Google Analytics
GOOGLE_ANALYTICS_MEASUREMENT_ID=G-XXXXXXXXXX

# Vercel Analytics
ENABLE_VERCEL_ANALYTICS=1

# Microsoft Clarity
CLARITY_PROJECT_ID=your-clarity-project-id

# PostHog Analytics
POSTHOG_KEY=your-posthog-key
POSTHOG_HOST=https://app.posthog.com
```

### 示例 2：仅启用隐私友好统计

```bash
# .env.local 文件

# Plausible Analytics
PLAUSIBLE_DOMAIN=yourdomain.com

# Umami Analytics
UMAMI_WEBSITE_ID=your-umami-website-id
UMAMI_SCRIPT_URL=https://your-umami-instance.com/script.js

# Matomo Analytics
MATOMO_SITE_ID=your-matomo-site-id
MATOMO_TRACKER_URL=//your-matomo-instance.com/
```

### 示例 3：仅启用 Google Analytics

```bash
# .env.local 文件

# Google Analytics
GOOGLE_ANALYTICS_MEASUREMENT_ID=G-XXXXXXXXXX
```

## 🔧 扩展指南

### 添加新的统计平台

#### 1. 创建统计组件

在 `src/components/Analytics/` 目录下创建新的组件文件：

```typescript
// src/components/Analytics/NewAnalytics.tsx
'use client';

import Script from 'next/script';
import { memo } from 'react';

interface NewAnalyticsProps {
  apiKey: string;
  endpoint?: string;
}

const NewAnalytics = memo<NewAnalyticsProps>(({ apiKey, endpoint }) => {
  if (!apiKey) return null;

  return (
    <Script
      id="new-analytics"
      strategy="afterInteractive"
      src={`${endpoint}/script.js`}
      data-api-key={apiKey}
    />
  );
});

NewAnalytics.displayName = 'NewAnalytics';

export default NewAnalytics;
```

#### 2. 更新配置文件

在 `src/config/analytics.ts` 中添加环境变量：

```typescript
export const getAnalyticsConfig = () => {
  return createEnv({
    server: {
      // ... 现有配置
      ENABLED_NEW_ANALYTICS: z.boolean(),
      NEW_ANALYTICS_API_KEY: z.string().optional(),
      NEW_ANALYTICS_ENDPOINT: z.string().optional(),
    },
    runtimeEnv: {
      // ... 现有配置
      ENABLED_NEW_ANALYTICS: !!process.env.NEW_ANALYTICS_API_KEY,
      NEW_ANALYTICS_API_KEY: process.env.NEW_ANALYTICS_API_KEY,
      NEW_ANALYTICS_ENDPOINT: process.env.NEW_ANALYTICS_ENDPOINT || 'https://default-endpoint.com',
    },
  });
};
```

#### 3. 更新主组件

在 `src/components/Analytics/index.tsx` 中添加新组件：

```typescript
import dynamic from 'next/dynamic';

// 动态导入新组件
const NewAnalytics = dynamic(() => import('./NewAnalytics'));

const Analytics = () => {
  return (
    <>
      {/* ... 现有组件 */}
      {analyticsEnv.ENABLED_NEW_ANALYTICS && (
        <NewAnalytics
          apiKey={analyticsEnv.NEW_ANALYTICS_API_KEY}
          endpoint={analyticsEnv.NEW_ANALYTICS_ENDPOINT}
        />
      )}
    </>
  );
};
```

### 扩展用户追踪功能

#### 1. 添加新的追踪字段

在 `src/libs/model-runtime/types/chat.ts` 中扩展 `ChatMethodOptions`：

```typescript
export interface ChatMethodOptions {
  // ... 现有字段
  ip?: string;
  user?: string;
  sessionId?: string; // 新增：会话ID
  userAgent?: string; // 新增：用户代理
  referrer?: string; // 新增：来源页面
}
```

#### 2. 在 API 路由中获取新字段

在 `src/app/(backend)/webapi/chat/[provider]/route.ts` 中：

```typescript
export const POST = checkAuth(async (req: Request, { params, jwtPayload, createRuntime }) => {
  // ... 现有代码

  // 获取新的追踪信息
  const userAgent = req.headers.get('user-agent') || 'unknown';
  const referrer = req.headers.get('referer') || 'unknown';
  const sessionId = jwtPayload.sessionId || 'unknown';

  return await modelRuntime.chat(data, {
    ip,
    user: jwtPayload.userId,
    userAgent,
    referrer,
    sessionId,
    ...traceOptions,
    signal: req.signal,
  });
});
```

#### 3. 在 AI 模型中传递新字段

在相应的 AI 模型实现中添加新的 headers：

```typescript
// 在Google AI模型或OpenAI兼容工厂中
customHeaders.append('x-user-agent', options?.userAgent || 'unknown');
customHeaders.append('x-referrer', options?.referrer || 'unknown');
customHeaders.append('x-session-id', options?.sessionId || 'unknown');

// 注意：对于Google AI模型，由于API限制，这些headers不会传递到API调用中
// 但对于OpenAI兼容的工厂，这些headers会正常传递
```

## 🛠️ 维护指南

### 日常维护任务

#### 1. 检查统计平台状态

定期检查各个统计平台是否正常工作：

```bash
# 检查环境变量是否正确设置
grep -r "ENABLED_.*_ANALYTICS" src/config/analytics.ts

# 检查组件是否正确导入
grep -r "dynamic.*import.*Analytics" src/components/Analytics/index.tsx
```

#### 2. 监控性能影响

多个统计脚本可能影响页面加载性能，建议：

- 使用 `strategy="afterInteractive"` 延迟加载
- 定期检查页面加载时间
- 考虑使用条件加载（只在需要时加载）

#### 3. 更新统计平台配置

当统计平台更新时，需要相应更新组件：

```typescript
// 示例：更新Matomo组件以支持新功能
const MatomoAnalytics = memo<MatomoAnalyticsProps>(({ trackerUrl, siteId }) => {
  return (
    <Script
      id="matomo-analytics"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          // 更新后的Matomo配置代码
          var _paq = window._paq = window._paq || [];
          _paq.push(['trackPageView']);
          _paq.push(['enableLinkTracking']);
          _paq.push(['enableHeartBeatTimer']); // 新增功能
          // ... 其他配置
        `,
      }}
    />
  );
});
```

### 代码审查要点（用户追踪）

- 聊天与绘图路径是否都传入 `ChatMethodOptions` 的 `user/ip`。
- Provider 的 HTTP 请求是否附带 `x-user-id/x-user-ip`。
- 代理层是否正确保留 `X-Forwarded-For`。

#### 1. 新增统计组件时

- ✅ 使用 `memo` 优化性能
- ✅ 添加 `displayName` 便于调试
- ✅ 使用 `'use client'` 指令
- ✅ 添加适当的类型定义
- ✅ 条件渲染避免不必要的加载

#### 2. 修改用户追踪时

- ✅ 更新类型定义
- ✅ 在 API 路由中获取新字段
- ✅ 在 AI 模型中传递新字段
- ✅ 添加相应的测试用例

#### 3. 环境变量配置时

- ✅ 在 `analytics.ts` 中添加类型定义
- ✅ 在 `runtimeEnv` 中设置默认值
- ✅ 添加适当的注释说明

## 🔍 故障排除

### 常见问题

#### 1. 统计脚本不加载

**症状**: 统计平台显示没有数据

**检查步骤**:

1. 确认环境变量是否正确设置
2. 检查浏览器控制台是否有错误
3. 验证网络请求是否成功

**解决方案**:

```bash
# 检查环境变量
echo $PLAUSIBLE_DOMAIN
echo $UMAMI_WEBSITE_ID

# 检查组件是否正确渲染
# 在浏览器开发者工具中查看是否有对应的script标签
```

#### 2. 用户追踪不工作

**症状**: AI 模型调用时没有收到用户信息

**检查步骤**:

1. 确认 API 路由中的 IP 获取逻辑
2. 检查 AI 模型是否正确添加 headers
3. 验证 JWT payload 是否包含用户 ID

**解决方案**:

```typescript
// 在API路由中添加调试日志
console.log('User IP:', ip);
console.log('User ID:', jwtPayload.userId);

// 在AI模型中添加调试日志
console.log('Custom headers:', customHeaders);
```

#### 3. 环境变量不生效

**症状**: 修改环境变量后功能没有变化

**检查步骤**:

1. 确认环境变量文件位置正确
2. 检查变量名拼写是否正确
3. 重启开发服务器

**解决方案**:

```bash
# 重启开发服务器
npm run dev

# 或者清除缓存后重启
rm -rf .next && npm run dev
```

### 调试技巧

#### 1. 启用调试模式

在环境变量中启用调试模式：

```bash
# 启用Vercel Analytics调试
DEBUG_VERCEL_ANALYTICS=1

# 启用PostHog调试
DEBUG_POSTHOG_ANALYTICS=1
```

#### 2. 浏览器调试

在浏览器开发者工具中检查：

```javascript
// 检查统计对象是否存在
console.log('Plausible:', window.plausible);
console.log('Matomo:', window._paq);
console.log('Umami:', window.umami);

// 检查网络请求
// 在Network标签页中查看统计请求
```

#### 3. 服务端调试

在 API 路由中添加调试信息：

```typescript
// 在chat route中添加
console.log('Request headers:', Object.fromEntries(req.headers.entries()));
console.log('Extracted IP:', ip);
console.log('User ID:', jwtPayload.userId);
```

## 📚 相关文档

- [Analytics Setup Guide](../self-hosting/analytics-setup.md) - 英文配置指南
- [Environment Variables](../self-hosting/environment-variables/) - 环境变量文档
- [Development Guide](../basic/) - 开发指南

## 🤝 贡献指南

如果你要添加新的统计平台或改进现有功能：

1. 遵循现有的代码风格和架构
2. 添加适当的类型定义
3. 更新相关文档
4. 添加测试用例
5. 提交 Pull Request

---

**最后更新**: 2024 年 12 月
**维护者**: LobeChat 开发团队
