import dynamic from 'next/dynamic';
import { cookies, headers } from 'next/headers';
import { FC, PropsWithChildren } from 'react';
import { resolveAcceptLanguage } from 'resolve-accept-language';

import { getDebugConfig } from '@/config/debug';
import { getServerFeatureFlagsValue } from '@/config/featureFlags';
import { LOBE_LOCALE_COOKIE } from '@/const/locale';
import {
  LOBE_THEME_APPEARANCE,
  LOBE_THEME_NEUTRAL_COLOR,
  LOBE_THEME_PRIMARY_COLOR,
} from '@/const/theme';
import { locales } from '@/locales/resources';
import { getServerGlobalConfig } from '@/server/globalConfig';
import { ServerConfigStoreProvider } from '@/store/serverConfig';
import { getAntdLocale } from '@/utils/locale';
import { isMobileDevice } from '@/utils/responsive';

import AppTheme from './AppTheme';
import Locale from './Locale';
import QueryProvider from './Query';
import StoreInitialization from './StoreInitialization';
import StyleRegistry from './StyleRegistry';
import Script from 'next/script';

let DebugUI: FC = () => null;

// we need use Constant Folding to remove code below in production
// refs: https://webpack.js.org/plugins/internal-plugins/#constplugin
if (process.env.NODE_ENV === 'development') {
  // eslint-disable-next-line unicorn/no-lonely-if
  if (getDebugConfig().DEBUG_MODE) {
    DebugUI = dynamic(() => import('@/features/DebugUI'), { ssr: false }) as FC;
  }
}

const parserFallbackLang = () => {
  /**
   * The arguments are as follows:
   *
   * 1) The HTTP accept-language header.
   * 2) The available locales (they must contain the default locale).
   * 3) The default locale.
   */
  let fallbackLang: string = resolveAcceptLanguage(
    headers().get('accept-language') || '',
    //  Invalid locale identifier 'ar'. A valid locale should follow the BCP 47 'language-country' format.
    locales.map((locale) => (locale === 'ar' ? 'ar-EG' : locale)),
    'en-US',
  );
  // if match the ar-EG then fallback to ar
  if (fallbackLang === 'ar-EG') fallbackLang = 'ar';

  return fallbackLang;
};

const GlobalLayout = async ({ children }: PropsWithChildren) => {
  // get default theme config to use with ssr
  const cookieStore = cookies();
  const appearance = cookieStore.get(LOBE_THEME_APPEARANCE);
  const neutralColor = cookieStore.get(LOBE_THEME_NEUTRAL_COLOR);
  const primaryColor = cookieStore.get(LOBE_THEME_PRIMARY_COLOR);

  // get default locale config to use with ssr
  const defaultLang = cookieStore.get(LOBE_LOCALE_COOKIE);
  const fallbackLang = parserFallbackLang();

  // if it's a new user, there's no cookie
  // So we need to use the fallback language parsed by accept-language
  const userLocale = defaultLang?.value || fallbackLang;

  const antdLocale = await getAntdLocale(userLocale);

  // get default feature flags to use with ssr
  const serverFeatureFlags = getServerFeatureFlagsValue();
  const serverConfig = getServerGlobalConfig();
  const isMobile = isMobileDevice();

   // Get the current hostname
   const hostname = headers().get('host') || '';

   // Determine which Umami script to use based on the hostname
   const umamiScriptProps = hostname.endsWith('.top') 
     ? {
         'data-website-id': '2bfbc2b3-1e1f-48e0-ac6b-665117069b8d',
         src: 'https://umami.liujiarong.top/script.js',
       }
     : {
         'data-website-id': '4c715c06-37ac-4ee8-92ea-7169343ef4b2',
         src: 'https://umami.liujiarong.me/script.js',
       };
 
   // Determine which analytics script to use based on the hostname
   const analyticsScriptProps = hostname.endsWith('.top')
     ? {
         'data-domain': 'liujiarong.top',
         src: 'https://analytics.liujiarong.top/js/script.js',
       }
     : {
         'data-domain': 'liujiarong.me',
         src: 'https://analytics.liujiarong.top/js/script.js', // Assuming the source remains the same
       };

  return (
    <StyleRegistry>
      <Locale antdLocale={antdLocale} defaultLang={userLocale}>
        <AppTheme
          defaultAppearance={appearance?.value}
          defaultNeutralColor={neutralColor?.value as any}
          defaultPrimaryColor={primaryColor?.value as any}
        >
          <ServerConfigStoreProvider
            featureFlags={serverFeatureFlags}
            isMobile={isMobile}
            serverConfig={serverConfig}
          >
            <QueryProvider>{children}</QueryProvider>
            <StoreInitialization />
          </ServerConfigStoreProvider>
          <DebugUI />
        </AppTheme>
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
