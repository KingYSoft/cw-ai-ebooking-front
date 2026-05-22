# Contributing

Thank you for contributing to the SJC frontend. This document defines the working conventions for this Vue 3 + Vite + Vuetify repository.

## 1. Repository Structure

- `src/components/`: auto-imported Vue components
- `src/pages/`: file-based route pages
- `src/layouts/`: shared page layouts
- `src/stores/`: Pinia stores
- `src/plugins/`: app setup such as Vuetify, Pinia, and router
- `src/styles/`: shared SCSS styles
- `public/`: static public assets

## 2. Development Requirements

- Node.js `>= 22.12.0`
- Yarn 1.x or a compatible version
- Git

## 3. Quick Start

Run all commands from the repository root:

```bash
yarn install
yarn dev
```

Common commands:

```bash
yarn lint
yarn test
yarn build
```

## 4. Branching and Workflow

Recommended branch names:

- `feature/<short-description>`
- `fix/<short-description>`
- `refactor/<short-description>`
- `docs/<short-description>`

Suggested workflow:

1. Update your local `dev` branch.
2. Create a focused feature branch such as `feature/shipment-search`.
3. Commit in small, single-purpose steps.
4. Run local checks before opening a pull request.
5. Merge only after review and CI pass.

## 5. Coding Standards

- Use 2-space indentation and follow the repository formatting settings.
- Use PascalCase for Vue components, for example `DataTableFilter.vue`.
- Prefer `<script setup>` and follow the existing Vue 3 + TypeScript patterns.
- Use `@/` for internal imports when explicit imports are needed.
- Run the following before submitting changes:

```bash
yarn lint
yarn test
```

## 6. Commit Message Guidelines

This repository does not enforce a strict commit format, but concise imperative messages with an optional scope are preferred:

- `frontend: add shipment search filters`
- `fix: correct login form validation`
- `docs: update setup instructions`

Avoid mixing unrelated changes in a single commit.

## 7. Pull Request Guidelines

Each pull request should include:

- A short summary of what changed and why
- The affected area or user flow
- Test evidence, including commands run
- Screenshots for UI changes
- Notes for any new environment variables or configuration updates

Include regression risks and validation steps when they are relevant.

## 8. Testing and Quality Gates

Before merging, make sure:

- Lint passes
- Relevant tests pass
- The affected user flow is manually verified when needed

There is no enforced coverage threshold today, but new or changed behavior should include targeted tests where practical.

## 9. Configuration and Security

- Frontend configuration is managed through `.env*` files.
- Custom environment variables must use the `VITE_` prefix.
- Never commit secrets, tokens, passwords, or other sensitive values.
- Document new configuration keys in the PR description or README when applicable.

## 10. Documentation Maintenance

Update project documentation when you change:

- Setup, build, or test commands
- Environment variables or configuration behavior
- Important development workflow expectations

If this document conflicts with automated checks or CI, follow the actual repository configuration and pipeline behavior.
