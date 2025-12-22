# Portfolio CRM - Project Implementation Plan

## Project Overview

A small CRM system built as a portfolio project demonstrating full-stack development with a monorepo architecture featuring React and Vue frontends, GraphQL backend, and dual database support (PostgreSQL with flat JSON fallback).

---

## Tech Stack

### Backend
- **GraphQL** - API layer
- **TypeScript** - Type-safe development
- **Prisma** - ORM for PostgreSQL
- **PostgreSQL** - Primary database (Docker)
- **Flat JSON Files** - Fallback database
- **Vitest** - Testing framework

### Frontend (React)
- **React** - UI framework
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Styling
- **Apollo Client** - GraphQL client
- **i18next** - Internationalization (German/English)
- **Vitest** - Testing framework

### Frontend (Vue)
- **Vue 3** - UI framework
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Styling
- **Apollo Client** - GraphQL client
- **i18next** - Internationalization (German/English)
- **Vitest** - Testing framework

### DevOps
- **Docker** - PostgreSQL containerization
- **Monorepo** - Shared workspace structure

---

## Application Pages & Features

### 1. **Login Page**
- Simple authentication form
- Username: `admin`
- Password: `admin`
- No registration or password recovery needed
- Redirect to dashboard after successful login

### 2. **Dashboard (Home)**
- Overview statistics
  - Total customers
  - Active deals
  - Revenue summary
  - Recent activities
- Quick action buttons
- Dark/Light mode toggle

### 3. **Customers Page**
- List view with search and filter
- Customer cards/table with:
  - Name
  - Email
  - Phone
  - Company
  - Status
  - Created date
- Actions: View, Edit, Delete
- Add new customer button
- Pagination

### 4. **Customer Detail Page**
- Customer information display
- Associated deals/projects
- Contact history
- Notes section
- Edit functionality

### 5. **Deals/Projects Page**
- List view of all deals
- Deal cards/table with:
  - Title
  - Customer name
  - Value/Budget
  - Status (Lead, In Progress, Won, Lost)
  - Start/End date
- Actions: View, Edit, Delete
- Add new deal button
- Filter by status
- Pagination

### 6. **Deal Detail Page**
- Deal information
- Associated customer
- Timeline/Activity log
- Notes and files
- Status update functionality

### 7. **Settings Page**
- Theme preference (Dark/Light mode)
- Language selector (German/English)
- User profile (admin info)
- Database connection info (read-only)
- Application settings

---

## Core Features

### Authentication
- Simple login system
- Session/token management
- Protected routes
- Logout functionality

### Theme Manager
- **Dark Mode** - Default dark theme
- **Light Mode** - Light theme option
- **Persistence** - Save theme preference in localStorage
- **Toggle Component** - Easy switching between themes
- **Context/Composable** - Shared theme state

### Internationalization (i18n)
- **Languages**: German (de) and English (en)
- **Default Language**: German
- **i18next** - Translation framework
- **Persistence** - Save language preference in localStorage
- **Language Switcher** - Dropdown in header and settings
- **Namespaces** - Organized translations (common, customers, deals, etc.)
- **Full Coverage** - All UI text translated

### Database Strategy
- **Primary: PostgreSQL** (via Docker)
- **Fallback: Flat JSON files**
- **Environment Variable**: `DATABASE_URL`
  - If defined → Use PostgreSQL
  - If undefined → Use JSON files
- Auto-detection on backend startup

### Mock Data
- Customers (10-20 sample records)
- Deals/Projects (15-30 sample records)
- User (admin account)
- Pre-populate JSON files for testing

---

## Data Models

### User
```typescript
{
  id: string
  username: string
  password: string (hashed)
  email: string
  createdAt: DateTime
  updatedAt: DateTime
}
```

### Customer
```typescript
{
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  company: string
  status: enum (Active, Inactive, Lead)
  address: string (optional)
  notes: string (optional)
  createdAt: DateTime
  updatedAt: DateTime
  deals: Deal[]
}
```

### Deal
```typescript
{
  id: string
  title: string
  description: string
  value: number
  currency: string (default: EUR)
  status: enum (Lead, InProgress, Won, Lost)
  customerId: string
  customer: Customer
  startDate: DateTime
  endDate: DateTime (optional)
  notes: string (optional)
  createdAt: DateTime
  updatedAt: DateTime
}
```

---

## Project Structure (Monorepo)

```
portfolio-crm-react/
├── packages/
│   ├── backend/
│   │   ├── src/
│   │   │   ├── graphql/
│   │   │   │   ├── schema.ts         # GraphQL schema definition
│   │   │   │   ├── resolvers/        # Query & Mutation resolvers
│   │   │   │   └── typeDefs.ts       # Type definitions
│   │   │   ├── services/
│   │   │   │   ├── database.service.ts    # Database abstraction layer
│   │   │   │   ├── postgres.service.ts    # PostgreSQL implementation
│   │   │   │   ├── json.service.ts        # JSON file implementation
│   │   │   │   └── auth.service.ts        # Authentication logic
│   │   │   ├── data/
│   │   │   │   ├── mock/              # Mock data generators
│   │   │   │   └── json/              # Flat JSON storage files
│   │   │   ├── utils/
│   │   │   │   └── config.ts          # Environment configuration
│   │   │   └── index.ts               # Server entry point
│   │   ├── prisma/
│   │   │   └── schema.prisma          # Prisma schema
│   │   ├── tests/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── vitest.config.ts
│   │   └── .env.example
│   │
│   ├── frontend-react/
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── common/            # Reusable components
│   │   │   │   ├── layout/            # Layout components
│   │   │   │   ├── customers/         # Customer-specific components
│   │   │   │   └── deals/             # Deal-specific components
│   │   │   ├── pages/
│   │   │   │   ├── Login.tsx
│   │   │   │   ├── Dashboard.tsx
│   │   │   │   ├── Customers.tsx
│   │   │   │   ├── CustomerDetail.tsx
│   │   │   │   ├── Deals.tsx
│   │   │   │   ├── DealDetail.tsx
│   │   │   │   └── Settings.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useAuth.ts
│   │   │   │   └── useTheme.ts
│   │   │   ├── context/
│   │   │   │   ├── AuthContext.tsx
│   │   │   │   └── ThemeContext.tsx
│   │   │   ├── graphql/
│   │   │   │   ├── queries.ts
│   │   │   │   ├── mutations.ts
│   │   │   │   └── client.ts
│   │   │   ├── App.tsx
│   │   │   ├── main.tsx
│   │   │   └── index.css
│   │   ├── tests/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── vitest.config.ts
│   │   ├── tailwind.config.js
│   │   └── vite.config.ts
│   │
│   ├── frontend-vue/
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── common/            # Reusable components
│   │   │   │   ├── layout/            # Layout components
│   │   │   │   ├── customers/         # Customer-specific components
│   │   │   │   └── deals/             # Deal-specific components
│   │   │   ├── views/
│   │   │   │   ├── LoginView.vue
│   │   │   │   ├── DashboardView.vue
│   │   │   │   ├── CustomersView.vue
│   │   │   │   ├── CustomerDetailView.vue
│   │   │   │   ├── DealsView.vue
│   │   │   │   ├── DealDetailView.vue
│   │   │   │   └── SettingsView.vue
│   │   │   ├── composables/
│   │   │   │   ├── useAuth.ts
│   │   │   │   └── useTheme.ts
│   │   │   ├── graphql/
│   │   │   │   ├── queries.ts
│   │   │   │   ├── mutations.ts
│   │   │   │   └── client.ts
│   │   │   ├── App.vue
│   │   │   ├── main.ts
│   │   │   └── style.css
│   │   ├── tests/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── vitest.config.ts
│   │   ├── tailwind.config.js
│   │   └── vite.config.ts
│   │
│   ├── i18n/                      # Shared translations package
│   │   ├── locales/
│   │   │   ├── de/                # German translations
│   │   │   │   ├── common.json
│   │   │   │   ├── customers.json
│   │   │   │   ├── deals.json
│   │   │   │   └── auth.json
│   │   │   └── en/                # English translations
│   │   │       ├── common.json
│   │   │       ├── customers.json
│   │   │       ├── deals.json
│   │   │       └── auth.json
│   │   ├── src/
│   │   │   ├── index.ts           # i18n exports
│   │   │   └── config.ts          # i18next configuration
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── types/                     # Shared TypeScript types package
│   │   ├── src/
│   │   │   ├── index.ts           # Main exports
│   │   │   ├── user.types.ts
│   │   │   ├── customer.types.ts
│   │   │   ├── deal.types.ts
│   │   │   └── api.types.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── shared-utils/              # Shared utilities package
│       ├── src/
│       │   ├── index.ts           # Main exports
│       │   ├── validation.ts      # Shared validation functions
│       │   ├── formatting.ts      # Date, currency formatting
│       │   └── constants.ts       # Shared constants
│       ├── package.json
│       └── tsconfig.json
│
├── docs/
│   ├── README.md                  # Main documentation
│   ├── SETUP.md                   # Setup instructions
│   ├── API.md                     # GraphQL API documentation
│   └── ARCHITECTURE.md            # Architecture overview
│
├── docker-compose.yml             # PostgreSQL setup
├── .gitignore
├── .gitmessage                    # Git commit message template
├── .husky/                        # Husky Git hooks
│   ├── commit-msg                 # Commit message validation
│   └── pre-commit                 # Pre-commit linting
├── commitlint.config.js           # Commit message linting rules
├── .lintstagedrc.js               # Lint-staged configuration
├── .prettierrc.json               # Prettier configuration (shared)
├── .eslintrc.json                 # ESLint configuration (shared)
├── package.json                   # Root workspace config (npm/pnpm/yarn workspaces)
├── pnpm-workspace.yaml            # PNPM workspace config (if using pnpm)
└── TASKS.md                       # This file
```

---

## Implementation Phases

### Phase 1: Project Setup & Configuration
- [x] Create folder structure
- [x] Create Git commit message template (.gitmessage)
- [x] Setup Husky with commit-msg and pre-commit hooks
- [x] Configure commitlint for conventional commits
- [x] Setup lint-staged for pre-commit linting
- [x] Configure Prettier (shared config)
- [x] Configure ESLint (shared config)
- [ ] Initialize monorepo with workspaces (pnpm/npm/yarn)
- [ ] Create root package.json with workspace configuration
- [ ] Setup shared packages (types, i18n, shared-utils)
- [ ] Setup backend with TypeScript
- [ ] Setup React frontend with Vite
- [ ] Setup Vue frontend with Vite
- [ ] Configure Tailwind CSS for both frontends
- [ ] Setup Vitest for all packages
- [ ] Create Docker Compose for PostgreSQL

### Phase 2: Shared Packages
- [ ] **@crm/types**: Define all TypeScript interfaces and types
- [ ] **@crm/i18n**: Setup i18next configuration
- [ ] **@crm/i18n**: Create German translation files (common, customers, deals, auth)
- [ ] **@crm/i18n**: Create English translation files (common, customers, deals, auth)
- [ ] **@crm/shared-utils**: Validation utilities
- [ ] **@crm/shared-utils**: Formatting utilities (dates, currency)
- [ ] **@crm/shared-utils**: Shared constants
- [ ] Tests for shared packages

### Phase 3: Backend Development
- [ ] Setup Prisma schema
- [ ] Create database abstraction layer
- [ ] Implement PostgreSQL service
- [ ] Implement JSON file service
- [ ] Create mock data generators (using @crm/types)
- [ ] Define GraphQL schema (using @crm/types)
- [ ] Implement resolvers (Queries & Mutations)
- [ ] Setup authentication logic
- [ ] Environment configuration
- [ ] Backend tests (Vitest)

### Phase 4: React Frontend
- [ ] Setup routing (React Router)
- [ ] Integrate @crm/i18n package
- [ ] Integrate @crm/types package
- [ ] Integrate @crm/shared-utils package
- [ ] Create Theme Context & Hook
- [ ] Create Auth Context & Hook
- [ ] Setup Apollo Client
- [ ] Implement Login page
- [ ] Implement Dashboard
- [ ] Implement Customers page & detail
- [ ] Implement Deals page & detail
- [ ] Implement Settings page (with language selector)
- [ ] Create reusable components
- [ ] Add dark/light theme styling
- [ ] Add language switcher component
- [ ] Frontend tests (Vitest + React Testing Library)

### Phase 5: Vue Frontend
- [ ] Setup routing (Vue Router)
- [ ] Integrate @crm/i18n package
- [ ] Integrate @crm/types package
- [ ] Integrate @crm/shared-utils package
- [ ] Create Theme composable
- [ ] Create Auth composable
- [ ] Setup Apollo Client
- [ ] Implement Login view
- [ ] Implement Dashboard
- [ ] Implement Customers view & detail
- [ ] Implement Deals view & detail
- [ ] Implement Settings view (with language selector)
- [ ] Create reusable components
- [ ] Add dark/light theme styling
- [ ] Add language switcher component
- [ ] Frontend tests (Vitest + Vue Testing Library)

### Phase 6: Integration & Testing
- [ ] End-to-end testing
- [ ] Integration testing
- [ ] Test PostgreSQL mode
- [ ] Test JSON fallback mode
- [ ] Test theme switching
- [ ] Test language switching (de/en)
- [ ] Test authentication flow
- [ ] Test shared packages integration
- [ ] Performance optimization

### Phase 7: Documentation
- [ ] Write README.md
- [ ] Write SETUP.md (including workspace setup)
- [ ] Document GraphQL API
- [ ] Document architecture and monorepo structure
- [ ] Document shared packages usage
- [ ] Add inline code comments
- [ ] Create user guide

---

## GraphQL API Endpoints

### Queries
```graphql
# Authentication
query {
  login(username: String!, password: String!): AuthPayload
  me: User
}

# Customers
query {
  customers(search: String, status: CustomerStatus, limit: Int, offset: Int): [Customer!]!
  customer(id: ID!): Customer
}

# Deals
query {
  deals(customerId: ID, status: DealStatus, limit: Int, offset: Int): [Deal!]!
  deal(id: ID!): Deal
}

# Dashboard
query {
  dashboardStats: DashboardStats
}
```

### Mutations
```graphql
# Customers
mutation {
  createCustomer(input: CreateCustomerInput!): Customer
  updateCustomer(id: ID!, input: UpdateCustomerInput!): Customer
  deleteCustomer(id: ID!): Boolean
}

# Deals
mutation {
  createDeal(input: CreateDealInput!): Deal
  updateDeal(id: ID!, input: UpdateDealInput!): Deal
  deleteDeal(id: ID!): Boolean
}

# Auth
mutation {
  logout: Boolean
}
```

---

## Environment Variables

### Backend (.env)
```bash
# Database Configuration
DATABASE_URL="postgresql://user:password@localhost:5432/crm_db"
# If DATABASE_URL is not set, JSON files will be used automatically

# Server Configuration
PORT=4000
NODE_ENV=development

# Authentication
JWT_SECRET=your-secret-key-here
JWT_EXPIRATION=7d
```

### Frontend (.env)
```bash
VITE_API_URL=http://localhost:4000/graphql
```

---

## Testing Strategy

### Backend Tests
- Unit tests for services
- Integration tests for GraphQL resolvers
- Database service tests (both PostgreSQL and JSON)
- Authentication tests

### Frontend Tests (React & Vue)
- Component unit tests
- Integration tests for pages
- Theme switching tests
- Authentication flow tests
- GraphQL query/mutation tests

---

## Development Workflow

1. Install dependencies: `pnpm install` (or `npm install`)
2. Build shared packages: `pnpm --filter "@crm/*" build`
3. Start PostgreSQL: `docker-compose up -d`
4. Start backend: `pnpm --filter backend dev`
5. Start React frontend: `pnpm --filter frontend-react dev`
6. Start Vue frontend: `pnpm --filter frontend-vue dev`
7. Access applications:
   - React: http://localhost:5173
   - Vue: http://localhost:5174
   - GraphQL Playground: http://localhost:4000/graphql

### Workspace Commands

```bash
# Install dependencies for all packages
pnpm install

# Build all packages
pnpm build

# Build shared packages only
pnpm --filter "@crm/*" build

# Run tests for all packages
pnpm test

# Run specific package
pnpm --filter backend dev
pnpm --filter frontend-react dev
pnpm --filter frontend-vue dev

# Add dependency to specific package
pnpm --filter backend add express
pnpm --filter @crm/i18n add i18next
```

---

## Success Criteria

- ✅ Proper monorepo setup with workspaces
- ✅ Shared packages (@crm/types, @crm/i18n, @crm/shared-utils)
- ✅ Working authentication (admin/admin)
- ✅ Full CRUD operations for Customers and Deals
- ✅ Dark/Light theme toggle working in both frontends
- ✅ i18n support with German and English languages (shared package)
- ✅ Language switcher in header and settings
- ✅ PostgreSQL + Docker working
- ✅ JSON fallback working when DB not configured
- ✅ Mock data available
- ✅ Comprehensive tests with Vitest
- ✅ Complete English documentation
- ✅ Clean, maintainable code
- ✅ Responsive design
- ✅ Type-safe shared packages

---

## Notes

- Both frontends should provide identical functionality
- Shared packages ensure consistency across frontends
- All shared logic (types, translations, utils) in workspace packages
- Focus on code quality and best practices
- Keep it simple but professional
- Ensure good TypeScript typing throughout
- Follow component-based architecture
- Use GraphQL efficiently (avoid over-fetching)
- Monorepo benefits: code reuse, consistent versioning, easier refactoring
