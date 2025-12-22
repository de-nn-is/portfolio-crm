import { useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { GET_CUSTOMERS } from '../graphql/queries';
import type { Customer } from '@crm/types';

const STATUS_COLORS = {
  ACTIVE: 'bg-green-500/10 text-green-500 border-green-500/20',
  INACTIVE: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
  LEAD: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
};

type SortField = 'name' | 'company' | 'email' | 'status';
type SortDirection = 'asc' | 'desc';

export const Customers = () => {
  const { t } = useTranslation(['customers', 'common']);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  
  const { data, loading, error } = useQuery(GET_CUSTOMERS, {
    variables: { pagination: { limit: 50, offset: 0 } },
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredAndSortedCustomers = useMemo(() => {
    let result: Customer[] = [...(data?.customers || [])]; // Shallow copy to avoid mutating frozen array

    // Filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (customer) =>
          `${customer.firstName} ${customer.lastName}`.toLowerCase().includes(query) ||
          customer.email.toLowerCase().includes(query) ||
          customer.company?.toLowerCase().includes(query) ||
          customer.phone?.toLowerCase().includes(query)
      );
    }

    // Sort
    result.sort((a, b) => {
      let aValue: string;
      let bValue: string;

      switch (sortField) {
        case 'name':
          aValue = `${a.firstName} ${a.lastName}`;
          bValue = `${b.firstName} ${b.lastName}`;
          break;
        case 'company':
          aValue = a.company || '';
          bValue = b.company || '';
          break;
        case 'email':
          aValue = a.email;
          bValue = b.email;
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
      }

      const comparison = aValue.localeCompare(bValue);
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [data?.customers, searchQuery, sortField, sortDirection]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400">
        {t('error', { ns: 'common' })}: {error.message}
      </div>
    );
  }

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <span className="ml-1 text-gray-400">↕</span>;
    }
    return <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {t('title', { ns: 'customers' })}
        </h1>
        <Link
          to="/customers/new"
          className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-medium hover:from-cyan-600 hover:to-purple-600 transition-all shadow-lg hover:shadow-xl hover:shadow-purple-500/20 dark:hover:shadow-purple-500/40"
        >
          {t('create', { ns: 'customers' })}
        </Link>
      </div>

      {/* Search Filter */}
      <div className="bg-white/80 dark:bg-slate-800/50 backdrop-blur-xl rounded-xl p-4 border border-gray-200/50 dark:border-white/10">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('filters.search', { ns: 'customers' })}
          className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-white/10 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400"
        />
      </div>

      <div className="bg-white/80 dark:bg-slate-800/50 backdrop-blur-xl rounded-xl border border-gray-200/50 dark:border-white/10 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50/50 dark:bg-slate-900/50 border-b border-gray-200/50 dark:border-white/10">
            <tr>
              <th 
                onClick={() => handleSort('name')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-slate-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100/50 dark:hover:bg-slate-800/50 transition-colors"
              >
                {t('fields.name', { ns: 'customers' })}
                <SortIcon field="name" />
              </th>
              <th 
                onClick={() => handleSort('company')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-slate-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100/50 dark:hover:bg-slate-800/50 transition-colors"
              >
                {t('fields.company', { ns: 'customers' })}
                <SortIcon field="company" />
              </th>
              <th 
                onClick={() => handleSort('email')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-slate-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100/50 dark:hover:bg-slate-800/50 transition-colors"
              >
                {t('fields.email', { ns: 'customers' })}
                <SortIcon field="email" />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-slate-300 uppercase tracking-wider">
                {t('fields.phone', { ns: 'customers' })}
              </th>
              <th 
                onClick={() => handleSort('status')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-slate-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100/50 dark:hover:bg-slate-800/50 transition-colors"
              >
                {t('fields.status', { ns: 'customers' })}
                <SortIcon field="status" />
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 dark:text-slate-300 uppercase tracking-wider">
                {t('actionsColumn', { ns: 'common' })}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200/50 dark:divide-white/10">
            {filteredAndSortedCustomers.map((customer) => (
              <tr key={customer.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-900/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {customer.firstName} {customer.lastName}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-600 dark:text-slate-300">
                    {customer.company || '-'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-600 dark:text-slate-300">
                    {customer.email}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-600 dark:text-slate-300">
                    {customer.phone || '-'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${
                      STATUS_COLORS[customer.status]
                    }`}
                  >
                    {t(`status.${customer.status.toLowerCase()}`, { ns: 'customers' })}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                  <Link
                    to={`/customers/${customer.id}`}
                    className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium transition-colors"
                  >
                    {t('view', { ns: 'common' })}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredAndSortedCustomers.length === 0 && (
          <div className="p-12 text-center text-gray-500 dark:text-slate-400">
            {searchQuery ? t('filters.all', { ns: 'customers' }) : t('empty.title', { ns: 'customers' })}
          </div>
        )}
      </div>
    </div>
  );
};
