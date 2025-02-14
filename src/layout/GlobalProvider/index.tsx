import { ReactNode, Suspense } from 'react';
import { headers } from 'next/headers';
import { appEnv } from '@/config/app';
import { getServerFeatureFlagsValue } from '@/config/featureFlags';
import DevPanel from '@/features/DevPanel';
import { getServerGlobalConfig } from '@/server/globalConfig';
import { ServerConfigStoreProvider } from '@/store/serverConfig/Provider';
import { getAntdLocale } from '@/utils/locale';

import AntdV5MonkeyPatch from './AntdV5MonkeyPatch';
import AppTheme from './AppTheme';
import ImportSettings from './ImportSettings';
import Locale from './Locale';
import QueryProvider from './Query';
import ReactScan from './ReactScan';
import StoreInitialization from './StoreInitialization';
import StyleRegistry from './StyleRegistry';
import Script from 'next/script';

interface GlobalLayoutProps {
  appearance: string;
  children: ReactNode;
  isMobile: boolean;
  locale: string;
  neutralColor?: string;
  primaryColor?: string;
}

const GlobalLayout = async ({
  children,
  neutralColor,
  primaryColor,
  locale: userLocale,
  appearance,
  isMobile,
}: GlobalLayoutProps) => {
  const antdLocale = await getAntdLocale(userLocale);

  // get default feature flags to use with ssr
  const serverFeatureFlags = getServerFeatureFlagsValue();
  const header = await headers();
  // Get the current hostname
  //  const hostname = headers().get('host') || '';
  const hostname = header.get('host') || '';

  // Determine which Umami script to use based on the hostname
  let umamiScriptProps: any;
  let analyticsScriptProps: any;

  if (hostname.endsWith('.top')) {
    umamiScriptProps = {
      'data-website-id': '2bfbc2b3-1e1f-48e0-ac6b-665117069b8d',
      src: 'https://umami.liujiarong.top/script.js',
    };
    analyticsScriptProps = {
      'data-domain': 'liujiarong.top',
      src: 'https://analytics.liujiarong.top/js/script.js',
    };
  } else if (hostname.endsWith('.online')) {
    umamiScriptProps = {
      'data-website-id': '90c00cc1-0af2-47ef-b805-734b36fd31e6',
      src: 'https://umami.liujiarong.top/script.js',
    };
    analyticsScriptProps = {
      'data-domain': 'liujiarong.online',
      src: 'https://analytics.liujiarong.top/js/script.js',
    };
  } else { // Default to .me
    umamiScriptProps = {
      'data-website-id': '4c715c06-37ac-4ee8-92ea-7169343ef4b2',
      src: 'https://umami.liujiarong.me/script.js',
    };
     analyticsScriptProps = {
      'data-domain': 'liujiarong.me',
      src: 'https://analytics.liujiarong.top/js/script.js', // Assuming the source remains the same
    };
  }
  

  // const isMobile = await isMobileDevice();
  const serverConfig = await getServerGlobalConfig();
  return (
    <StyleRegistry>
      <Locale antdLocale={antdLocale} defaultLang={userLocale}>
        <AppTheme
          customFontFamily={appEnv.CUSTOM_FONT_FAMILY}
          customFontURL={appEnv.CUSTOM_FONT_URL}
          defaultAppearance={appearance}
          defaultNeutralColor={neutralColor as any}
          defaultPrimaryColor={primaryColor as any}
          globalCDN={appEnv.CDN_USE_GLOBAL}
        >
          <ServerConfigStoreProvider
            featureFlags={serverFeatureFlags}
            isMobile={isMobile}
            serverConfig={serverConfig}
          >
            <QueryProvider>{children}</QueryProvider>
            <StoreInitialization />
            <Suspense>
              <ImportSettings />
              <ReactScan />
              {process.env.NODE_ENV === 'development' && <DevPanel />}
            </Suspense>
          </ServerConfigStoreProvider>
        </AppTheme>
        <AntdV5MonkeyPatch />
      </Locale>
      <Script
        defer
        {...umamiScriptProps}
      />
      <Script
        defer
        {...analyticsScriptProps}
      />
    </StyleRegistry>
  );
};

export default GlobalLayout;