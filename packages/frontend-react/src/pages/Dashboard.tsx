import { useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { GET_DASHBOARD_STATS, GET_DEALS } from '../graphql/queries';
import { formatCurrency } from '@crm/shared-utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useMemo } from 'react';
import type { Deal } from '@crm/types';

export const Dashboard = () => {
  const { t, i18n } = useTranslation(['dashboard', 'common']);
  const { data, loading, error } = useQuery(GET_DASHBOARD_STATS);
  const { data: dealsData } = useQuery(GET_DEALS, {
    variables: { pagination: { limit: 1000, offset: 0 } },
  });
  
  // EUR to USD conversion rate (as of Dec 2025: ~1.10)
  const EUR_TO_USD = 1.10;
  const currency = i18n.language === 'en' ? 'USD' : 'EUR';

  const monthlyRevenue = useMemo(() => {
    if (!dealsData?.deals) return [];

    const monthNames = i18n.language === 'en' 
      ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      : ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];

    const monthlyData: Record<number, number> = {};
    
    dealsData.deals.forEach((deal: Deal) => {
      const date = new Date(deal.startDate);
      const month = date.getMonth();
      const year = date.getFullYear();
      
      // Nur Deals von 2024
      if (year === 2024 && deal.status === 'WON') {
        if (!monthlyData[month]) {
          monthlyData[month] = 0;
        }
        const value = currency === 'USD' ? deal.value * EUR_TO_USD : deal.value;
        monthlyData[month] += value;
      }
    });

    return Array.from({ length: 12 }, (_, i) => ({
      month: monthNames[i],
      umsatz: monthlyData[i] || 0,
    }));
  }, [dealsData, currency, i18n.language]);

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
            className="bg-white/80 dark:bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-gray-200/50 dark:border-white/10 hover:border-purple-300 dark:hover:border-purple-500/30 transition-all"
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

      {/* Revenue Chart */}
      <div className="bg-white/80 dark:bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-gray-200/50 dark:border-white/10 hover:border-purple-300 dark:hover:border-purple-500/30 transition-all">
        <h2 className="text-xl font-semibold text-gray-700 dark:text-slate-300 mb-6">
          {t('revenueByMonth', { year: 2024 })}
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyRevenue}>
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#a855f7" stopOpacity={0.8} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" className="dark:opacity-20" />
            <XAxis 
              dataKey="month" 
              stroke="#6b7280"
              className="dark:stroke-slate-400"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="#6b7280"
              className="dark:stroke-slate-400"
              style={{ fontSize: '12px' }}
              tickFormatter={(value) => 
                new Intl.NumberFormat(i18n.language, {
                  style: 'currency',
                  currency: currency,
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(value)
              }
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                borderRadius: '8px',
                color: '#374151',
              }}
              formatter={(value: number | undefined) => 
                value !== undefined
                  ? new Intl.NumberFormat(i18n.language, {
                      style: 'currency',
                      currency: currency,
                    }).format(value)
                  : '0'
              }
              labelStyle={{ color: '#374151', fontWeight: 600 }}
            />
            <Bar dataKey="umsatz" fill="url(#barGradient)" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
