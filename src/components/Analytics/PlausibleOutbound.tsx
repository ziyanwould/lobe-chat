'use client';

import Script from 'next/script';
import { memo } from 'react';

interface PlausibleOutboundAnalyticsProps {
  domain: string;
  scriptBaseUrl: string;
}

const PlausibleOutboundAnalytics = memo<PlausibleOutboundAnalyticsProps>(
  ({ domain, scriptBaseUrl }) => {
    if (!domain) return null;

    return (
      <Script
        defer
        data-domain={domain}
        src={`${scriptBaseUrl}/js/script.outbound-links.js`}
      />
    );
  },
);

PlausibleOutboundAnalytics.displayName = 'PlausibleOutboundAnalytics';

export default PlausibleOutboundAnalytics; 