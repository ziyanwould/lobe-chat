import { LOBE_LOCALE_COOKIE } from '@lobechat/const';
import { setCookie } from '@lobechat/utils';
import { changeLanguage } from 'i18next';

import { LocaleMode } from '@/types/locale';

export const switchLang = (locale: LocaleMode) => {
  const lang = locale === 'auto' ? navigator.language : locale;

  changeLanguage(lang);
  document.documentElement.lang = lang;

  setCookie(LOBE_LOCALE_COOKIE, locale === 'auto' ? undefined : locale, 365);
};
