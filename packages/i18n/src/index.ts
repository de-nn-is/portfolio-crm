// Shared i18n configuration and exports
import i18n from 'i18next';

export * as de from './locales/de/index.js';
export * as en from './locales/en/index.js';

export const defaultLanguage = 'de';
export const supportedLanguages = ['de', 'en'] as const;

export type SupportedLanguage = (typeof supportedLanguages)[number];

export const i18nConfig = {
  fallbackLng: defaultLanguage,
  supportedLngs: [...supportedLanguages],
  defaultNS: 'common',
  ns: ['common', 'auth', 'customers', 'deals'],
  interpolation: {
    escapeValue: false,
  },
};

export { i18n };
