import type {
  User,
  Customer,
  Deal,
  CreateCustomerInput,
  UpdateCustomerInput,
  CreateDealInput,
  UpdateDealInput,
  LoginInput,
  AuthPayload,
  PaginationInput,
  DashboardStats,
} from '@crm/types';

/**
 * Database abstraction layer
 * Provides a unified interface for both PostgreSQL and JSON file storage
 */
export interface IDatabase {
  // Auth operations
  login(input: LoginInput): Promise<AuthPayload>;
  getUser(id: string): Promise<User | null>;

  // Customer operations
  getCustomers(pagination?: PaginationInput): Promise<Customer[]>;
  getCustomer(id: string): Promise<Customer | null>;
  createCustomer(input: CreateCustomerInput): Promise<Customer>;
  updateCustomer(id: string, input: UpdateCustomerInput): Promise<Customer>;
  deleteCustomer(id: string): Promise<boolean>;

  // Deal operations
  getDeals(pagination?: PaginationInput): Promise<Deal[]>;
  getDeal(id: string): Promise<Deal | null>;
  getDealsByCustomer(customerId: string): Promise<Deal[]>;
  createDeal(input: CreateDealInput): Promise<Deal>;
  updateDeal(id: string, input: UpdateDealInput): Promise<Deal>;
  deleteDeal(id: string): Promise<boolean>;

  // Dashboard stats
  getDashboardStats(): Promise<DashboardStats>;

  // Utility methods
  connect(): Promise<void>;
  disconnect(): Promise<void>;
}
