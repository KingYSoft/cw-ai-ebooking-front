# SJC Frontend

This repository contains the frontend application for the SJC Freight Management System. It provides the user interface for core logistics workflows such as import and export operations, bill of lading management, EDI-related views, reporting, finance screens, and workflow automation.

## Key Functional Areas

- **Import & Export Operations**: Track shipment milestones, document status, and operational progress.
- **Bill of Lading (B/L)**: View and manage bill data across carriers and partners.
- **EDI Workflows**: Support screens related to partner data exchange and status updates.
- **Reporting & Analytics**: Present dashboards and export-oriented reporting views.
- **Finance & Billing**: Handle invoice, cost, and reconciliation-related UI flows.
- **Automation Support**: Surface workflow rules, alerts, and supporting operational tools.

## Frontend Stack

- **Vue 3** with **TypeScript**
- **Vite** for local development and production builds
- **Vuetify 3** for UI components
- **Pinia** for state management
- **Vue Router** with file-based routing
- **Vitest** for unit and component testing

## Project Structure

- `src/pages/`: route pages
- `src/components/`: reusable Vue components
- `src/layouts/`: shared page layouts
- `src/stores/`: Pinia stores
- `src/plugins/`: app plugin setup
- `src/composables/`: reusable composition logic
- `src/styles/`: shared SCSS styles
- `src/assets/`: bundled static assets
- `public/`: public files served as-is

## Development

Run commands from the repository root:

```bash
yarn install
yarn dev
```

Useful commands:

```bash
yarn lint
yarn test
yarn build
yarn preview
```

## Configuration Notes

- Frontend configuration is managed through `.env*` files.
- Custom environment variables must use the `VITE_` prefix.
- Common variables include `VITE_APP_BASE_API`, `VITE_APP_LOCATION`, `VITE_APP_ENV`, and `VITE_BASE_PATH`.
- Do not commit secrets or environment-specific sensitive values.

## Notes

- Keep documentation updated when commands, environment variables, or major workflows change.
- Follow the repository contribution and coding conventions documented in `CONTRIBUTING.md` and `AGENTS.md`.
