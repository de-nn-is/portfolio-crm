// Deal/Project types
import type { Customer } from './customer.types';

export enum DealStatus {
  LEAD = 'LEAD',
  IN_PROGRESS = 'IN_PROGRESS',
  WON = 'WON',
  LOST = 'LOST',
}

export interface Deal {
  id: string;
  title: string;
  description: string;
  value: number;
  currency: string;
  status: DealStatus;
  customerId: string;
  customer?: Customer;
  startDate: Date;
  endDate?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateDealInput {
  title: string;
  description: string;
  value: number;
  currency?: string;
  status?: DealStatus;
  customerId: string;
  startDate: Date;
  endDate?: Date;
  notes?: string;
}

export interface UpdateDealInput {
  title?: string;
  description?: string;
  value?: number;
  currency?: string;
  status?: DealStatus;
  startDate?: Date;
  endDate?: Date;
  notes?: string;
}
