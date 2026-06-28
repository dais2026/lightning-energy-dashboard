# Changelog

All notable changes to Lightning Energy Dashboard are documented here.

Format: [Semantic Versioning](https://semver.org/spec/v2.0.0.html)  
Repository: https://github.com/dais2026/lightning-energy-dashboard

---

## [1.3.0] — 2026-06-28

### Added
- **Battery Comparison Export** (`client/src/lib/exportUtils.ts`)
  - Export all 11 battery systems to **CSV** (spreadsheet-compatible)
  - Export to **JSON** with metadata envelope (timestamp, version, generator)
  - Export to **Markdown** with feature matrix table
  - Export dropdown in main navigation header (aqua highlight button)
- **Makefile** with 14 developer shortcut targets:
  `dev`, `build`, `analyze`, `check`, `test`, `test-cov`, `migrate`, `backup`, `health`, `predeploy`, `deploy`, `clean`, `install`, `status`
- **CHANGELOG.md** — this file; full version history from v1.0.0

### Changed
- `Home.tsx` — export dropdown added to header nav, `exportOpen` state
- Imports: added `Download` from lucide-react, `exportUtils` functions

---

## [1.2.0] — 2026-06-28

### Added
- **Code Splitting** — `React.lazy()` + `Suspense` for Admin, Analytics, FileStorage
  - `PageLoader` spinner shown during async chunk load
  - Reduced initial JS from 1,021 KB to 370 KB main + lazy chunks
- **Vendor Chunk Splitting** in `vite.config.ts`:
  - `vendor-react` (react + react-dom)
  - `vendor-charts` (recharts, 443 KB isolated)
  - `vendor-ui` (@radix-ui core)
  - `vendor-trpc` (@trpc + @tanstack/react-query)
  - `vendor-icons` (lucide-react)
- **Bundle Visualizer** — `rollup-plugin-visualizer`, run via `npm run build:analyze`
- **Database Migrations** (`drizzle/migrations/`):
  - `001_init.sql` — `users` + `files` tables with FK constraints
  - `002_add_analytics.sql` — `page_views`, `events`, `daily_stats`
  - `003_add_feature_flags.sql` — `feature_flags` + `feature_flag_overrides` (10 seeded flags)
- **Deployment Scripts** (`scripts/`):
  - `health-check.sh` — validates `/health`, `/metrics`, tRPC, static assets
  - `backup.sh` — mysqldump + gzip + 30-day retention rotation
  - `migrate.sh` — idempotent SQL runner with `--dry-run` support
  - `pre-deploy-check.sh` — 10-point pre-deployment checklist
- **npm Scripts**: `build:analyze`, `db:migrate`, `db:backup`, `predeploy`, `health`

### Changed
- `App.tsx` — lazy imports replace static imports for heavy pages
- `vite.config.ts` — added `manualChunks`, `visualizer` plugin, `isAnalyze` flag

---

## [1.1.0] — 2026-06-28

### Added
- **Admin Dashboard** (`client/src/pages/Admin.tsx`) — 4-tab management interface:
  - **Overview**: System health cards (6 metrics) + metrics line/bar charts
  - **Features**: Feature flag list with rollout %, enable/disable badges, edit controls
  - **Users**: Active user list with online/offline status, last-seen timestamps
  - **Settings**: Rate limit config, log level selector, upload size limit, maintenance buttons
- **Analytics Module** (`client/src/pages/Analytics.tsx`) — 5-tab analytics dashboard:
  - **Overview**: KPI cards (Users, Sessions, Avg Duration, Bounce Rate) + area/line charts
  - **Pages**: Top pages by views, average session time, bounce rate
  - **Funnel**: 5-step conversion funnel with visual percentage bars
  - **Geographic**: Regional distribution table with growth trend badges
  - **Devices**: Desktop/Mobile/Tablet pie chart + breakdown cards
- **Admin tRPC Router** (`server/routers.ts`) — 5 new endpoints:
  - `admin.getHealth` — system status + uptime + memory + environment
  - `admin.getMetrics` — heap usage (MB), uptime (seconds), timestamp
  - `admin.getSystemInfo` — Node version, platform, process info
  - `admin.getUserActivity` — paginated activity log stub
  - `admin.getStats` — users, files, API requests, error counts, response time
- **Feature Flags System** (`server/featureFlags.ts`) — runtime feature toggling:
  - 10 pre-configured flags with rollout percentages (0–100%)
  - User-ID and role-based targeting
  - Date-range scheduling for time-boxed rollout
  - `isFeatureEnabled()` with deterministic hash for percentage rollout
- **App Routing** — `/admin` and `/analytics` routes added to `App.tsx`
- **Sidebar Navigation** — Dashboard / File Storage / Analytics / Admin with matching icons
- **GitHub Issue Templates** (5): bug report, feature request, documentation, security, question

### Changed
- `server/routers.ts` — fixed duplicate `appRouter` export; admin router merged correctly
- `DashboardLayout.tsx` — menu items updated from placeholder "Page 1/2" to real routes
- `DashboardLayout.tsx` — imported `FolderOpen`, `BarChart2`, `Settings` icons

---

## [1.0.1] — 2026-06-28

### Added
- **Security Hardening** (`server/_core/index.ts`):
  - Helmet.js with custom Content Security Policy (CSP)
  - 3-tier rate limiting: 100/15min general, 30/15min mutations, 10/hr uploads
  - pino + pino-http structured JSON request logging
  - `/health` endpoint — returns status, uptime, timestamp, memory
  - `/metrics` endpoint — returns heap usage (MB), uptime, request counts
- **E2E Testing** (`playwright.config.ts` + `tests/e2e/dashboard.spec.ts`):
  - 11 Playwright tests covering navigation, battery cards, charts, modals, file storage
- **Documentation Suite** (2,900+ lines across 7 guides):
  - `API.md` — complete tRPC endpoint reference with TypeScript examples
  - `ARCHITECTURE.md` — system design, data flows, tech stack, scaling
  - `SECURITY.md` — vulnerability prevention, deployment checklist, incident response
  - `CONTRIBUTING.md` — dev setup, branching conventions, code style, PR process
  - `DEPLOYMENT.md` — AWS, DigitalOcean, Docker, Vercel guides
  - `PERFORMANCE.md` — frontend, backend, infrastructure optimization
  - `README.md` — project landing page with quick start and docs index
- **CI/CD Pipeline** (`.github/workflows/ci.yml`) — 4-job GitHub Actions pipeline:
  - `test` — Node 18/20/22 matrix, TypeScript check, unit tests, production build
  - `code-quality` — linting, type coverage
  - `security` — npm audit, dependency scan
  - `deploy` — deployment readiness gate
- **GitHub Secrets Guide** (`.github/SECRETS_TEMPLATE.md`)

### Dependencies Added
- `pino`, `pino-http`, `pino-pretty` — structured logging
- `helmet` — HTTP security headers
- `express-rate-limit` — rate limiting middleware
- `@playwright/test` — E2E testing framework

---

## [1.0.0] — 2026-06-28

### Initial Release

Complete solar battery storage comparison dashboard, published from `lightning-energy-complete.zip`.

#### Frontend (React 19 + Tailwind 4)
- **Home.tsx** (743 lines) — Main dashboard with battery grid and 6 comparison tabs:
  - Efficiency comparison (bar chart with 89–98% range)
  - Power analysis (peak vs continuous power dual bars)
  - Cost breakdown (cost/kWh + total cost)
  - Performance matrix (scatter plot: peak power vs efficiency, bubble = cost)
  - Feature matrix (invertors, 3-phase, EV, smart features)
  - Warranty visualization
- **FileStorage.tsx** — File upload/download via tRPC + S3 with category management
- **ComponentShowcase.tsx** — Full shadcn/ui component reference (58 KB)
- **BatteryModal.tsx** — 4-tab detailed battery specs (specs, company, inverters, features)
- **DashboardLayout.tsx** — Collapsible sidebar with OAuth login gate
- **AIChatBox.tsx** — Streaming AI chat integration
- **Map.tsx** — Google Maps proxy with authentication
- **ErrorBoundary.tsx** — Error fallback UI

#### Battery Database (`client/src/lib/batteryData.ts`, 44 KB, 819 lines)
Complete specifications for 11 battery systems:

| # | System | Year | Capacity | Efficiency | Cost/kWh |
|---|--------|------|----------|------------|----------|
| 1 | Tesla Powerwall 3 | 2023 | 13.5 kWh | 97.5% | $1,037 |
| 2 | Sigenergy SigenStor | 2023 | 5.2–7.8 kWh/module | 95% | $1,100 |
| 3 | Sungrow SBR Series | 2018 | 6.4–25.6 kWh | 96% | $850 |
| 4 | Anker Solix X1 | 2024 | 5 kWh/module | 94.5% | $1,200 |
| 5 | Enphase IQ Battery 5P | 2023 | 5.0 kWh | 89% | $1,400 |
| 6 | BYD Battery-Box Premium | 2016 | 5.1–22.1 kWh | 96% | $900 |
| 7 | Fronius Primo GEN24 Plus | 2020 | Scalable | 96% | $950 |
| 8 | Fronius Symo GEN24 Plus | 2020 | 6.3–15.8 kWh | 97.9% | $1,000 |
| 9 | FoxESS ECS Series | 2020 | 2.88–20.16 kWh | 95% | $800 |
| 10 | GoodWe GW8.3-BAT-D-G20 | 2023 | 8 kWh | **98%** | $875 |
| 11 | GoodWe ESA Series | 2024 | 5–108 kWh | 97% | $820 |

Each battery includes: full specs, company background, compatible inverters list, features, efficiency/power/cost metrics, manufacturer datasheet links.

#### Backend (Express + tRPC 11)
- **`server/routers.ts`** — tRPC procedures: auth.me, auth.logout, files.list/upload/delete/update
- **`server/_core/index.ts`** — Express server with Vite dev integration, session handling
- **`server/_core/trpc.ts`** — tRPC context factory with session/user extraction
- **`server/db.ts`** — Drizzle ORM + MySQL2 connection pool
- **`server/storage.ts`** — AWS S3 file upload (multipart, presigned URLs)

#### Design System
- **Colors**: Aqua `#00EAD3`, Black `#000000`, Ash `#808285`, White `#FFFFFF`
- **Fonts**: NextSphere (headings), GeneralSans (body), Urbanist (UI)
- **Components**: 60 shadcn/ui components (fully accessible, keyboard navigable)
- **Theme**: Professional dark mode with high contrast

#### Infrastructure
- **Database schema** (`drizzle/schema.ts`) — users (13 fields) + files (9 fields)
- **OAuth** via Manus provider with session cookies
- **TypeScript** strict mode end-to-end (tRPC type safety from server to client)
- **Build**: Vite 7 + ESBuild, 2,330 modules, production bundle

#### Source Audit
- 121 files committed, 30,323 lines of authored code
- 7 manufacturer PDF datasheets analyzed (19,538 words)
- TypeScript: 0 errors, all strict mode checks pass
- Tests: 5/5 unit tests passing

---

*Prepared by George Fotopoulos, Renewables Consultant*  
*Lightning Energy | 1 Waverley Road, Malvern East VIC 3145*  
*M: 0419 574 520 | E: george.f@lightning-energy.com.au*
