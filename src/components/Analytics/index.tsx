import dynamic from 'next/dynamic';

import { analyticsEnv } from '@/config/analytics';
import { isDesktop } from '@/const/version';

import Desktop from './Desktop';
import Google from './Google';
import Vercel from './Vercel';

const Plausible = dynamic(() => import('./Plausible'));
const PlausibleOutbound = dynamic(() => import('./PlausibleOutbound'));
const Umami = dynamic(() => import('./Umami'));
const Matomo = dynamic(() => import('./Matomo'));
const Clarity = dynamic(() => import('./Clarity'));
const ReactScan = dynamic(() => import('./ReactScan'));

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

export default Analytics;
