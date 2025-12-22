import { promises as fs } from 'fs';
import path from 'path';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
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
  CustomerStatus,
  DealStatus,
} from '@crm/types';
import type { IDatabase } from './database.interface';
import { config } from '../utils/config';

// Internal type with password for database storage
interface UserWithPassword extends User {
  password: string;
}

interface JsonData {
  users: UserWithPassword[];
  customers: Customer[];
  deals: Deal[];
}

export class JsonService implements IDatabase {
  private dataPath: string;
  private data: JsonData = { users: [], customers: [], deals: [] };

  constructor() {
    this.dataPath = path.join(__dirname, '../data/json/db.json');
  }

  async connect(): Promise<void> {
    try {
      const fileContent = await fs.readFile(this.dataPath, 'utf-8');
      this.data = JSON.parse(fileContent);
    } catch (error) {
      // If file doesn't exist, initialize with empty data
      await this.saveData();
    }
  }

  async disconnect(): Promise<void> {
    await this.saveData();
  }

  private async saveData(): Promise<void> {
    const dir = path.dirname(this.dataPath);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(this.dataPath, JSON.stringify(this.data, null, 2));
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
  }

  // Auth operations
  async login(input: LoginInput): Promise<AuthPayload> {
    const user = this.data.users.find((u) => u.username === input.username);

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const valid = await bcrypt.compare(input.password, user.password);
    if (!valid) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username },
      config.jwtSecret,
      { expiresIn: config.jwtExpiration } as jwt.SignOptions
    );

    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  }

  async getUser(id: string): Promise<User | null> {
    return this.data.users.find((u) => u.id === id) || null;
  }

  // Customer operations
  async getCustomers(pagination?: PaginationInput): Promise<Customer[]> {
    const { limit = 20, offset = 0 } = pagination || {};
    
    return this.data.customers.slice(offset, offset + limit);
  }

  async getCustomer(id: string): Promise<Customer | null> {
    const customer = this.data.customers.find((c) => c.id === id);
    return customer || null;
  }

  async createCustomer(input: CreateCustomerInput): Promise<Customer> {
    const now = new Date();
    const customer: Customer = {
      id: this.generateId(),
      ...input,
      status: input.status as CustomerStatus || 'LEAD' as CustomerStatus,
      createdAt: now,
      updatedAt: now,
    };

    this.data.customers.push(customer);
    await this.saveData();

    return customer;
  }

  async updateCustomer(id: string, input: UpdateCustomerInput): Promise<Customer> {
    const index = this.data.customers.findIndex((c) => c.id === id);
    if (index === -1) {
      throw new Error('Customer not found');
    }

    this.data.customers[index] = {
      ...this.data.customers[index],
      ...input,
      updatedAt: new Date(),
    };

    await this.saveData();

    return this.data.customers[index];
  }

  async deleteCustomer(id: string): Promise<boolean> {
    const index = this.data.customers.findIndex((c) => c.id === id);
    if (index === -1) return false;

    this.data.customers.splice(index, 1);
    // Also delete associated deals
    this.data.deals = this.data.deals.filter((d) => d.customerId !== id);
    await this.saveData();

    return true;
  }

  // Deal operations
  async getDeals(pagination?: PaginationInput): Promise<Deal[]> {
    const { limit = 20, offset = 0 } = pagination || {};

    return this.data.deals.slice(offset, offset + limit);
  }

  async getDeal(id: string): Promise<Deal | null> {
    const deal = this.data.deals.find((d) => d.id === id);
    return deal || null;
  }

  async getDealsByCustomer(customerId: string): Promise<Deal[]> {
    return this.data.deals.filter((d) => d.customerId === customerId);
  }

  async createDeal(input: CreateDealInput): Promise<Deal> {
    const customer = this.data.customers.find((c) => c.id === input.customerId);
    if (!customer) {
      throw new Error('Customer not found');
    }

    const now = new Date();
    const deal: Deal = {
      id: this.generateId(),
      ...input,
      currency: input.currency || 'EUR',
      status: input.status as DealStatus || 'LEAD' as DealStatus,
      createdAt: now,
      updatedAt: now,
    };

    this.data.deals.push(deal);
    await this.saveData();

    return deal;
  }

  async updateDeal(id: string, input: UpdateDealInput): Promise<Deal> {
    const index = this.data.deals.findIndex((d) => d.id === id);
    if (index === -1) {
      throw new Error('Deal not found');
    }

    this.data.deals[index] = {
      ...this.data.deals[index],
      ...input,
      updatedAt: new Date(),
    };

    await this.saveData();

    return this.data.deals[index];
  }

  async deleteDeal(id: string): Promise<boolean> {
    const index = this.data.deals.findIndex((d) => d.id === id);
    if (index === -1) return false;

    this.data.deals.splice(index, 1);
    await this.saveData();

    return true;
  }

  // Dashboard stats
  async getDashboardStats(): Promise<DashboardStats> {
    const totalCustomers = this.data.customers.length;
    const activeCustomers = this.data.customers.filter(
      (c) => c.status === 'ACTIVE'
    ).length;
    const totalDeals = this.data.deals.length;
    const wonDeals = this.data.deals.filter((d) => d.status === 'WON').length;
    const totalRevenue = this.data.deals
      .filter((d) => d.status === 'WON')
      .reduce((sum, d) => sum + d.value, 0);

    return {
      totalCustomers,
      activeCustomers,
      totalDeals,
      wonDeals,
      totalRevenue,
    };
  }
}
