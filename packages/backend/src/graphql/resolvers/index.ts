import { GraphQLScalarType, Kind } from 'graphql';
import type { IDatabase } from '../../services/database.interface';
import type {
  LoginInput,
  PaginationInput,
  CreateCustomerInput,
  UpdateCustomerInput,
  CreateDealInput,
  UpdateDealInput,
} from '@crm/types';

// DateTime scalar
const DateTimeScalar = new GraphQLScalarType({
  name: 'DateTime',
  description: 'DateTime custom scalar type',
  serialize(value: any) {
    if (value instanceof Date) {
      return value.toISOString();
    }
    return value;
  },
  parseValue(value: any) {
    return new Date(value);
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value);
    }
    return null;
  },
});

interface Context {
  db: IDatabase;
  userId?: string;
}

export const resolvers = {
  DateTime: DateTimeScalar,

  Query: {
    // Auth
    me: async (_: any, __: any, context: Context) => {
      if (!context.userId) {
        throw new Error('Not authenticated');
      }
      return await context.db.getUser(context.userId);
    },

    // Customers
    customers: async (_: any, args: { pagination?: PaginationInput }, context: Context) => {
      return await context.db.getCustomers(args.pagination);
    },

    customer: async (_: any, args: { id: string }, context: Context) => {
      return await context.db.getCustomer(args.id);
    },

    // Deals
    deals: async (_: any, args: { pagination?: PaginationInput }, context: Context) => {
      return await context.db.getDeals(args.pagination);
    },

    deal: async (_: any, args: { id: string }, context: Context) => {
      return await context.db.getDeal(args.id);
    },

    dealsByCustomer: async (_: any, args: { customerId: string }, context: Context) => {
      return await context.db.getDealsByCustomer(args.customerId);
    },

    // Dashboard
    dashboardStats: async (_: any, __: any, context: Context) => {
      return await context.db.getDashboardStats();
    },
  },

  Mutation: {
    // Auth
    login: async (_: any, args: { input: LoginInput }, context: Context) => {
      return await context.db.login(args.input);
    },

    // Customers
    createCustomer: async (
      _: any,
      args: { input: CreateCustomerInput },
      context: Context
    ) => {
      return await context.db.createCustomer(args.input);
    },

    updateCustomer: async (
      _: any,
      args: { id: string; input: UpdateCustomerInput },
      context: Context
    ) => {
      return await context.db.updateCustomer(args.id, args.input);
    },

    deleteCustomer: async (_: any, args: { id: string }, context: Context) => {
      return await context.db.deleteCustomer(args.id);
    },

    // Deals
    createDeal: async (_: any, args: { input: CreateDealInput }, context: Context) => {
      return await context.db.createDeal(args.input);
    },

    updateDeal: async (
      _: any,
      args: { id: string; input: UpdateDealInput },
      context: Context
    ) => {
      return await context.db.updateDeal(args.id, args.input);
    },

    deleteDeal: async (_: any, args: { id: string }, context: Context) => {
      return await context.db.deleteDeal(args.id);
    },
  },

  Deal: {
    customer: async (parent: any, _: any, context: Context) => {
      return await context.db.getCustomer(parent.customerId);
    },
  },

  Customer: {
    deals: async (parent: any, _: any, context: Context) => {
      return await context.db.getDealsByCustomer(parent.id);
    },
  },
};
