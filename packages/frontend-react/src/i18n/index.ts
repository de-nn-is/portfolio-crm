import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as deTranslations from '@crm/i18n/dist/locales/de/index.js';
import * as enTranslations from '@crm/i18n/dist/locales/en/index.js';

console.log('DE Translations loaded:', deTranslations);
console.log('EN Translations loaded:', enTranslations);

i18n.use(initReactI18next).init({
  resources: {
    de: deTranslations,
    en: enTranslations,
  },
  lng: localStorage.getItem('language') || 'de',
  fallbackLng: 'en',
  defaultNS: 'common',
  ns: ['common', 'auth', 'customers', 'deals', 'dashboard', 'settings'],
  interpolation: {
    escapeValue: false,
  },
  debug: true,
});

console.log('i18n initialized with resources:', i18n.options.resources);

i18n.on('languageChanged', (lng) => {
  localStorage.setItem('language', lng);
});

export default i18n;
