'use client';

import Script from 'next/script';
import { memo } from 'react';

interface MatomoAnalyticsProps {
  siteId: string;
  trackerUrl: string;
}

const MatomoAnalytics = memo<MatomoAnalyticsProps>(({ siteId, trackerUrl }) => {
  if (!trackerUrl || !siteId) return null;

  const normalizedTrackerUrl = trackerUrl.endsWith('/') ? trackerUrl : `${trackerUrl}/`;

  return (
    <Script
      dangerouslySetInnerHTML={{
        __html: `
          var _paq = window._paq = window._paq || [];
          _paq.push(['trackPageView']);
          _paq.push(['enableLinkTracking']);
          (function() {
            var u="${normalizedTrackerUrl}";
            _paq.push(['setTrackerUrl', u+'matomo.php']);
            _paq.push(['setSiteId', '${siteId}']);
            var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
            g.async=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);
          })();
        `,
      }}
      id="matomo-analytics"
      strategy="lazyOnload"
    />
  );
});

MatomoAnalytics.displayName = 'MatomoAnalytics';

export default MatomoAnalytics;
