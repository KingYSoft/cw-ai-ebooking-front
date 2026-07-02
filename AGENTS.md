# Repository Guidelines

## Project Structure & Module Organization

This is a Vue 3/Vite frontend for SJC freight and e-booking workflows. Main application code lives in `src/`. Route pages are under `src/pages/`, shared layouts in `src/layouts/`, reusable Vue components in `src/components/`, Pinia stores in `src/stores/`, composables in `src/composables/`, API wrappers in `src/api/`, app plugins in `src/plugins/`, i18n files in `src/i18n/`, and shared SCSS/assets in `src/styles/` and `src/assets/`. Static files served directly by Vite belong in `public/`.

## Build, Test, and Development Commands

Use Yarn from the repository root.

- `yarn install`: install dependencies from `yarn.lock`.
- `yarn dev`: start the Vite development server.
- `yarn build`: run `vue-tsc --noEmit` and produce a production build.
- `yarn build:uat`, `yarn build:sit`, `yarn build:test`: build with the matching Vite mode.
- `yarn preview`: preview the built app locally.
- `yarn lint`: run ESLint with auto-fixes.
- `yarn test`: run Vitest once.
- `yarn test:watch`: run Vitest in watch mode.

Node `>=22.12.0` is required.

## Coding Style & Naming Conventions

Follow the existing Vue single-file component style. Components use PascalCase file names, for example `PagesSystemUserEdit.vue`; composables use `useXxx.js`; mapping helpers use `mapXxx.js`; API modules use lowercase or kebab-case names such as `whs-order.js`. Prettier is configured for single quotes, no semicolons, `printWidth: 100`, and indented Vue script/style blocks. ESLint extends `eslint-config-vuetify`; run `yarn lint` before submitting changes.

## Testing Guidelines

Vitest with `happy-dom` and `@vue/test-utils` is configured for unit and component tests. Add tests near the feature or in a dedicated test directory using common names such as `ComponentName.test.js` or `useFeature.spec.js`. Cover new composables, stores, API mapping logic, and non-trivial component behavior. Run `yarn test` plus `yarn build` for changes that affect routing, types, or build configuration.

## Commit & Pull Request Guidelines

Recent history uses short conventional-style subjects such as `fix: restore warehouse order tabs` and `feature: refactor warehouse booking forms`. Keep commits focused and use `fix:`, `feature:`, or another clear type prefix. Pull requests should include a concise summary, linked issue or ticket when available, test/build results, and screenshots or screen recordings for UI changes. Note any environment variables, migrations, or deployment mode impacts.

## Security & Configuration Tips

Configuration is managed through `.env*` files, and Vite-exposed variables must use the `VITE_` prefix. Do not commit secrets or sensitive environment-specific values. Keep `.env.example` updated when adding required configuration.
