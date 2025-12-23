// Status color constants for Customer and Deal status badges
export const CUSTOMER_STATUS_COLORS = {
  LEAD: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  ACTIVE: 'bg-green-500/10 text-green-500 border-green-500/20',
  INACTIVE: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
} as const;

export const DEAL_STATUS_COLORS = {
  LEAD: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  IN_PROGRESS: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  WON: 'bg-green-500/10 text-green-500 border-green-500/20',
  LOST: 'bg-red-500/10 text-red-500 border-red-500/20',
} as const;
