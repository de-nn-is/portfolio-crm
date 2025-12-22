import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';

const NAV_ITEMS = [
  { path: '/dashboard', icon: 'dashboard', labelKey: 'nav.dashboard' },
  { path: '/customers', icon: 'people', labelKey: 'nav.customers' },
  { path: '/deals', icon: 'handshake', labelKey: 'nav.deals' },
  { path: '/settings', icon: 'settings', labelKey: 'nav.settings' },
];

export const Sidebar = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { logout } = useAuth();

  return (
    <aside className="w-64 bg-surface-secondary border-r border-border flex flex-col">
      <div className="p-6">
        <h1 className="text-xl font-bold text-primary">Portfolio CRM</h1>
      </div>

      <nav className="flex-1 px-3">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 mb-1 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary text-white'
                  : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary'
              }`}
            >
              <span className="material-icons text-xl">{item.icon}</span>
              <span>{t(item.labelKey)}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-3">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors"
        >
          <span className="material-icons text-xl">logout</span>
          <span>{t('auth.logout')}</span>
        </button>
      </div>
    </aside>
  );
};
