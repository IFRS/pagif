# Copilot Instructions for PagIF

## Overview
PagIF is a payment system integrated with PagTesouro, split into two main services:
- **Backend**: Node.js + Express, MongoDB (via Mongoose)
- **Frontend**: Nuxt 4 (Vue), Pinia, Vuetify

## Architecture & Data Flow
- **Backend** (`backend/`): Handles API, authentication, business logic, and DB models. Entry point: `index.js`.
  - API routes: `api/routes/`
  - Controllers: `api/controllers/`
  - Middleware: `api/middleware/`
  - DB models/scripts: `db/models/`, `db/scripts/`
  - Logging: `log/logger/`
  - Queue: `queue/`
- **Frontend** (`frontend/`): SPA with Nuxt 4, using Pinia for state and Vuetify for UI.
  - Main app: `app/`
  - Components: `components/`
  - Pages: `pages/`
  - Stores: `stores/`
  - Utils: `utils/`

## Developer Workflows
- **Install dependencies**: `npm install` (run separately in `backend/` and `frontend/`)
- **Lint**: `npm run lint` / `npm run lint:fix`
- **Backend**:
  - Dev server: `npm run dev` (nodemon, watches changes)
  - Prod server: `npm run start`
  - Create superadmin: `npm run superadmin email@example.com`
- **Frontend**:
  - Dev server: `npm run dev`
  - Build: `npm run build`
  - Preview prod build: `npm run preview`
  - Clean cache: `npm run clean`

## Project-Specific Patterns
- **Backend**:
  - Uses Express routers/controllers pattern. Each route in `api/routes/` maps to a controller in `api/controllers/`.
  - Middleware for auth, error handling, and abilities in `api/middleware/`.
  - MongoDB models in `db/models/`.
  - Logging via Winston in `log/logger/`.
  - Queue processing in `queue/`.
- **Frontend**:
  - Nuxt 4 file-based routing in `pages/`.
  - State managed by Pinia stores in `stores/`.
  - UI components in `components/`, organized by feature.
  - Custom composables in `composables/` for ACL, masking, toast, etc.
  - SCSS theming in `assets/scss/`.

## Integration Points
- **PagTesouro**: Integration logic in `backend/api/pagtesouro.js`.
- **Google Auth**: Handled in `backend/api/auth/google.js` and `frontend/components/Autenticacao.client.vue`.
- **Altcha**: Used for CAPTCHA in both backend (`altcha-lib`, `api/middleware/altcha.js`) and frontend (`components/Altcha.client.vue`).

## Conventions
- Use ES modules (`type: module` in `package.json`).
- Linting via ESLint (see `eslint.config.mjs`).
- Environment variables via `.env` (not included in repo).
- All backend scripts/commands should be run from the `backend/` directory.
- All frontend scripts/commands should be run from the `frontend/` directory.

## Examples
- To add a new API endpoint: create a route in `api/routes/`, a controller in `api/controllers/`, and update the model in `db/models/` if needed.
- To add a new page: create a `.vue` file in `frontend/pages/` and any needed components in `frontend/components/`.

---
For questions or unclear conventions, check `README.md` or ask for clarification.
