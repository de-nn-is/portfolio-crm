// Customer types

export enum CustomerStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  LEAD = 'LEAD',
}

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  status: CustomerStatus;
  address?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCustomerInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  status?: CustomerStatus;
  address?: string;
  notes?: string;
}

export interface UpdateCustomerInput {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  company?: string;
  status?: CustomerStatus;
  address?: string;
  notes?: string;
}
