import { useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { GET_CUSTOMERS } from '../graphql/queries';
import type { Customer } from '@crm/types';

const STATUS_COLORS = {
  ACTIVE: 'bg-green-500/10 text-green-500 border-green-500/20',
  INACTIVE: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
  LEAD: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
};

export const Customers = () => {
  const { t } = useTranslation();
  const { data, loading, error } = useQuery(GET_CUSTOMERS, {
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

  const customers: Customer[] = data?.customers || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-text-primary">
          {t('customers.title')}
        </h1>
        <Link
          to="/customers/new"
          className="px-4 py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary-dark transition-colors"
        >
          {t('customers.addNew')}
        </Link>
      </div>

      <div className="bg-surface-secondary rounded-lg border border-border overflow-hidden">
        <table className="w-full">
          <thead className="bg-surface-hover border-b border-border">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                {t('customers.name')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                {t('customers.company')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                {t('customers.email')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                {t('customers.phone')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                {t('customers.status')}
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">
                {t('common.actions')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {customers.map((customer) => (
              <tr key={customer.id} className="hover:bg-surface-hover">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-text-primary">
                    {customer.firstName} {customer.lastName}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-text-secondary">
                    {customer.company || '-'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-text-secondary">
                    {customer.email}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-text-secondary">
                    {customer.phone || '-'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${
                      STATUS_COLORS[customer.status]
                    }`}
                  >
                    {t(`customers.status${customer.status}`)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                  <Link
                    to={`/customers/${customer.id}`}
                    className="text-primary hover:text-primary-dark font-medium"
                  >
                    {t('common.view')}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {customers.length === 0 && (
          <div className="p-12 text-center text-text-secondary">
            {t('customers.noCustomers')}
          </div>
        )}
      </div>
    </div>
  );
};
