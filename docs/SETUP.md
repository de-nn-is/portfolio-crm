# Portfolio CRM - Setup Guide

## Prerequisites

- **Node.js**: >= 18.0.0
- **pnpm**: >= 8.0.0 (recommended) or npm/yarn
- **Docker**: For PostgreSQL database
- **Git**: For version control
- **Turborepo**: Installed automatically via pnpm

## Installation

### 1. Install pnpm (if not already installed)

```bash
npm install -g pnpm
```

### 2. Clone and Install Dependencies

```bash
# Navigate to project directory
cd portfolio-crm-react

# Install all dependencies for workspace
pnpm install
```

This will install dependencies for all packages in the monorepo.

### 3. Configure Environment Variables

#### Backend

```bash
cd packages/backend
cp .env.example .env
```

Edit `.env` and configure:
- `DATABASE_URL` - PostgreSQL connection (or leave unset for JSON fallback)
- `JWT_SECRET` - Secret key for JWT tokens
- `PORT` - Server port (default: 4000)

#### Frontend React

```bash
cd packages/frontend-react
cp .env.example .env
```

#### Frontend Vue

```bash
cd packages/frontend-vue
cp .env.example .env
```

### 4. Setup Git Commit Template (Optional)

```bash
# From root directory
git config commit.template .gitmessage
```

### 5. Start PostgreSQL Database

```bash
# From root directory
pnpm docker:up

# Or manually
docker-compose up -d
```

Verify database is running:
```bash
docker-compose ps
```

### 6. Build Shared Packages

Before running the applications, build the shared packages with Turborepo:

```bash
turbo run build --filter="@crm/*"
# Or use the npm script
pnpm build:shared
```

This builds (in parallel with Turborepo):
- `@crm/types`
- `@crm/i18n`
- `@crm/shared-utils`

### 7. Setup Prisma (Backend)

```bash
cd packages/backend

# Generate Prisma client
pnpm prisma:generate

# Run migrations
pnpm prisma:migrate
```

## Development

### Start All Services (with Turborepo)

```bash
# From root directory - runs all dev tasks in parallel
pnpm dev
# or
turbo run dev --parallel
```

This starts (in parallel):
- Backend (port 4000)
- React Frontend (port 5173)
- Vue Frontend (port 5174)

### Start Individual Services

```bash
# Backend only
pnpm dev:backend

# React frontend only
pnpm dev:react

# Vue frontend only
pnpm dev:vue
```

### Access Applications

- **React App**: http://localhost:5173
- **Vue App**: http://localhost:5174
- **GraphQL API**: http://localhost:4000/graphql
- **Prisma Studio**: `cd packages/backend && pnpm prisma:studio`

## Testing

```bash
# Run all tests (Turborepo caches results)
pnpm test
# or
turbo run test

# Run tests with coverage
pnpm test:coverage
# or
turbo run test:coverage

# Test specific package
turbo run test --filter=backend
turbo run test --filter=@crm/types
```

## Building for Production

```bash
# Build all packages (Turborepo optimizes build order)
pnpm build
# or
turbo run build

# Build specific package
turbo run build --filter=backend
turbo run build --filter=frontend-react
```

Turborepo automatically:
- Builds dependencies first (shared packages before apps)
- Caches build outputs
- Skips unchanged packages

## Database Modes

### PostgreSQL Mode (Primary)

When `DATABASE_URL` is set in backend `.env`, the app uses PostgreSQL.

```env
DATABASE_URL="postgresql://crm_user:crm_password@localhost:5432/crm_db"
```

### JSON Fallback Mode

When `DATABASE_URL` is not set, the app automatically falls back to flat JSON files in `packages/backend/src/data/json/`.

To use JSON mode:
1. Remove or comment out `DATABASE_URL` in `.env`
2. Restart backend

## Workspace Commands

### Turborepo Commands

```bash
# Run any task across all packages
turbo run <task>

# Run task in specific package
turbo run <task> --filter=<package-name>

# Run task in parallel
turbo run dev --parallel

# Clear Turborepo cache
turbo run clean
```

### pnpm Workspace Commands

```bash
# Install dependency to specific package
pnpm --filter backend add express
pnpm --filter @crm/i18n add i18next

# Remove dependency
pnpm --filter backend remove express

# Run script in all packages
pnpm -r <script>

# Clean all node_modules and build artifacts
pnpm clean
```

## Git Workflow

### Commit Messages

This project uses [Conventional Commits](https://www.conventionalcommits.org/).

Format: `<type>(<scope>): <subject>`

Examples:
```bash
git commit -m "feat(backend): add customer endpoints"
git commit -m "fix(frontend-react): resolve theme toggle"
git commit -m "docs(readme): update setup instructions"
```

See [docs/GIT_HOOKS.md](GIT_HOOKS.md) for more details.

### Pre-commit Hooks

Husky automatically:
- Lints and formats staged files
- Validates commit messages

## Troubleshooting

### pnpm install fails

```bash
# Clear cache and reinstall
pnpm store prune
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Shared packages not found

```bash
# Rebuild shared packages with Turborepo
turbo run build --filter="@crm/*"
# or
pnpm build:shared
```

### Turborepo cache issues

```bash
# Clear Turborepo cache
rm -rf .turbo
turbo run build --force

# Or clean everything
pnpm clean
pnpm install
```

### Docker database connection fails

```bash
# Check if container is running
docker-compose ps

# View logs
pnpm docker:logs

# Restart database
pnpm docker:down
pnpm docker:up
```

### Port already in use

Change ports in:
- Backend: `packages/backend/.env` (PORT)
- React: `packages/frontend-react/vite.config.ts` (server.port)
- Vue: `packages/frontend-vue/vite.config.ts` (server.port)

## Next Steps

1. ✅ Setup complete
2. 📖 Read [API.md](API.md) for GraphQL API documentation
3. 🏗️ Read [ARCHITECTURE.md](ARCHITECTURE.md) for project architecture
4. 📝 Check [../TASKS.md](../TASKS.md) for implementation roadmap

## Support

For issues or questions, check:
- [TASKS.md](../TASKS.md) - Implementation plan
- [GIT_HOOKS.md](GIT_HOOKS.md) - Git hooks documentation
- [README.md](../README.md) - Project overview
