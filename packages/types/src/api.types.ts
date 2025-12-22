// API and general types

export interface PaginationInput {
  limit?: number;
  offset?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
}

export interface DashboardStats {
  totalCustomers: number;
  activeCustomers: number;
  totalDeals: number;
  wonDeals: number;
  totalRevenue: number;
}

export interface Activity {
  id: string;
  type: 'customer_created' | 'deal_created' | 'deal_updated' | 'customer_updated';
  description: string;
  timestamp: Date;
}

export interface ApiError {
  message: string;
  code: string;
  field?: string;
}
