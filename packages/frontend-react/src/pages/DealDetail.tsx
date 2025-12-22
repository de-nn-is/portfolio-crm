import { useQuery, useMutation } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { GET_DEAL, DELETE_DEAL } from '../graphql/queries';
import { formatCurrency } from '@crm/shared-utils';
import type { Deal } from '@crm/types';

export const DealDetail = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, loading, error } = useQuery(GET_DEAL, {
    variables: { id },
    skip: !id,
  });

  const [deleteDeal] = useMutation(DELETE_DEAL, {
    onCompleted: () => navigate('/deals'),
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (error || !data?.deal) {
    return (
      <div className="p-4 rounded-lg bg-error/10 border border-error text-error">
        {t('common.error')}: {error?.message || t('deals.notFound')}
      </div>
    );
  }

  const deal: Deal = data.deal;

  const handleDelete = async () => {
    if (window.confirm(t('deals.confirmDelete'))) {
      await deleteDeal({ variables: { id } });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-text-primary">{deal.title}</h1>
        <div className="flex gap-3">
          <button
            onClick={() => navigate(`/deals/${id}/edit`)}
            className="px-4 py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary-dark transition-colors"
          >
            {t('common.edit')}
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 rounded-lg bg-error text-white font-medium hover:bg-error-dark transition-colors"
          >
            {t('common.delete')}
          </button>
        </div>
      </div>

      <div className="bg-surface-secondary rounded-lg p-6 border border-border">
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <dt className="text-sm font-medium text-text-secondary mb-1">
              {t('deals.value')}
            </dt>
            <dd className="text-2xl font-bold text-primary">
              {formatCurrency(deal.value, deal.currency)}
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-text-secondary mb-1">
              {t('deals.status')}
            </dt>
            <dd className="text-base text-text-primary">
              {t(`deals.status${deal.status}`)}
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-text-secondary mb-1">
              {t('deals.startDate')}
            </dt>
            <dd className="text-base text-text-primary">
              {new Date(deal.startDate).toLocaleDateString('de-DE')}
            </dd>
          </div>

          {deal.endDate && (
            <div>
              <dt className="text-sm font-medium text-text-secondary mb-1">
                {t('deals.endDate')}
              </dt>
              <dd className="text-base text-text-primary">
                {new Date(deal.endDate).toLocaleDateString('de-DE')}
              </dd>
            </div>
          )}

          {deal.description && (
            <div className="md:col-span-2">
              <dt className="text-sm font-medium text-text-secondary mb-1">
                {t('deals.description')}
              </dt>
              <dd className="text-base text-text-primary">{deal.description}</dd>
            </div>
          )}

          {deal.notes && (
            <div className="md:col-span-2">
              <dt className="text-sm font-medium text-text-secondary mb-1">
                {t('deals.notes')}
              </dt>
              <dd className="text-base text-text-primary whitespace-pre-wrap">
                {deal.notes}
              </dd>
            </div>
          )}
        </dl>
      </div>
    </div>
  );
};
