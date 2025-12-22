import { PrismaClient } from '@prisma/client';
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
} from '@crm/types';
import type { IDatabase } from './database.interface';
import { config } from '../utils/config';

export class PostgresService implements IDatabase {
  private prisma: PrismaClient;

  constructor() {
    // In Prisma 7, the database URL is configured via prisma.config.ts
    // and no longer passed to the constructor
    this.prisma = new PrismaClient();
  }

  async connect(): Promise<void> {
    await this.prisma.$connect();
  }

  async disconnect(): Promise<void> {
    await this.prisma.$disconnect();
  }

  // Auth operations
  async login(input: LoginInput): Promise<AuthPayload> {
    const user = await this.prisma.user.findUnique({
      where: { username: input.username },
    });

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
    return await this.prisma.user.findUnique({ where: { id } });
  }

  // Customer operations
  async getCustomers(pagination?: PaginationInput): Promise<Customer[]> {
    const { limit = 20, offset = 0 } = pagination || {};

    const customers = await this.prisma.customer.findMany({
      take: limit,
      skip: offset,
      include: { deals: true },
      orderBy: { createdAt: 'desc' },
    });

    return customers as Customer[];
  }

  async getCustomer(id: string): Promise<Customer | null> {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
      include: { deals: true },
    });

    return customer as Customer | null;
  }

  async createCustomer(input: CreateCustomerInput): Promise<Customer> {
    const customer = await this.prisma.customer.create({
      data: input,
      include: { deals: true },
    });

    return customer as Customer;
  }

  async updateCustomer(id: string, input: UpdateCustomerInput): Promise<Customer> {
    const customer = await this.prisma.customer.update({
      where: { id },
      data: input,
      include: { deals: true },
    });

    return customer as Customer;
  }

  async deleteCustomer(id: string): Promise<boolean> {
    await this.prisma.customer.delete({ where: { id } });
    return true;
  }

  // Deal operations
  async getDeals(pagination?: PaginationInput): Promise<Deal[]> {
    const { limit = 20, offset = 0 } = pagination || {};

    const deals = await this.prisma.deal.findMany({
      take: limit,
      skip: offset,
      include: { customer: true },
      orderBy: { createdAt: 'desc' },
    });

    return deals as Deal[];
  }

  async getDeal(id: string): Promise<Deal | null> {
    const deal = await this.prisma.deal.findUnique({
      where: { id },
      include: { customer: true },
    });

    return deal as Deal | null;
  }

  async getDealsByCustomer(customerId: string): Promise<Deal[]> {
    const deals = await this.prisma.deal.findMany({
      where: { customerId },
      include: { customer: true },
      orderBy: { createdAt: 'desc' },
    });

    return deals as Deal[];
  }

  async createDeal(input: CreateDealInput): Promise<Deal> {
    const deal = await this.prisma.deal.create({
      data: input,
      include: { customer: true },
    });

    return deal as Deal;
  }

  async updateDeal(id: string, input: UpdateDealInput): Promise<Deal> {
    const deal = await this.prisma.deal.update({
      where: { id },
      data: input,
      include: { customer: true },
    });

    return deal as Deal;
  }

  async deleteDeal(id: string): Promise<boolean> {
    await this.prisma.deal.delete({ where: { id } });
    return true;
  }

  // Dashboard stats
  async getDashboardStats(): Promise<DashboardStats> {
    const [totalCustomers, activeCustomers, totalDeals, wonDeals, totalRevenue] =
      await Promise.all([
        this.prisma.customer.count(),
        this.prisma.customer.count({ where: { status: 'ACTIVE' } }),
        this.prisma.deal.count(),
        this.prisma.deal.count({ where: { status: 'WON' } }),
        this.prisma.deal.aggregate({
          where: { status: 'WON' },
          _sum: { value: true },
        }),
      ]);

    return {
      totalCustomers,
      activeCustomers,
      totalDeals,
      wonDeals,
      totalRevenue: totalRevenue._sum.value || 0,
    };
  }
}
