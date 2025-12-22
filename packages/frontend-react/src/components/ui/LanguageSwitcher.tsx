import { useTranslation } from 'react-i18next';

const LANGUAGES = [
  { code: 'de', name: 'Deutsch' },
  { code: 'en', name: 'English' },
];

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  return (
    <select
      value={i18n.language}
      onChange={(e) => i18n.changeLanguage(e.target.value)}
      className="px-3 py-1.5 rounded-lg bg-surface-secondary text-text-primary border border-border focus:outline-none focus:ring-2 focus:ring-primary"
    >
      {LANGUAGES.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.name}
        </option>
      ))}
    </select>
  );
};
