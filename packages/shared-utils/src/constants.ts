// Shared constants

export const DEFAULT_CURRENCY = 'EUR';

export const DEFAULT_PAGE_SIZE = 20;

export const CUSTOMER_STATUS_LABELS = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
  LEAD: 'Lead',
} as const;

export const DEAL_STATUS_LABELS = {
  LEAD: 'Lead',
  IN_PROGRESS: 'In Progress',
  WON: 'Won',
  LOST: 'Lost',
} as const;

export const CUSTOMER_STATUS_COLORS = {
  ACTIVE: 'green',
  INACTIVE: 'gray',
  LEAD: 'blue',
} as const;

export const DEAL_STATUS_COLORS = {
  LEAD: 'blue',
  IN_PROGRESS: 'yellow',
  WON: 'green',
  LOST: 'red',
} as const;
