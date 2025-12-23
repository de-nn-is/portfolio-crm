import { useQuery, useMutation } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { GET_CUSTOMER, DELETE_CUSTOMER, CREATE_CUSTOMER, UPDATE_CUSTOMER } from '../graphql/queries';
import { DeleteConfirmModal } from '../components/ui/DeleteConfirmModal.js';
import type { Customer } from '@crm/types';
import { CustomerStatus } from '../constants/enums';
import { validateEmail, validatePhone, validateCustomerStatus } from '../utils/validation';

export const CustomerDetail = () => {
  const { t } = useTranslation(['customers', 'common']);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNewCustomer = id === 'new';
  const isEditMode = window.location.pathname.includes('/edit');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    status: CustomerStatus.LEAD
  });

  const [errors, setErrors] = useState({
    email: '',
    phone: '',
    status: '',
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleEmailChange = (email: string) => {
    setFormData({ ...formData, email });
    setErrors({ ...errors, email: validateEmail(email, t) });
  };

  const handlePhoneChange = (phone: string) => {
    setFormData({ ...formData, phone });
    setErrors({ ...errors, phone: validatePhone(phone, t) });
  };

  const { data, loading, error } = useQuery(GET_CUSTOMER, {
    variables: { id },
    skip: !id || isNewCustomer,
    onCompleted: (result) => {
      if (result?.customer && isEditMode) {
        setFormData({
          firstName: result.customer.firstName,
          lastName: result.customer.lastName,
          email: result.customer.email,
          phone: result.customer.phone || '',
          company: result.customer.company || '',
          status: result.customer.status,
        });
      }
    },
  });

  const [createCustomer, { loading: creating }] = useMutation(CREATE_CUSTOMER, {
    onCompleted: () => navigate('/customers'),
  });

  const [updateCustomer, { loading: updating }] = useMutation(UPDATE_CUSTOMER, {
    onCompleted: () => navigate(`/customers/${id}`),
  });

  const [deleteCustomer] = useMutation(DELETE_CUSTOMER, {
    onCompleted: () => navigate('/customers'),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate before submit
    const emailError = validateEmail(formData.email, t);
    const phoneError = validatePhone(formData.phone, t);
    const statusError = validateCustomerStatus(formData.status, t);
    
    if (emailError || phoneError || statusError) {
      setErrors({ email: emailError, phone: phoneError, status: statusError });
      return;
    }
    
    if (isNewCustomer) {
      await createCustomer({ variables: { input: formData } });
    } else if (isEditMode) {
      await updateCustomer({ variables: { id, input: formData } });
    }
  };

  if (isNewCustomer || isEditMode) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {isNewCustomer ? t('create', { ns: 'customers' }) : t('edit', { ns: 'customers' })}
          </h1>
          <button
            onClick={() => navigate(isNewCustomer ? '/customers' : `/customers/${id}`)}
            className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-200 font-medium hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors"
          >
            {t('cancel', { ns: 'common' })}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/80 dark:bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-gray-200/50 dark:border-white/10 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                {t('fields.name', { ns: 'customers' })} *
              </label>
              <input
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-white/10 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Vorname"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                Nachname *
              </label>
              <input
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-white/10 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Nachname"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                {t('fields.company', { ns: 'customers' })}
              </label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-white/10 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Firma GmbH"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                {t('fields.email', { ns: 'customers' })} *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => handleEmailChange(e.target.value)}
                className={`w-full px-4 py-2 bg-gray-50 dark:bg-slate-900/50 border rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 ${
                  errors.email
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-200 dark:border-white/10 focus:ring-purple-500'
                }`}
                placeholder="email@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                {t('fields.phone', { ns: 'customers' })}
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                className={`w-full px-4 py-2 bg-gray-50 dark:bg-slate-900/50 border rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 ${
                  errors.phone
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-200 dark:border-white/10 focus:ring-purple-500'
                }`}
                placeholder="+49..."
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                {t('fields.status', { ns: 'customers' })}
              </label>
              <select
                value={formData.status}
                onChange={(e) => {
                  const newStatus = e.target.value as CustomerStatus;
                  setFormData({ ...formData, status: newStatus });
                  setErrors({ ...errors, status: validateCustomerStatus(newStatus, t) });
                }}
                className={`w-full px-4 py-2 bg-gray-50 dark:bg-slate-900/50 border rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 ${
                  errors.status
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-200 dark:border-white/10 focus:ring-purple-500'
                }`}
              >
                <option value={CustomerStatus.LEAD}>{t('status.lead', { ns: 'customers' })}</option>
                <option value={CustomerStatus.ACTIVE}>{t('status.active', { ns: 'customers' })}</option>
                <option value={CustomerStatus.INACTIVE}>{t('status.inactive', { ns: 'customers' })}</option>
              </select>
              {errors.status && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.status}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate(isNewCustomer ? '/customers' : `/customers/${id}`)}
              className="px-6 py-2.5 rounded-lg bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-200 font-medium hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors"
            >
              {t('cancel', { ns: 'common' })}
            </button>
            <button
              type="submit"
              disabled={creating || updating || !!errors.email || !!errors.phone || !!errors.status}
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

  if (error || !data?.customer) {
    return (
      <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400">
        {t('error', { ns: 'common' })}: {error?.message || t('messages.notFound', { ns: 'customers' })}
      </div>
    );
  }

  const customer: Customer = data.customer;

  const handleDelete = async () => {
    await deleteCustomer({ variables: { id } });
    setShowDeleteModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {customer.firstName} {customer.lastName}
        </h1>
        <div className="flex gap-3">
          <button
            onClick={() => navigate(`/customers/${id}/edit`)}
            className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-medium hover:from-cyan-600 hover:to-purple-600 transition-all shadow-lg hover:shadow-xl"
          >
            {t('edit', { ns: 'customers' })}
          </button>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 text-white font-medium hover:from-red-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl"
          >
            {t('delete', { ns: 'customers' })}
          </button>
        </div>
      </div>

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        companyName={customer.company || ''}
        customerName={`${customer.firstName} ${customer.lastName}`}
      />

      <div className="bg-white/80 dark:bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-gray-200/50 dark:border-white/10">
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <dt className="text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
              {t('fields.email', { ns: 'customers' })}
            </dt>
            <dd className="text-base text-gray-900 dark:text-white">{customer.email}</dd>
          </div>

          {customer.phone && (
            <div>
              <dt className="text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                {t('fields.phone', { ns: 'customers' })}
              </dt>
              <dd className="text-base text-gray-900 dark:text-white">{customer.phone}</dd>
            </div>
          )}

          {customer.company && (
            <div>
              <dt className="text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                {t('fields.company', { ns: 'customers' })}
              </dt>
              <dd className="text-base text-gray-900 dark:text-white">{customer.company}</dd>
            </div>
          )}

          <div>
            <dt className="text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
              {t('fields.status', { ns: 'customers' })}
            </dt>
            <dd className="text-base text-gray-900 dark:text-white">
              {t(`status.${customer.status.toLowerCase()}`, { ns: 'customers' })}
            </dd>
          </div>

          {customer.address && (
            <div className="md:col-span-2">
              <dt className="text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                Adresse
              </dt>
              <dd className="text-base text-gray-900 dark:text-white">{customer.address}</dd>
            </div>
          )}

          {customer.notes && (
            <div className="md:col-span-2">
              <dt className="text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                Notizen
              </dt>
              <dd className="text-base text-gray-900 dark:text-white whitespace-pre-wrap">
                {customer.notes}
              </dd>
            </div>
          )}
        </dl>
      </div>
    </div>
  );
};
