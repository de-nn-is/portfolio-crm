# Husky & Git Hooks Setup

This project uses Husky to enforce code quality and conventional commits.

## Features

### 🎯 Commit Message Validation (commitlint)

All commit messages must follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

#### Allowed Types:
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style changes (formatting, etc.)
- `refactor` - Code refactoring
- `perf` - Performance improvements
- `test` - Adding or updating tests
- `chore` - Maintenance tasks
- `ci` - CI/CD changes
- `build` - Build system changes
- `revert` - Revert a previous commit

#### Allowed Scopes:
- `backend`
- `frontend-react`
- `frontend-vue`
- `i18n`
- `types`
- `shared-utils`
- `docs`
- `deps`
- `config`
- `docker`
- `workspace`

#### Examples:
```bash
feat(backend): add customer CRUD endpoints
fix(frontend-react): resolve theme toggle state issue
docs(readme): update installation instructions
refactor(i18n): restructure translation namespaces
test(types): add unit tests for customer types
chore(deps): update dependencies
```

### 🔍 Pre-commit Linting (lint-staged)

Before each commit, the following checks run automatically:

- **TypeScript/JavaScript files**: ESLint fix + Prettier format
- **JSON/Markdown/YAML files**: Prettier format
- **CSS/SCSS files**: Prettier format

### 📝 Commit Message Template

A commit message template is configured to help you write better commits.

#### Setup Template (one-time):
```bash
git config commit.template .gitmessage
```

Now when you run `git commit` (without `-m`), your editor will open with the template.

## Git Hooks

### commit-msg
Validates commit message format using commitlint.

### pre-commit
Runs lint-staged to format and lint changed files.

## Configuration Files

- `.gitmessage` - Commit message template
- `commitlint.config.js` - Commit message validation rules
- `.lintstagedrc.js` - Pre-commit linting configuration
- `.prettierrc.json` - Prettier formatting rules
- `.eslintrc.json` - ESLint linting rules
- `.husky/commit-msg` - Commit message hook
- `.husky/pre-commit` - Pre-commit hook

## Installation

Husky hooks are automatically installed when running:

```bash
pnpm install
```

The `prepare` script in package.json runs `husky install` automatically.

## Usage

### Commit with Template
```bash
git add .
git commit
# Your editor opens with the template
```

### Commit with Message
```bash
git add .
git commit -m "feat(backend): add GraphQL schema"
```

### Skip Hooks (Not Recommended)
```bash
git commit --no-verify -m "your message"
```

## Troubleshooting

### Hooks not running?
```bash
# Reinstall hooks
pnpm run prepare

# Check hook permissions
chmod +x .husky/commit-msg
chmod +x .husky/pre-commit
```

### Commit rejected?
Check your commit message against the rules above. Common issues:
- Type/scope not in allowed list
- Subject too long (max 50 chars)
- Subject starts with uppercase or ends with period
- Missing scope when required
