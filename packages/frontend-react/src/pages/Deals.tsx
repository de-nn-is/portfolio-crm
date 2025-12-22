import { useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { GET_DEALS } from '../graphql/queries';
import { formatCurrency } from '@crm/shared-utils';
import type { Deal } from '@crm/types';

const STATUS_COLORS = {
  LEAD: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  IN_PROGRESS: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  WON: 'bg-green-500/10 text-green-500 border-green-500/20',
  LOST: 'bg-red-500/10 text-red-500 border-red-500/20',
};

export const Deals = () => {
  const { t } = useTranslation();
  const { data, loading, error } = useQuery(GET_DEALS, {
    variables: { pagination: { limit: 50, offset: 0 } },
  });

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

  const deals: Deal[] = data?.deals || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-text-primary">
          {t('deals.title')}
        </h1>
        <Link
          to="/deals/new"
          className="px-4 py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary-dark transition-colors"
        >
          {t('deals.addNew')}
        </Link>
      </div>

      <div className="bg-surface-secondary rounded-lg border border-border overflow-hidden">
        <table className="w-full">
          <thead className="bg-surface-hover border-b border-border">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                {t('deals.title')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                {t('deals.value')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                {t('deals.status')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                {t('deals.startDate')}
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">
                {t('common.actions')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {deals.map((deal) => (
              <tr key={deal.id} className="hover:bg-surface-hover">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-text-primary">
                    {deal.title}
                  </div>
                  {deal.description && (
                    <div className="text-sm text-text-secondary line-clamp-1">
                      {deal.description}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-text-primary">
                    {formatCurrency(deal.value, deal.currency)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${
                      STATUS_COLORS[deal.status]
                    }`}
                  >
                    {t(`deals.status${deal.status}`)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                  {new Date(deal.startDate).toLocaleDateString('de-DE')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                  <Link
                    to={`/deals/${deal.id}`}
                    className="text-primary hover:text-primary-dark font-medium"
                  >
                    {t('common.view')}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {deals.length === 0 && (
          <div className="p-12 text-center text-text-secondary">
            {t('deals.noDeals')}
          </div>
        )}
      </div>
    </div>
  );
};
