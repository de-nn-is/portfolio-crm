import bcrypt from 'bcrypt';
import type { User, Customer, Deal } from '@crm/types';
import { CustomerStatus, DealStatus } from '@crm/types';

// Internal type with password for database storage
interface UserWithPassword extends User {
  password: string;
}

/**
 * Generate mock users
 */
export async function generateMockUsers(): Promise<UserWithPassword[]> {
  const hashedPassword = await bcrypt.hash('admin', 10);

  return [
    {
      id: 'user-admin-001',
      username: 'admin',
      password: hashedPassword,
      email: 'admin@portfolio-crm.com',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
  ];
}

/**
 * Generate mock customers
 */
export function generateMockCustomers(): Customer[] {
  const firstNames = [
    'Max',
    'Lisa',
    'Michael',
    'Anna',
    'Thomas',
    'Sarah',
    'Daniel',
    'Julia',
    'Markus',
    'Laura',
    'Sebastian',
    'Maria',
    'Christian',
    'Sophie',
    'Andreas',
  ];

  const lastNames = [
    'Müller',
    'Schmidt',
    'Schneider',
    'Fischer',
    'Weber',
    'Meyer',
    'Wagner',
    'Becker',
    'Schulz',
    'Hoffmann',
    'Koch',
    'Bauer',
    'Richter',
    'Klein',
    'Wolf',
  ];

  const companies = [
    'Tech Solutions GmbH',
    'Digital Innovation AG',
    'Cloud Services Ltd',
    'Software Experts',
    'Web Development Co',
    'Data Analytics GmbH',
    'Mobile Apps AG',
    'IT Consulting',
    'E-Commerce Solutions',
    'Marketing Digital',
    'Design Studio',
    'Consulting Partners',
    'Business Solutions',
    'Enterprise Systems',
    'Development Group',
  ];

  const statuses = ['ACTIVE', 'INACTIVE', 'LEAD'] as const;

  return Array.from({ length: 15 }, (_, i) => {
    const firstName = firstNames[i];
    const lastName = lastNames[i];
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;
    const createdAt = new Date(2024, 0, i + 1);

    return {
      id: `customer-${String(i + 1).padStart(3, '0')}`,
      firstName,
      lastName,
      email,
      phone: `+49 ${Math.floor(Math.random() * 900 + 100)} ${Math.floor(Math.random() * 9000000 + 1000000)}`,
      company: i < companies.length ? companies[i] : undefined,
      status: statuses[i % statuses.length] as CustomerStatus,
      address: i % 3 === 0 ? `Hauptstraße ${i + 10}, ${10115 + i * 10} Berlin` : undefined,
      notes: i % 4 === 0 ? 'VIP Customer - High Priority' : undefined,
      createdAt,
      updatedAt: createdAt,
    };
  });
}

/**
 * Generate mock deals
 */
export function generateMockDeals(customers: Customer[]): Deal[] {
  const dealTitles = [
    'Website Redesign',
    'Mobile App Development',
    'Cloud Migration',
    'E-Commerce Platform',
    'CRM System Implementation',
    'Marketing Campaign',
    'SEO Optimization',
    'Data Analytics Dashboard',
    'API Integration',
    'Security Audit',
    'Performance Optimization',
    'Social Media Strategy',
    'Brand Identity',
    'Content Management System',
    'Email Marketing Platform',
    'Customer Portal',
    'Inventory Management',
    'Payment Gateway Integration',
    'Business Intelligence System',
    'Training Platform',
    'Support Ticketing System',
    'Video Streaming Service',
    'IoT Platform',
    'Blockchain Integration',
    'AI Chatbot',
    'Document Management',
    'HR Management System',
    'Project Management Tool',
    'Collaboration Platform',
    'Backup Solution',
  ];

  const statuses = ['LEAD', 'IN_PROGRESS', 'WON', 'LOST'] as const;

  return Array.from({ length: 30 }, (_, i) => {
    const customer = customers[i % customers.length];
    const status = statuses[i % statuses.length] as DealStatus;
    const value = Math.floor(Math.random() * 90000) + 10000; // 10k - 100k
    const createdAt = new Date(2024, Math.floor(i / 5), (i % 28) + 1);
    const startDate = new Date(createdAt);
    startDate.setDate(startDate.getDate() + 7);

    let endDate: Date | undefined;
    if (status === 'WON' || status === 'LOST') {
      endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + Math.floor(Math.random() * 6) + 1);
    }

    return {
      id: `deal-${String(i + 1).padStart(3, '0')}`,
      title: dealTitles[i],
      description: `${dealTitles[i]} project for ${customer.company || customer.firstName + ' ' + customer.lastName}`,
      value,
      currency: 'EUR',
      status,
      customerId: customer.id,
      startDate,
      endDate,
      notes: i % 5 === 0 ? 'Urgent - High Priority Deal' : undefined,
      createdAt,
      updatedAt: createdAt,
    };
  });
}

/**
 * Generate complete mock database
 */
export async function generateMockData() {
  const users = await generateMockUsers();
  const customers = generateMockCustomers();
  const deals = generateMockDeals(customers);

  return { users, customers, deals };
}
