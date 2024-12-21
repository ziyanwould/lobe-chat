import { cookies, headers } from 'next/headers';
import { PropsWithChildren } from 'react';
import { resolveAcceptLanguage } from 'resolve-accept-language';

import { appEnv } from '@/config/app';
import { getServerFeatureFlagsValue } from '@/config/featureFlags';
import { DEFAULT_LANG, LOBE_LOCALE_COOKIE } from '@/const/locale';
import {
  LOBE_THEME_APPEARANCE,
  LOBE_THEME_NEUTRAL_COLOR,
  LOBE_THEME_PRIMARY_COLOR,
} from '@/const/theme';
import DebugUI from '@/features/DebugUI';
import { locales } from '@/locales/resources';
import { getServerGlobalConfig } from '@/server/globalConfig';
import { ServerConfigStoreProvider } from '@/store/serverConfig';
import { getAntdLocale } from '@/utils/locale';
import { isMobileDevice } from '@/utils/server/responsive';

import AppTheme from './AppTheme';
import Debug from './Debug';
import Locale from './Locale';
import QueryProvider from './Query';
import StoreInitialization from './StoreInitialization';
import StyleRegistry from './StyleRegistry';
import Script from 'next/script';

const parserFallbackLang = async () => {
  // if the default language is not 'en-US', just return the default language as fallback lang
  if (DEFAULT_LANG !== 'en-US') return DEFAULT_LANG;

  const header = await headers();
  /**
   * The arguments are as follows:
   *
   * 1) The HTTP accept-language header.
   * 2) The available locales (they must contain the default locale).
   * 3) The default locale.
   */
  let fallbackLang: string = resolveAcceptLanguage(
    header.get('accept-language') || '',
    //  Invalid locale identifier 'ar'. A valid locale should follow the BCP 47 'language-country' format.
    locales.map((locale) => (locale === 'ar' ? 'ar-EG' : locale)),
    DEFAULT_LANG,
  );
  // if match the ar-EG then fallback to ar
  if (fallbackLang === 'ar-EG') fallbackLang = 'ar';

  return fallbackLang;
};

const GlobalLayout = async ({ children }: PropsWithChildren) => {
  // get default theme config to use with ssr
  const cookieStore = await cookies();
  const appearance = cookieStore.get(LOBE_THEME_APPEARANCE);
  const neutralColor = cookieStore.get(LOBE_THEME_NEUTRAL_COLOR);
  const primaryColor = cookieStore.get(LOBE_THEME_PRIMARY_COLOR);

  // get default locale config to use with ssr
  const defaultLang = cookieStore.get(LOBE_LOCALE_COOKIE);
  const fallbackLang = await parserFallbackLang();

  // if it's a new user, there's no cookie
  // So we need to use the fallback language parsed by accept-language
  const userLocale = defaultLang?.value || fallbackLang;

  const antdLocale = await getAntdLocale(userLocale);

  // get default feature flags to use with ssr
  const serverFeatureFlags = getServerFeatureFlagsValue();
  const serverConfig = getServerGlobalConfig();

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

  const isMobile = await isMobileDevice();
  return (
    <StyleRegistry>
      <Locale antdLocale={antdLocale} defaultLang={userLocale}>
        <AppTheme
          customFontFamily={appEnv.CUSTOM_FONT_FAMILY}
          customFontURL={appEnv.CUSTOM_FONT_URL}
          defaultAppearance={appearance?.value}
          defaultNeutralColor={neutralColor?.value as any}
          defaultPrimaryColor={primaryColor?.value as any}
          globalCDN={appEnv.CDN_USE_GLOBAL}
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
          <Debug />
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
