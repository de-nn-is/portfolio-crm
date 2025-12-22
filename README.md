# Portfolio CRM

A full-stack CRM application built as a portfolio project demonstrating modern web development practices with a monorepo architecture, dual frontend implementations (React & Vue), and flexible database support.

## 🚀 Features

- **Dual Frontend**: Built with both React and Vue to showcase framework versatility
- **GraphQL API**: Efficient data fetching with GraphQL
- **Flexible Database**: PostgreSQL with automatic fallback to flat JSON files
- **Theme Support**: Dark and light mode with persistence
- **TypeScript**: Full type safety across the stack
- **Testing**: Comprehensive test coverage with Vitest
- **Docker**: Containerized PostgreSQL for easy development

## 📋 Tech Stack

### Backend
- GraphQL with Apollo Server
- TypeScript
- Prisma ORM
- PostgreSQL (Docker)
- Flat JSON fallback
- Vitest

### Frontend (React)
- React 18
- TypeScript
- Tailwind CSS
- Apollo Client
- React Router
- Vitest

### Frontend (Vue)
- Vue 3
- TypeScript
- Tailwind CSS
- Apollo Client
- Vue Router
- Vitest

## 📁 Project Structure

```
portfolio-crm-react/
├── packages/
│   ├── backend/          # GraphQL API server
│   ├── frontend-react/   # React frontend
│   ├── frontend-vue/     # Vue frontend
│   ├── i18n/            # Shared translations (de/en)
│   ├── types/           # Shared TypeScript types
│   └── shared-utils/    # Shared utilities
├── docs/                # Documentation
└── docker-compose.yml
```

## 🔧 Shared Packages

- **@crm/types** - Shared TypeScript interfaces and types
- **@crm/i18n** - Internationalization (German/English)
- **@crm/shared-utils** - Validation, formatting, constants

## 🛠️ Setup

See [SETUP.md](docs/SETUP.md) for detailed setup instructions.

Quick start:
```bash
# Install dependencies (monorepo with Turborepo)
pnpm install

# Build shared packages
turbo run build --filter="@crm/*"

# Start PostgreSQL
docker-compose up -d

# Start all services (Turborepo parallel execution)
turbo run dev --parallel

# Or start individual services
pnpm dev:backend
pnpm dev:react
pnpm dev:vue
```

## 🔐 Login Credentials

- **Username**: admin
- **Password**: admin

## 📖 Documentation

- [Setup Guide](docs/SETUP.md)
- [API Documentation](docs/API.md)
- [Architecture Overview](docs/ARCHITECTURE.md)
- [Implementation Plan](TASKS.md)

## 🧪 Testing

Run tests for all packages:
```bash
turbo run test

# Test with coverage
turbo run test:coverage

# Test specific package
turbo run test --filter=backend
turbo run test --filter=@crm/types
```

## 📝 License

MIT

## 👤 Author

Portfolio project by Dennis
