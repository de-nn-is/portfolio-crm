# Turborepo Configuration

This project uses [Turborepo](https://turbo.build/repo) as a high-performance build system for the monorepo.

## What is Turborepo?

Turborepo is a blazing-fast build system optimized for JavaScript and TypeScript monorepos. It provides:

- **Intelligent Caching** - Never build the same thing twice
- **Parallel Execution** - Run tasks across packages simultaneously
- **Task Pipeline** - Define dependencies between tasks
- **Remote Caching** - Share cache across team (optional)

## Configuration

The Turborepo configuration is defined in [`turbo.json`](../turbo.json) at the root of the project.

### Pipeline Tasks

| Task | Description | Caching | Dependencies |
|------|-------------|---------|--------------|
| `build` | Build packages | ✅ Yes | Builds dependencies first (`^build`) |
| `dev` | Development mode | ❌ No (persistent) | None |
| `test` | Run tests | ✅ Yes | Requires built packages |
| `test:coverage` | Tests with coverage | ✅ Yes | Requires built packages |
| `lint` | Lint code | ✅ Yes | None |
| `lint:fix` | Fix lint issues | ❌ No | None |
| `format` | Format code | ❌ No | None |
| `format:check` | Check formatting | ✅ Yes | None |

### Task Dependencies

The `^build` syntax in the pipeline means "run this package's dependencies' `build` tasks first".

Example:
```
frontend-react (build) → @crm/types (build)
                      → @crm/i18n (build)
                      → @crm/shared-utils (build)
```

## Usage

### Run Tasks

```bash
# Run task across all packages
turbo run build
turbo run test

# Run task in specific package
turbo run dev --filter=backend
turbo run build --filter=frontend-react

# Run task with all dependencies
turbo run build --filter=frontend-react...

# Run in parallel (for dev mode)
turbo run dev --parallel
```

### Filtering

Turborepo supports powerful filtering:

```bash
# Single package
turbo run build --filter=backend

# Multiple packages
turbo run build --filter=frontend-react --filter=frontend-vue

# Package and its dependencies
turbo run build --filter=frontend-react...

# All packages matching pattern
turbo run build --filter="@crm/*"
```

### Caching

Turborepo automatically caches task outputs.

#### Cache Hits

When a task is cached:
```bash
• Packages in scope: 3
• Running build in 3 packages
✓ @crm/types:build: cache hit, replaying output
✓ @crm/i18n:build: cache hit, replaying output  
✓ @crm/shared-utils:build: cache hit, replaying output

 Tasks:    3 successful, 3 total
Cached:    3 cached, 3 total
  Time:    241ms >>> FULL TURBO
```

#### Force Re-run

```bash
# Ignore cache and re-run
turbo run build --force

# Clear cache
rm -rf .turbo
```

### Watching Files

Dev mode runs in watch/persistent mode:

```bash
# Starts all dev servers and keeps them running
turbo run dev --parallel
```

The `"persistent": true` flag in turbo.json keeps these tasks running.

## Performance Benefits

### Example Build Times

**Without Turborepo:**
```
Build @crm/types:        5s
Build @crm/i18n:         3s  
Build @crm/shared-utils: 4s
Build backend:           8s
Build frontend-react:   12s
Build frontend-vue:     11s
Total: 43s (sequential)
```

**With Turborepo (first run):**
```
Parallel execution of independent tasks
Total: ~15s (parallel)
```

**With Turborepo (cached):**
```
All tasks cached
Total: <1s (cache replay)
```

## Best Practices

### 1. Define Outputs

Always specify `outputs` in turbo.json for cacheable tasks:

```json
{
  "build": {
    "outputs": ["dist/**", "build/**"]
  }
}
```

### 2. Use Filters Wisely

Develop one package at a time:

```bash
# Only run backend in dev mode
turbo run dev --filter=backend

# Build only what you need
turbo run build --filter=frontend-react...
```

### 3. Leverage Cache

Don't force re-runs unless necessary. Trust the cache.

### 4. Parallel Execution

Use `--parallel` for dev mode, but not for build:

```bash
# Good: parallel dev servers
turbo run dev --parallel

# Bad: parallel builds (dependency order matters)
turbo run build --parallel  # ❌ Don't do this
```

## Environment Variables

Turborepo respects environment variables:

```json
{
  "build": {
    "env": ["NODE_ENV"],
    "outputs": ["dist/**"]
  }
}
```

### Global Dependencies

Files that affect all tasks:

```json
{
  "globalDependencies": ["**/.env.*local"]
}
```

## Remote Caching (Optional)

For teams, enable remote caching:

```bash
# Login to Vercel (or your remote cache provider)
turbo login

# Link to your team
turbo link

# Now cache is shared across team
turbo run build
```

## Troubleshooting

### Cache not working?

1. Check outputs are defined correctly
2. Verify task hash hasn't changed (env vars, etc.)
3. Clear cache and retry: `rm -rf .turbo && turbo run build`

### Task not running?

1. Check if it's cached: look for "cache hit" in output
2. Force re-run: `turbo run <task> --force`
3. Check dependencies are correct in turbo.json

### Slow builds?

1. Check if tasks are running sequentially (they should be parallel)
2. Verify `dependsOn` is not over-specified
3. Use `--filter` to build only what you need

## Learn More

- [Turborepo Documentation](https://turbo.build/repo/docs)
- [Core Concepts](https://turbo.build/repo/docs/core-concepts/monorepos)
- [Caching](https://turbo.build/repo/docs/core-concepts/caching)
- [Filtering](https://turbo.build/repo/docs/core-concepts/monorepos/filtering)
