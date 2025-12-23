import { useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { GET_DEALS } from '../graphql/queries';
import { formatCurrency } from '@crm/shared-utils';
import type { Deal } from '@crm/types';
import { StatusBadge } from '../components/ui/StatusBadge';
import { SortIcon } from '../components/ui/SortIcon';

type SortField = 'title' | 'value' | 'status' | 'customer' | 'createdAt';
type SortDirection = 'asc' | 'desc';

export const Deals = () => {
  const { t, i18n } = useTranslation(['deals', 'common']);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  
  const { data, loading, error } = useQuery(GET_DEALS, {
    variables: { pagination: { limit: 50, offset: 0 } },
  });

  const formatDateForFilter = (dateString: string): Date | null => {
    if (!dateString) return null;
    const isEnglish = i18n.language === 'en';
    
    if (isEnglish) {
      // MM/DD/YYYY
      const match = dateString.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
      if (match) {
        const [, month, day, year] = match;
        return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      }
    } else {
      // DD.MM.YYYY
      const match = dateString.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
      if (match) {
        const [, day, month, year] = match;
        return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      }
    }
    return null;
  };

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

    // Text Filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (deal) =>
          deal.title.toLowerCase().includes(query) ||
          deal.description?.toLowerCase().includes(query)
      );
    }

    // Datumsfilter
    if (dateFrom) {
      const fromDate = formatDateForFilter(dateFrom);
      if (fromDate) {
        result = result.filter((deal) => new Date(deal.startDate) >= fromDate);
      }
    }
    if (dateTo) {
      const toDate = formatDateForFilter(dateTo);
      if (toDate) {
        toDate.setHours(23, 59, 59, 999); // Ende des Tages
        result = result.filter((deal) => new Date(deal.startDate) <= toDate);
      }
    }

    // Sort
    result.sort((a, b) => {
      let aValue: string | number
      let bValue: string | number;

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
        case 'customer':
          aValue = a.customer?.company || `${a.customer?.firstName || ''} ${a.customer?.lastName || ''}`.trim() || '';
          bValue = b.customer?.company || `${b.customer?.firstName || ''} ${b.customer?.lastName || ''}`.trim() || '';
          break;
        case 'createdAt':
          aValue = new Date(a.startDate).getTime();
          bValue = new Date(b.startDate).getTime();
          break;
      }

      if (typeof aValue === 'number' && typeof bValue === 'number' && (sortField === 'value' || sortField === 'createdAt')){
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      const comparison = String(aValue).localeCompare(String(bValue));
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [data?.deals, searchQuery, dateFrom, dateTo, sortField, sortDirection]);

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

      {/* Filter */}
      <div className="bg-white/80 dark:bg-slate-800/50 backdrop-blur-xl rounded-xl p-4 border border-gray-200/50 dark:border-white/10 space-y-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('filters.search', { ns: 'deals' })}
          className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-white/10 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400"
        />
        
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px] max-w-[250px]">
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
              {t('filters.dateFrom', { ns: 'deals' })}
            </label>
            <input
              type="text"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              placeholder={i18n.language === 'en' ? 'MM/DD/YYYY' : 'TT.MM.JJJJ'}
              pattern={i18n.language === 'en' ? '\\d{2}/\\d{2}/\\d{4}' : '\\d{2}\\.\\d{2}\\.\\d{4}'}
              className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-white/10 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400"
            />
          </div>
          <div className="flex-1 min-w-[200px] max-w-[250px]">
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
              {t('filters.dateTo', { ns: 'deals' })}
            </label>
            <input
              type="text"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              placeholder={i18n.language === 'en' ? 'MM/DD/YYYY' : 'TT.MM.JJJJ'}
              pattern={i18n.language === 'en' ? '\\d{2}/\\d{2}/\\d{4}' : '\\d{2}\\.\\d{2}\\.\\d{4}'}
              className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-white/10 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400"
            />
          </div>
          <button
            onClick={() => {
              setSearchQuery('');
              setDateFrom('');
              setDateTo('');
            }}
            className="px-6 py-2 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-200 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors whitespace-nowrap"
          >
            {t('filters.resetFilters', { ns: 'deals' })}
          </button>
        </div>
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
                <SortIcon field="title" currentField={sortField} direction={sortDirection} />
              </th>
              <th 
                onClick={() => handleSort('value')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-slate-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100/50 dark:hover:bg-slate-800/50 transition-colors"
              >
                {t('fields.value', { ns: 'deals' })}
                <SortIcon field="value" currentField={sortField} direction={sortDirection} />
              </th>
              <th 
                onClick={() => handleSort('customer')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-slate-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100/50 dark:hover:bg-slate-800/50 transition-colors"
              >
                {t('filters.customer', { ns: 'deals' })}
                <SortIcon field="customer" currentField={sortField} direction={sortDirection} />
              </th>
              <th 
                onClick={() => handleSort('status')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-slate-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100/50 dark:hover:bg-slate-800/50 transition-colors"
              >
                {t('fields.status', { ns: 'deals' })}
                <SortIcon field="status" currentField={sortField} direction={sortDirection} />
              </th>
              <th 
                onClick={() => handleSort('createdAt')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-slate-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100/50 dark:hover:bg-slate-800/50 transition-colors"
              >
                {t('filters.createdDate', { ns: 'deals' })}
                <SortIcon field="createdAt" currentField={sortField} direction={sortDirection} />
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
                  <div className="text-sm text-gray-900 dark:text-white">
                    {deal.customer?.company || `${deal.customer?.firstName || ''} ${deal.customer?.lastName || ''}`.trim() || '-'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge 
                    status={deal.status}
                    label={t(`status.${deal.status === 'IN_PROGRESS' ? 'inProgress' : deal.status.toLowerCase()}`, { ns: 'deals' })}
                    type="deal"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-slate-300">
                  {new Date(deal.startDate).toLocaleDateString(
                    i18n.language === 'en' ? 'en-US' : 'de-DE',
                    { year: 'numeric', month: '2-digit', day: '2-digit' }
                  )}
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
