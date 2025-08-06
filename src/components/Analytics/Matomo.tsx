'use client';

import Script from 'next/script';
import { memo } from 'react';

interface MatomoAnalyticsProps {
  trackerUrl: string;
  siteId: string;
}

const MatomoAnalytics = memo<MatomoAnalyticsProps>(({ trackerUrl, siteId }) => {
  if (!trackerUrl || !siteId) return null;

  return (
    <>
      <Script
        id="matomo-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            var _paq = window._paq = window._paq || [];
            /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
            _paq.push(['trackPageView']);
            _paq.push(['enableLinkTracking']);
            (function() {
              var u="${trackerUrl}";
              _paq.push(['setTrackerUrl', u+'matomo.php']);
              _paq.push(['setSiteId', '${siteId}']);
              var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
              g.async=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);
            })();
          `,
        }}
      />
    </>
  );
});

MatomoAnalytics.displayName = 'MatomoAnalytics';

export default MatomoAnalytics; 