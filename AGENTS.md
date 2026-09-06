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

# Karpathy Guidelines

Behavioral guidelines to reduce common LLM coding mistakes, derived from [Andrej Karpathy's observations](https://x.com/karpathy/status/2015883857489522876) on LLM coding pitfalls.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:

- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:

- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:

- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:

- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:

```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.
