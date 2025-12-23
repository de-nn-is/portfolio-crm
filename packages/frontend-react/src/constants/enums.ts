// Re-export enums from types package as constants to avoid Vite import issues

export enum CustomerStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  LEAD = 'LEAD',
}

export enum DealStatus {
  LEAD = 'LEAD',
  IN_PROGRESS = 'IN_PROGRESS',
  WON = 'WON',
  LOST = 'LOST',
}
