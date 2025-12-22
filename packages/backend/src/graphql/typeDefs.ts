export const typeDefs = `#graphql
  # Scalars
  scalar DateTime

  # Enums
  enum CustomerStatus {
    ACTIVE
    INACTIVE
    LEAD
  }

  enum DealStatus {
    LEAD
    IN_PROGRESS
    WON
    LOST
  }

  # Types
  type User {
    id: ID!
    username: String!
    email: String!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Customer {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    phone: String
    company: String
    status: CustomerStatus!
    address: String
    notes: String
    createdAt: DateTime!
    updatedAt: DateTime!
    deals: [Deal!]!
  }

  type Deal {
    id: ID!
    title: String!
    description: String
    value: Float!
    currency: String!
    status: DealStatus!
    customerId: ID!
    customer: Customer!
    startDate: DateTime!
    endDate: DateTime
    notes: String
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type DashboardStats {
    totalCustomers: Int!
    activeCustomers: Int!
    totalDeals: Int!
    wonDeals: Int!
    totalRevenue: Float!
  }

  # Inputs
  input LoginInput {
    username: String!
    password: String!
  }

  input PaginationInput {
    limit: Int
    offset: Int
  }

  input CreateCustomerInput {
    firstName: String!
    lastName: String!
    email: String!
    phone: String
    company: String
    status: CustomerStatus
    address: String
    notes: String
  }

  input UpdateCustomerInput {
    firstName: String
    lastName: String
    email: String
    phone: String
    company: String
    status: CustomerStatus
    address: String
    notes: String
  }

  input CreateDealInput {
    title: String!
    description: String
    value: Float!
    currency: String
    status: DealStatus
    customerId: ID!
    startDate: DateTime
    endDate: DateTime
    notes: String
  }

  input UpdateDealInput {
    title: String
    description: String
    value: Float
    currency: String
    status: DealStatus
    startDate: DateTime
    endDate: DateTime
    notes: String
  }

  # Queries
  type Query {
    # Auth
    me: User

    # Customers
    customers(pagination: PaginationInput): [Customer!]!
    customer(id: ID!): Customer

    # Deals
    deals(pagination: PaginationInput): [Deal!]!
    deal(id: ID!): Deal
    dealsByCustomer(customerId: ID!): [Deal!]!

    # Dashboard
    dashboardStats: DashboardStats!
  }

  # Mutations
  type Mutation {
    # Auth
    login(input: LoginInput!): AuthPayload!

    # Customers
    createCustomer(input: CreateCustomerInput!): Customer!
    updateCustomer(id: ID!, input: UpdateCustomerInput!): Customer!
    deleteCustomer(id: ID!): Boolean!

    # Deals
    createDeal(input: CreateDealInput!): Deal!
    updateDeal(id: ID!, input: UpdateDealInput!): Deal!
    deleteDeal(id: ID!): Boolean!
  }
`;
