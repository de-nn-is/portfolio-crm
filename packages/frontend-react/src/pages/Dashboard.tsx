import { useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { GET_DASHBOARD_STATS } from '../graphql/queries';
import { formatCurrency } from '@crm/shared-utils';

export const Dashboard = () => {
  const { t } = useTranslation();
  const { data, loading, error } = useQuery(GET_DASHBOARD_STATS);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 rounded-lg bg-error/10 border border-error text-error">
        {t('common.error')}: {error.message}
      </div>
    );
  }

  const stats = data?.dashboardStats;

  const cards = [
    {
      title: t('dashboard.totalCustomers'),
      value: stats?.totalCustomers || 0,
      icon: 'people',
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
    },
    {
      title: t('dashboard.activeCustomers'),
      value: stats?.activeCustomers || 0,
      icon: 'person_check',
      color: 'text-green-500',
      bg: 'bg-green-500/10',
    },
    {
      title: t('dashboard.totalDeals'),
      value: stats?.totalDeals || 0,
      icon: 'handshake',
      color: 'text-purple-500',
      bg: 'bg-purple-500/10',
    },
    {
      title: t('dashboard.wonDeals'),
      value: stats?.wonDeals || 0,
      icon: 'check_circle',
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-text-primary">
        {t('dashboard.title')}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div
            key={card.title}
            className="bg-surface-secondary rounded-lg p-6 border border-border"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${card.bg}`}>
                <span className={`material-icons ${card.color} text-2xl`}>
                  {card.icon}
                </span>
              </div>
            </div>
            <h3 className="text-text-secondary text-sm font-medium mb-1">
              {card.title}
            </h3>
            <p className="text-text-primary text-2xl font-bold">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-surface-secondary rounded-lg p-6 border border-border">
        <h2 className="text-xl font-semibold text-text-primary mb-4">
          {t('dashboard.revenue')}
        </h2>
        <p className="text-4xl font-bold text-primary">
          {formatCurrency(stats?.totalRevenue || 0, 'EUR')}
        </p>
      </div>
    </div>
  );
};
