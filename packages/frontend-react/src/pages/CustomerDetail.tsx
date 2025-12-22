import { useQuery, useMutation } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { GET_CUSTOMER, DELETE_CUSTOMER } from '../graphql/queries';
import type { Customer } from '@crm/types';

export const CustomerDetail = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, loading, error } = useQuery(GET_CUSTOMER, {
    variables: { id },
    skip: !id,
  });

  const [deleteCustomer] = useMutation(DELETE_CUSTOMER, {
    onCompleted: () => navigate('/customers'),
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (error || !data?.customer) {
    return (
      <div className="p-4 rounded-lg bg-error/10 border border-error text-error">
        {t('common.error')}: {error?.message || t('customers.notFound')}
      </div>
    );
  }

  const customer: Customer = data.customer;

  const handleDelete = async () => {
    if (window.confirm(t('customers.confirmDelete'))) {
      await deleteCustomer({ variables: { id } });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-text-primary">
          {customer.firstName} {customer.lastName}
        </h1>
        <div className="flex gap-3">
          <button
            onClick={() => navigate(`/customers/${id}/edit`)}
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
              {t('customers.email')}
            </dt>
            <dd className="text-base text-text-primary">{customer.email}</dd>
          </div>

          {customer.phone && (
            <div>
              <dt className="text-sm font-medium text-text-secondary mb-1">
                {t('customers.phone')}
              </dt>
              <dd className="text-base text-text-primary">{customer.phone}</dd>
            </div>
          )}

          {customer.company && (
            <div>
              <dt className="text-sm font-medium text-text-secondary mb-1">
                {t('customers.company')}
              </dt>
              <dd className="text-base text-text-primary">{customer.company}</dd>
            </div>
          )}

          <div>
            <dt className="text-sm font-medium text-text-secondary mb-1">
              {t('customers.status')}
            </dt>
            <dd className="text-base text-text-primary">
              {t(`customers.status${customer.status}`)}
            </dd>
          </div>

          {customer.address && (
            <div className="md:col-span-2">
              <dt className="text-sm font-medium text-text-secondary mb-1">
                {t('customers.address')}
              </dt>
              <dd className="text-base text-text-primary">{customer.address}</dd>
            </div>
          )}

          {customer.notes && (
            <div className="md:col-span-2">
              <dt className="text-sm font-medium text-text-secondary mb-1">
                {t('customers.notes')}
              </dt>
              <dd className="text-base text-text-primary whitespace-pre-wrap">
                {customer.notes}
              </dd>
            </div>
          )}
        </dl>
      </div>
    </div>
  );
};
