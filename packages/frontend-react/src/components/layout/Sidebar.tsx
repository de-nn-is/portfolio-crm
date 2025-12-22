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
  const { t } = useTranslation(['common', 'auth']);
  const location = useLocation();
  const { logout } = useAuth();

  return (
    <aside className="w-64 bg-white/80 dark:bg-slate-800/30 backdrop-blur-xl border-r border-gray-200/50 dark:border-white/10 flex flex-col relative z-10 transition-colors duration-300">
      <div className="p-6">
        <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-600 to-purple-600 dark:from-cyan-400 dark:to-purple-400 bg-clip-text text-transparent">Portfolio CRM</h1>
      </div>

      <nav className="flex-1 px-3">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 mb-1 rounded-lg transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg shadow-purple-500/30'
                  : 'text-gray-700 dark:text-slate-300 hover:bg-gray-200/80 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <span className="material-icons text-xl">{item.icon}</span>
              <span>{t(item.labelKey, { ns: 'common' })}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-3">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 hover:border hover:border-red-200 dark:hover:border-red-500/30 transition-all"
        >
          <span className="material-icons text-xl">logout</span>
          <span>{t('logout', { ns: 'auth' })}</span>
        </button>
      </div>
    </aside>
  );
};
