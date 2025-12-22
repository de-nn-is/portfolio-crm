import { useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { GET_DEALS } from '../graphql/queries';
import { formatCurrency } from '@crm/shared-utils';
import type { Deal } from '@crm/types';

const STATUS_COLORS = {
  LEAD: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  IN_PROGRESS: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  WON: 'bg-green-500/10 text-green-500 border-green-500/20',
  LOST: 'bg-red-500/10 text-red-500 border-red-500/20',
};

type SortField = 'title' | 'value' | 'status';
type SortDirection = 'asc' | 'desc';

export const Deals = () => {
  const { t, i18n } = useTranslation(['deals', 'common']);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('title');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  
  const { data, loading, error } = useQuery(GET_DEALS, {
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

  const filteredAndSortedDeals = useMemo(() => {
    let result: Deal[] = [...(data?.deals || [])];

    // Filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (deal) =>
          deal.title.toLowerCase().includes(query) ||
          deal.description?.toLowerCase().includes(query)
      );
    }

    // Sort
    result.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case 'title':
          aValue = a.title;
          bValue = b.title;
          break;
        case 'value':
          aValue = a.value;
          bValue = b.value;
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
      }

      if (sortField === 'value') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      const comparison = String(aValue).localeCompare(String(bValue));
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [data?.deals, searchQuery, sortField, sortDirection]);

  const currency = i18n.language === 'en' ? 'USD' : 'EUR';
  const EUR_TO_USD = 1.10;

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
          {t('title', { ns: 'deals' })}
        </h1>
        <Link
          to="/deals/new"
          className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-medium hover:from-cyan-600 hover:to-purple-600 transition-all shadow-lg hover:shadow-xl hover:shadow-purple-500/20 dark:hover:shadow-purple-500/40"
        >
          {t('create', { ns: 'deals' })}
        </Link>
      </div>

      {/* Search Filter */}
      <div className="bg-white/80 dark:bg-slate-800/50 backdrop-blur-xl rounded-xl p-4 border border-gray-200/50 dark:border-white/10">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('filters.search', { ns: 'deals' })}
          className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-white/10 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400"
        />
      </div>

      <div className="bg-white/80 dark:bg-slate-800/50 backdrop-blur-xl rounded-xl border border-gray-200/50 dark:border-white/10 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50/50 dark:bg-slate-900/50 border-b border-gray-200/50 dark:border-white/10">
            <tr>
              <th 
                onClick={() => handleSort('title')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-slate-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100/50 dark:hover:bg-slate-800/50 transition-colors"
              >
                {t('fields.title', { ns: 'deals' })}
                <SortIcon field="title" />
              </th>
              <th 
                onClick={() => handleSort('value')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-slate-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100/50 dark:hover:bg-slate-800/50 transition-colors"
              >
                {t('fields.value', { ns: 'deals' })}
                <SortIcon field="value" />
              </th>
              <th 
                onClick={() => handleSort('status')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-slate-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100/50 dark:hover:bg-slate-800/50 transition-colors"
              >
                {t('fields.status', { ns: 'deals' })}
                <SortIcon field="status" />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-slate-300 uppercase tracking-wider">
                Erstellt
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 dark:text-slate-300 uppercase tracking-wider">
                {t('actionsColumn', { ns: 'common' })}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200/50 dark:divide-white/10">
            {filteredAndSortedDeals.map((deal) => (
              <tr key={deal.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-900/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {deal.title}
                  </div>
                  {deal.description && (
                    <div className="text-sm text-gray-600 dark:text-slate-300 line-clamp-1">
                      {deal.description}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatCurrency(
                      currency === 'USD' 
                        ? deal.value * EUR_TO_USD 
                        : deal.value, 
                      currency
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${
                      STATUS_COLORS[deal.status]
                    }`}
                  >
                    {t(`status.${deal.status === 'IN_PROGRESS' ? 'inProgress' : deal.status.toLowerCase()}`, { ns: 'deals' })}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-slate-300">
                  {new Date(deal.startDate).toLocaleDateString(i18n.language === 'en' ? 'en-US' : 'de-DE')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                  <Link
                    to={`/deals/${deal.id}`}
                    className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium transition-colors"
                  >
                    {t('view', { ns: 'common' })}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredAndSortedDeals.length === 0 && (
          <div className="p-12 text-center text-gray-500 dark:text-slate-400">
            {searchQuery ? t('filters.all', { ns: 'deals' }) : t('empty.title', { ns: 'deals' })}
          </div>
        )}
      </div>
    </div>
  );
};
