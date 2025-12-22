import { useTranslation } from 'react-i18next';

const LANGUAGES = [
  { code: 'de', short: 'DE', label: 'Deutsch' },
  { code: 'en', short: 'EN', label: 'English' },
];

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const currentLang = LANGUAGES.find(l => l.code === i18n.language) || LANGUAGES[0];

  return (
    <button
      onClick={() => {
        const newLang = i18n.language === 'de' ? 'en' : 'de';
        i18n.changeLanguage(newLang);
      }}
      className="h-9 px-3 flex items-center justify-center rounded-lg bg-gray-200/80 dark:bg-white/10 hover:bg-gray-300/80 dark:hover:bg-white/20 border border-gray-300/50 dark:border-white/10 hover:border-gray-400/50 dark:hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all backdrop-blur-md"
      title={currentLang.label}
    >
      <span className="text-sm font-semibold text-gray-700 dark:text-white uppercase leading-none tracking-wider">{currentLang.short}</span>
    </button>
  );
};
