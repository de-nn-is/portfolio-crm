// Shared validation utilities

interface TranslationOptions {
  ns?: string;
  [key: string]: string | number | boolean | undefined;
}

type TranslationFunction = (key: string, options?: TranslationOptions) => string;

export const validateEmail = (email: string, t: TranslationFunction): string => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return '';
  if (!emailRegex.test(email)) {
    return t('validation.invalidEmail', { ns: 'common' });
  }
  return '';
};

export const validatePhone = (phone: string, t: TranslationFunction): string => {
  if (!phone) return '';
  const phoneRegex = /^[\d\s+\-()]+$/;
  if (!phoneRegex.test(phone)) {
    return t('validation.invalidPhone', { ns: 'common' });
  }
  if (phone.replace(/\D/g, '').length < 6) {
    return t('validation.tooShort', { ns: 'common' });
  }
  return '';
};

export const validateCustomerStatus = (status: string, t: TranslationFunction): string => {
  const validStatuses = ['LEAD', 'ACTIVE', 'INACTIVE'];
  if (!validStatuses.includes(status)) {
    return t('errors.invalidStatus', { ns: 'customers' });
  }
  return '';
};

export const validateDealStatus = (status: string, t: TranslationFunction): string => {
  const validStatuses = ['LEAD', 'IN_PROGRESS', 'WON', 'LOST'];
  if (!validStatuses.includes(status)) {
    return t('errors.invalidStatus', { ns: 'deals' });
  }
  return '';
};

export const validateValue = (value: number, t: TranslationFunction): string => {
  if (value < 0) {
    return t('errors.invalidValue', { ns: 'deals' });
  }
  return '';
};

export const validateCustomerId = (customerId: string, t: TranslationFunction): string => {
  if (!customerId) {
    return t('errors.customerRequired', { ns: 'deals' });
  }
  return '';
};
