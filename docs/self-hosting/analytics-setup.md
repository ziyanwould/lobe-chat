# Analytics Setup Guide

LobeChat supports multiple analytics platforms for tracking website visitors and user behavior.

## Available Analytics Platforms

### 1. Plausible Analytics (Standard)
- **Environment Variable**: `PLAUSIBLE_DOMAIN`
- **Script Base URL**: `PLAUSIBLE_SCRIPT_BASE_URL` (default: https://plausible.io)
- **Description**: Privacy-friendly analytics platform

### 2. Plausible Analytics (Outbound Links)
- **Environment Variable**: `PLAUSIBLE_OUTBOUND_DOMAIN`
- **Script Base URL**: `PLAUSIBLE_SCRIPT_BASE_URL` (default: https://plausible.io)
- **Description**: Tracks outbound link clicks for better user behavior analysis

### 3. Matomo Analytics
- **Environment Variables**: 
  - `MATOMO_SITE_ID`: Your Matomo site ID
  - `MATOMO_TRACKER_URL`: Matomo tracker URL (default: //matomo.liujiarong.top/)
- **Description**: Open-source web analytics platform

### 4. Umami Analytics
- **Environment Variables**:
  - `UMAMI_WEBSITE_ID`: Your Umami website ID
  - `UMAMI_SCRIPT_URL`: Umami script URL (default: https://analytics.umami.is/script.js)
- **Description**: Privacy-focused, open-source analytics

### 5. Google Analytics
- **Environment Variable**: `GOOGLE_ANALYTICS_MEASUREMENT_ID`
- **Description**: Google's web analytics service

### 6. Vercel Analytics
- **Environment Variable**: `ENABLE_VERCEL_ANALYTICS=1`
- **Description**: Vercel's built-in analytics

### 7. Microsoft Clarity
- **Environment Variable**: `CLARITY_PROJECT_ID`
- **Description**: Microsoft's user experience analytics

### 8. PostHog Analytics
- **Environment Variables**:
  - `POSTHOG_KEY`: Your PostHog API key
  - `POSTHOG_HOST`: PostHog host URL
- **Description**: Product analytics platform

## Configuration Examples

### Example 1: Multiple Analytics Platforms
```bash
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
```

### Example 2: Single Analytics Platform
```bash
# Only Umami Analytics
UMAMI_WEBSITE_ID=your-website-id
UMAMI_SCRIPT_URL=https://your-umami-instance.com/script.js
```

### Example 3: Google Analytics Only
```bash
# Google Analytics
GOOGLE_ANALYTICS_MEASUREMENT_ID=G-XXXXXXXXXX
```

## Features

- **Multiple Platform Support**: Run multiple analytics platforms simultaneously
- **Privacy-Focused Options**: Plausible, Umami, and Matomo are privacy-friendly
- **Outbound Link Tracking**: Plausible outbound links component tracks external link clicks
- **Custom Script URLs**: Support for self-hosted analytics instances
- **Conditional Loading**: Analytics scripts only load when environment variables are set

## Implementation Details

All analytics components are implemented as React components using Next.js `Script` component for optimal loading performance. They follow the existing patterns in the codebase and are conditionally rendered based on environment variable configuration.

## Best Practices

1. **Choose Privacy-Focused Platforms**: Consider using Plausible, Umami, or Matomo for better privacy compliance
2. **Self-Host When Possible**: Self-host analytics platforms for better data control
3. **Monitor Performance**: Multiple analytics scripts may impact page load performance
4. **GDPR Compliance**: Ensure your analytics setup complies with privacy regulations
5. **Test Thoroughly**: Verify analytics tracking works correctly in your deployment environment 