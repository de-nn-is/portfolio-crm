import { useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { GET_DASHBOARD_STATS } from '../graphql/queries';
import { formatCurrency } from '@crm/shared-utils';

export const Dashboard = () => {
  const { t, i18n } = useTranslation(['dashboard', 'common']);
  const { data, loading, error } = useQuery(GET_DASHBOARD_STATS);
  
  // EUR to USD conversion rate (as of Dec 2025: ~1.10)
  const EUR_TO_USD = 1.10;
  const currency = i18n.language === 'en' ? 'USD' : 'EUR';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/50 text-red-300">
        {t('error', { ns: 'common' })}: {error.message}
      </div>
    );
  }

  const stats = data?.dashboardStats;

  const cards = [
    {
      title: t('stats.totalCustomers', { ns: 'dashboard' }),
      value: stats?.totalCustomers || 0,
      icon: 'people',
      gradient: 'from-cyan-500 to-blue-500',
    },
    {
      title: t('stats.activeCustomers', { ns: 'dashboard' }),
      value: stats?.activeCustomers || 0,
      icon: 'person_check',
      gradient: 'from-emerald-500 to-green-500',
    },
    {
      title: t('stats.totalDeals', { ns: 'dashboard' }),
      value: stats?.totalDeals || 0,
      icon: 'handshake',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      title: t('stats.wonDeals', { ns: 'dashboard' }),
      value: stats?.wonDeals || 0,
      icon: 'check_circle',
      gradient: 'from-orange-500 to-red-500',
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-purple-600 dark:from-cyan-400 dark:to-purple-400 bg-clip-text text-transparent">
        {t('title', { ns: 'dashboard' })}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div
            key={card.title}
            className="bg-white/80 dark:bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-gray-200/50 dark:border-white/10 hover:border-cyan-300 dark:hover:border-cyan-500/30 transition-all hover:shadow-lg hover:shadow-cyan-500/10"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg bg-gradient-to-br ${card.gradient} shadow-lg`}>
                <span className="material-icons text-white text-2xl">
                  {card.icon}
                </span>
              </div>
            </div>
            <h3 className="text-gray-600 dark:text-slate-400 text-sm font-medium mb-1">
              {card.title}
            </h3>
            <p className="text-gray-900 dark:text-white text-2xl font-bold">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white/80 dark:bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-gray-200/50 dark:border-white/10 hover:border-purple-300 dark:hover:border-purple-500/30 transition-all">
        <h2 className="text-xl font-semibold text-gray-700 dark:text-slate-300 mb-4">
          {t('stats.revenue', { ns: 'dashboard' })}
        </h2>
        <p className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
          {formatCurrency(
            currency === 'USD' 
              ? (stats?.totalRevenue || 0) * EUR_TO_USD 
              : (stats?.totalRevenue || 0), 
            currency
          )}
        </p>
      </div>
    </div>
  );
};
