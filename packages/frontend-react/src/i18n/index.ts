import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { de, en } from '@crm/i18n';

i18n.use(initReactI18next).init({
  resources: {
    de: { translation: de },
    en: { translation: en },
  },
  lng: localStorage.getItem('language') || 'de',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

i18n.on('languageChanged', (lng) => {
  localStorage.setItem('language', lng);
});

export default i18n;
