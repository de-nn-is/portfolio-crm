import { CustomerStatus, DealStatus } from '@crm/types';
import { CUSTOMER_STATUS_COLORS, DEAL_STATUS_COLORS } from '../../constants/statusColors';

interface StatusBadgeProps {
  status: CustomerStatus | DealStatus;
  label: string;
  type: 'customer' | 'deal';
}

export const StatusBadge = ({ status, label, type }: StatusBadgeProps) => {
  const colors = type === 'customer' 
    ? CUSTOMER_STATUS_COLORS[status as CustomerStatus]
    : DEAL_STATUS_COLORS[status as DealStatus];

  return (
    <span
      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${colors}`}
    >
      {label}
    </span>
  );
};
