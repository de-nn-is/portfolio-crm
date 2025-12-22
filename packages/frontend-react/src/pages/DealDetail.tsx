import { useQuery, useMutation } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { GET_DEAL, DELETE_DEAL, CREATE_DEAL, UPDATE_DEAL } from '../graphql/queries';
import { DeleteConfirmModal } from '../components/ui/DeleteConfirmModal.js';
import { formatCurrency } from '@crm/shared-utils';
import type { Deal } from '@crm/types';

export const DealDetail = () => {
  const { t, i18n } = useTranslation(['deals', 'common']);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNewDeal = id === 'new';
  const isEditMode = window.location.pathname.includes('/edit');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    value: 0,
    currency: 'EUR' as const,
    status: 'LEAD' as const,
    startDate: new Date().toISOString().split('T')[0],
    customerId: '',
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { data, loading, error } = useQuery(GET_DEAL, {
    variables: { id },
    skip: !id || isNewDeal,
    onCompleted: (result) => {
      if (result?.deal) {
        setFormData({
          title: result.deal.title,
          description: result.deal.description || '',
          value: result.deal.value,
          currency: result.deal.currency,
          status: result.deal.status,
          startDate: result.deal.startDate.split('T')[0],
          customerId: result.deal.customerId || '',
        });
      }
    },
  });

  const [createDeal, { loading: creating }] = useMutation(CREATE_DEAL, {
    onCompleted: () => navigate('/deals'),
  });

  const [updateDeal, { loading: updating }] = useMutation(UPDATE_DEAL, {
    onCompleted: () => navigate(`/deals/${id}`),
  });

  const [deleteDeal] = useMutation(DELETE_DEAL, {
    onCompleted: () => navigate('/deals'),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isNewDeal) {
      await createDeal({ variables: { input: formData } });
    } else if (isEditMode) {
      await updateDeal({ variables: { id, input: formData } });
    }
  };

  const handleDelete = async () => {
    await deleteDeal({ variables: { id } });
    setShowDeleteModal(false);
  };

  const currency = i18n.language === 'en' ? 'USD' : 'EUR';
  const EUR_TO_USD = 1.10;

  if (isNewDeal || isEditMode) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {isNewDeal ? t('create', { ns: 'deals' }) : t('edit', { ns: 'deals' })}
          </h1>
          <button
            onClick={() => navigate(isNewDeal ? '/deals' : `/deals/${id}`)}
            className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-200 font-medium hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors"
          >
            {t('cancel', { ns: 'common' })}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/80 dark:bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-gray-200/50 dark:border-white/10 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                {t('fields.title', { ns: 'deals' })} *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-white/10 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Auftragstitel"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                {t('fields.value', { ns: 'deals' })} *
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-white/10 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                {t('fields.status', { ns: 'deals' })}
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-white/10 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="LEAD">{t('status.lead', { ns: 'deals' })}</option>
                <option value="IN_PROGRESS">{t('status.inProgress', { ns: 'deals' })}</option>
                <option value="WON">{t('status.won', { ns: 'deals' })}</option>
                <option value="LOST">{t('status.lost', { ns: 'deals' })}</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                {t('fields.description', { ns: 'deals' })}
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-white/10 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Beschreibung des Auftrags..."
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate(isNewDeal ? '/deals' : `/deals/${id}`)}
              className="px-6 py-2.5 rounded-lg bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-200 font-medium hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors"
            >
              {t('cancel', { ns: 'common' })}
            </button>
            <button
              type="submit"
              disabled={creating || updating}
              className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-medium hover:from-cyan-600 hover:to-purple-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {creating || updating ? '...' : t('save', { ns: 'common' })}
            </button>
          </div>
        </form>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (error || !data?.deal) {
    return (
      <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400">
        {t('error', { ns: 'common' })}: {error?.message || t('messages.notFound', { ns: 'deals' })}
      </div>
    );
  }

  const deal: Deal = data.deal;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{deal.title}</h1>
        <div className="flex gap-3">
          <button
            onClick={() => navigate(`/deals/${id}/edit`)}
            className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-medium hover:from-cyan-600 hover:to-purple-600 transition-all shadow-lg hover:shadow-xl"
          >
            {t('edit', { ns: 'deals' })}
          </button>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 text-white font-medium hover:from-red-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl"
          >
            {t('delete', { ns: 'deals' })}
          </button>
        </div>
      </div>

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        customerName={deal.title}
        itemType="deal"
      />

      <div className="bg-white/80 dark:bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-gray-200/50 dark:border-white/10">
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <dt className="text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
              {t('fields.value', { ns: 'deals' })}
            </dt>
            <dd className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
              {formatCurrency(
                currency === 'USD' 
                  ? deal.value * EUR_TO_USD 
                  : deal.value, 
                currency
              )}
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
              {t('fields.status', { ns: 'deals' })}
            </dt>
            <dd className="text-base text-gray-900 dark:text-white">
              {t(`status.${deal.status === 'IN_PROGRESS' ? 'inProgress' : deal.status.toLowerCase()}`, { ns: 'deals' })}
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
              Startdatum
            </dt>
            <dd className="text-base text-gray-900 dark:text-white">
              {new Date(deal.startDate).toLocaleDateString(i18n.language === 'en' ? 'en-US' : 'de-DE')}
            </dd>
          </div>

          {deal.endDate && (
            <div>
              <dt className="text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                Enddatum
              </dt>
              <dd className="text-base text-gray-900 dark:text-white">
                {new Date(deal.endDate).toLocaleDateString(i18n.language === 'en' ? 'en-US' : 'de-DE')}
              </dd>
            </div>
          )}

          {deal.description && (
            <div className="md:col-span-2">
              <dt className="text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                {t('fields.description', { ns: 'deals' })}
              </dt>
              <dd className="text-base text-gray-900 dark:text-white">{deal.description}</dd>
            </div>
          )}

          {deal.notes && (
            <div className="md:col-span-2">
              <dt className="text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                Notizen
              </dt>
              <dd className="text-base text-gray-900 dark:text-white whitespace-pre-wrap">
                {deal.notes}
              </dd>
            </div>
          )}
        </dl>
      </div>
    </div>
  );
};
