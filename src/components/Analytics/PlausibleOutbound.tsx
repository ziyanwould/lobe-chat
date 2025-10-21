'use client';

import Script from 'next/script';
import { memo } from 'react';

interface PlausibleOutboundProps {
  domain: string;
  scriptBaseUrl?: string;
}

const PlausibleOutbound = memo<PlausibleOutboundProps>(({ domain, scriptBaseUrl }) => {
  if (!domain) return null;

  const baseUrl = scriptBaseUrl ? scriptBaseUrl.replace(/\/$/, '') : 'https://plausible.io';
  const scriptUrl = `${baseUrl}/js/plausible.outbound-links.js`;

  return (
    <Script
      data-api={`${baseUrl}/api/event`}
      data-domain={domain}
      src={scriptUrl}
      strategy="lazyOnload"
    />
  );
});

PlausibleOutbound.displayName = 'PlausibleOutbound';

export default PlausibleOutbound;
