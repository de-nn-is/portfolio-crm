import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Layout } from '../components/layout/Layout.js';
import { Login } from '../pages/Login.js';
import { Dashboard } from '../pages/Dashboard.js';
import { Customers } from '../pages/Customers.js';
import { CustomerDetail } from '../pages/CustomerDetail.js';
import { Deals } from '../pages/Deals.js';
import { DealDetail } from '../pages/DealDetail.js';
import { Settings } from '../pages/Settings.js';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'customers',
        element: <Customers />,
      },
      {
        path: 'customers/:id',
        element: <CustomerDetail />,
      },
      {
        path: 'customers/:id/edit',
        element: <CustomerDetail />,
      },
      {
        path: 'deals',
        element: <Deals />,
      },
      {
        path: 'deals/:id',
        element: <DealDetail />,
      },
      {
        path: 'deals/:id/edit',
        element: <DealDetail />,
      },
      {
        path: 'settings',
        element: <Settings />,
      },
    ],
  },
]);
