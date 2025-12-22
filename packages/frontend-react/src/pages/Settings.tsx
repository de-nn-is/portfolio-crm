import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { LanguageSwitcher } from '../components/ui/LanguageSwitcher';

export const Settings = () => {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-text-primary">
        {t('settings.title')}
      </h1>

      <div className="bg-surface-secondary rounded-lg p-6 border border-border space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-text-primary mb-4">
            {t('settings.appearance')}
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-text-primary">
                  {t('settings.theme')}
                </p>
                <p className="text-sm text-text-secondary">
                  {t('settings.themeDescription')}
                </p>
              </div>
              <button
                onClick={toggleTheme}
                className="px-4 py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary-dark transition-colors"
              >
                {theme === 'light' ? t('settings.darkMode') : t('settings.lightMode')}
              </button>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border">
              <div>
                <p className="font-medium text-text-primary">
                  {t('settings.language')}
                </p>
                <p className="text-sm text-text-secondary">
                  {t('settings.languageDescription')}
                </p>
              </div>
              <LanguageSwitcher />
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-border">
          <h2 className="text-xl font-semibold text-text-primary mb-4">
            {t('settings.about')}
          </h2>
          <div className="space-y-2 text-sm text-text-secondary">
            <p>Portfolio CRM v1.0.0</p>
            <p>{t('settings.builtWith')}: React, TypeScript, GraphQL, Tailwind CSS</p>
          </div>
        </div>
      </div>
    </div>
  );
};
