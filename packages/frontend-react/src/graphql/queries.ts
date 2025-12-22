import { gql } from '@apollo/client';

export const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
      user {
        id
        username
        email
        createdAt
        updatedAt
      }
    }
  }
`;

export const GET_DASHBOARD_STATS = gql`
  query GetDashboardStats {
    dashboardStats {
      totalCustomers
      activeCustomers
      totalDeals
      wonDeals
      totalRevenue
    }
  }
`;

export const GET_CUSTOMERS = gql`
  query GetCustomers($pagination: PaginationInput) {
    customers(pagination: $pagination) {
      id
      firstName
      lastName
      email
      phone
      company
      status
      createdAt
      updatedAt
    }
  }
`;

export const GET_CUSTOMER = gql`
  query GetCustomer($id: ID!) {
    customer(id: $id) {
      id
      firstName
      lastName
      email
      phone
      company
      status
      address
      notes
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_CUSTOMER = gql`
  mutation CreateCustomer($input: CreateCustomerInput!) {
    createCustomer(input: $input) {
      id
      firstName
      lastName
      email
      phone
      company
      status
      createdAt
    }
  }
`;

export const UPDATE_CUSTOMER = gql`
  mutation UpdateCustomer($id: ID!, $input: UpdateCustomerInput!) {
    updateCustomer(id: $id, input: $input) {
      id
      firstName
      lastName
      email
      phone
      company
      status
      address
      notes
      updatedAt
    }
  }
`;

export const DELETE_CUSTOMER = gql`
  mutation DeleteCustomer($id: ID!) {
    deleteCustomer(id: $id)
  }
`;

export const GET_DEALS = gql`
  query GetDeals($pagination: PaginationInput) {
    deals(pagination: $pagination) {
      id
      title
      description
      value
      currency
      status
      customerId
      startDate
      endDate
      createdAt
      updatedAt
    }
  }
`;

export const GET_DEAL = gql`
  query GetDeal($id: ID!) {
    deal(id: $id) {
      id
      title
      description
      value
      currency
      status
      customerId
      startDate
      endDate
      notes
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_DEAL = gql`
  mutation CreateDeal($input: CreateDealInput!) {
    createDeal(input: $input) {
      id
      title
      description
      value
      currency
      status
      customerId
      startDate
      createdAt
    }
  }
`;

export const UPDATE_DEAL = gql`
  mutation UpdateDeal($id: ID!, $input: UpdateDealInput!) {
    updateDeal(id: $id, input: $input) {
      id
      title
      description
      value
      currency
      status
      customerId
      startDate
      endDate
      notes
      updatedAt
    }
  }
`;

export const DELETE_DEAL = gql`
  mutation DeleteDeal($id: ID!) {
    deleteDeal(id: $id)
  }
`;
