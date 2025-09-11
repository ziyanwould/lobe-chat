'use client';

import Script from 'next/script';
import { memo } from 'react';

interface UmamiAnalyticsProps {
  scriptUrl: string;
  websiteId?: string;
}

const UmamiAnalytics = memo<UmamiAnalyticsProps>(({ scriptUrl, websiteId }) => {
  if (!websiteId) return null;

  return <Script data-website-id={websiteId} defer src={scriptUrl} strategy="lazyOnload" />;
});

UmamiAnalytics.displayName = 'UmamiAnalytics';

export default UmamiAnalytics;
