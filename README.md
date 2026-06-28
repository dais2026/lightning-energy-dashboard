<div align="center">

# ⚡ Lightning Energy Dashboard

**Solar Battery Storage Comparison & Analysis Platform**

[![Version](https://img.shields.io/badge/version-1.3.1-00EAD3?style=flat-square)](https://github.com/dais2026/lightning-energy-dashboard/releases)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18%20|%2020%20|%2022-339933?style=flat-square&logo=node.js)](https://nodejs.org/)
[![Tests](https://img.shields.io/badge/tests-5%2F5%20passing-brightgreen?style=flat-square)](./server/)
[![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](./LICENSE)

*Compare 11 premium solar battery systems with interactive charts, export reports, admin dashboard, and analytics — built with production-grade security and infrastructure.*

[**View Repository →**](https://github.com/dais2026/lightning-energy-dashboard) · [**Releases**](https://github.com/dais2026/lightning-energy-dashboard/releases) · [**Report Bug**](https://github.com/dais2026/lightning-energy-dashboard/issues)

</div>

---

## ✨ What This Does

Lightning Energy Dashboard is a professional solar battery storage comparison tool built for installers, consultants, and homeowners evaluating battery storage systems for Australian residential and commercial applications.

**Interactive Battery Comparison** across 11 complete systems with 6 data-driven chart tabs — efficiency, power, cost, performance scoring, feature matrix, and warranty analysis.

**Export Anywhere** — download the full comparison as CSV (Excel), JSON (API), or Markdown (reports) from the dashboard header.

**Admin & Analytics** — system health monitoring, feature flag management, user activity, and comprehensive usage analytics with funnel, geographic, and device breakdowns.

---

## 🔋 11 Battery Systems — Fully Documented

| # | System | Efficiency | Capacity | Cost/kWh | Warranty |
|---|--------|------------|----------|----------|---------|
| 1 | **Tesla Powerwall 3** | 97.5% | 13.5 kWh | $1,037 | 10 yr |
| 2 | **Sigenergy SigenStor** | 95% | 5.2–7.8 kWh/module | $1,100 | 10 yr |
| 3 | **Sungrow SBR Series** | 96% | 6.4–25.6 kWh | $850 | 10.5 yr |
| 4 | **Anker Solix X1** | 94.5% | 5 kWh/module | $1,200 | 10 yr |
| 5 | **Enphase IQ Battery 5P** | 89% | 5.0 kWh | $1,400 | **15 yr** |
| 6 | **BYD Battery-Box Premium** | 96% | 5.1–22.1 kWh | $900 | 10 yr |
| 7 | **Fronius Primo GEN24 Plus** | 96% | Scalable | $950 | 10 yr |
| 8 | **Fronius Symo GEN24 Plus** | 97.9% | 6.3–15.8 kWh | $1,000 | 10 yr |
| 9 | **FoxESS ECS Series** | 95% | 2.88–20.16 kWh | $800 | 10 yr |
| 10 | **GoodWe GW8.3-BAT-D-G20** | **98%** | 8 kWh | $875 | 10 yr |
| 11 | **GoodWe ESA Series** | 97% | 5–108 kWh | $820 | 10 yr |

Each system includes: full specifications, company background, compatible inverters, feature matrix, manufacturer datasheets.

---

## 🚀 Quick Start

```bash
# Clone
git clone https://github.com/dais2026/lightning-energy-dashboard.git
cd lightning-energy-dashboard

# Install (uses --legacy-peer-deps for Vite 7 compatibility)
make install

# Start dev server → http://localhost:3001
make dev
```

> **Requires:** Node.js 18+ · npm 9+

---

## 🛠 All Commands

```bash
# Development
make dev          # Start dev server (localhost:3001)
make check        # TypeScript type-check (0 errors in strict mode)
make test         # Run unit tests (5/5)
make test-cov     # Tests with coverage report

# Build
make build        # Production build (~374 KB JS + lazy chunks)
make analyze      # Interactive bundle visualizer (rollup-plugin-visualizer)
make clean        # Remove dist/

# Database
make migrate      # Apply all pending SQL migrations
make backup       # mysqldump with gzip + 30-day retention

# Deployment
make predeploy    # 10-point pre-deployment checklist
make health       # Live server health check (/health, /metrics, tRPC)
make deploy       # Full pipeline: check → test → build → predeploy
```

---

## 📐 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Tailwind CSS 4, Recharts, shadcn/ui (60 components) |
| Backend | Node.js, Express, tRPC 11 (end-to-end type safety) |
| Database | MySQL 8 + Drizzle ORM |
| Auth | Manus OAuth 2.0, session cookies |
| Storage | AWS S3 + presigned URLs |
| Testing | Vitest (unit), Playwright (E2E — 11 tests) |
| Security | Helmet.js CSP, express-rate-limit (3 tiers), pino logging |
| Build | Vite 7, ESBuild, code-split vendor chunks |
| Monitoring | `/health` + `/metrics` endpoints, pino-http request logging |

---

## 📁 Project Structure

```
lightning-energy-dashboard/
├── client/src/
│   ├── pages/
│   │   ├── Home.tsx          # Battery dashboard (743 lines)
│   │   ├── FileStorage.tsx   # S3 file management
│   │   ├── Admin.tsx         # Admin dashboard (4 tabs)
│   │   └── Analytics.tsx     # Analytics module (5 tabs)
│   ├── components/
│   │   ├── BatteryModal.tsx  # Detailed battery specs
│   │   ├── DashboardLayout.tsx
│   │   └── ui/               # 60 shadcn/ui components
│   └── lib/
│       ├── batteryData.ts    # 11 complete battery specs (44 KB)
│       └── exportUtils.ts    # CSV / JSON / Markdown export
├── server/
│   ├── _core/index.ts        # Express + security middleware
│   ├── routers.ts            # tRPC procedures (auth, files, admin)
│   ├── featureFlags.ts       # Feature flag system
│   └── db.ts                 # Drizzle + MySQL2
├── drizzle/
│   ├── schema.ts             # Database schema
│   └── migrations/           # 3 SQL migration files
├── scripts/
│   ├── health-check.sh       # Live endpoint monitoring
│   ├── backup.sh             # Database backup
│   ├── migrate.sh            # Migration runner
│   └── pre-deploy-check.sh  # 10-point pre-deploy checklist
├── tests/e2e/                # Playwright E2E tests (11 tests)
├── Makefile                  # 14 developer shortcuts
├── CHANGELOG.md              # Full version history
└── .github/
    ├── CI_WORKFLOW_TEMPLATE.yml  # CI/CD pipeline (activate below)
    └── ISSUE_TEMPLATE/           # 5 issue templates
```

---

## 📊 Dashboard Features

### Main Dashboard (`/`)
- **Battery Grid** — 11 cards with quick stats and click-to-expand modal
- **Efficiency Tab** — Horizontal bar chart ranking 89%–98% efficiency
- **Power Tab** — Dual bars: peak (kW) vs continuous power
- **Cost Tab** — Cost/kWh + total cost side-by-side comparison
- **Performance Tab** — Scatter plot: Peak Power vs Efficiency (bubble = cost)
- **Features Tab** — Full feature matrix (inverter, 3-phase, EV, smart, high-power)
- **Warranty Tab** — Warranty period comparison (10–15 years)
- **Export Dropdown** — CSV / JSON / Markdown from the header

### Analytics (`/analytics`)
- KPI cards with period-over-period trend indicators
- Daily active users area chart + session metrics
- Top pages by views, avg time, bounce rate
- Conversion funnel visualization (Visit → Browse → Interact → Convert)
- Geographic distribution with growth metrics
- Device breakdown pie chart (Desktop 62%, Mobile 31%, Tablet 7%)

### Admin (`/admin`)
- System health monitoring (6 real-time metric cards)
- Feature flag management with rollout percentage controls
- Active user list with online/offline status
- System configuration (rate limits, log level, upload size)

---

## 🗄️ Database Migrations

```bash
# Set connection env vars
export DB_HOST=localhost DB_NAME=lightning_energy DB_USER=root DB_PASS=secret

# Run all pending migrations
make migrate

# Or with dry-run to preview
bash scripts/migrate.sh --dry-run
```

Three migrations included:
- `001_init.sql` — `users` + `files` tables with FK constraints
- `002_add_analytics.sql` — `page_views`, `events`, `daily_stats`
- `003_add_feature_flags.sql` — `feature_flags` + `feature_flag_overrides` (10 seeded flags)

---

## 🔒 Security

- **Helmet.js** — HTTP security headers + Content Security Policy
- **Rate Limiting** — 100/15min general · 30/15min mutations · 10/hr uploads
- **Structured Logging** — pino + pino-http JSON request logs
- **Input Validation** — Zod v4 schema validation on all tRPC inputs
- **Session Security** — Secure, HTTP-only session cookies

See [`SECURITY.md`](./SECURITY.md) for the full security guide.

---

## 🤝 Contributing

See [`CONTRIBUTING.md`](./CONTRIBUTING.md) for:
- Development setup
- Branch naming conventions
- Code style guide
- PR process and review standards
- Test requirements

---

## ⚙️ Activating CI/CD

The pipeline template is at `.github/CI_WORKFLOW_TEMPLATE.yml`. To activate:

```bash
# 1. Grant workflow scope (one-time)
gh auth refresh --hostname github.com --scopes workflow

# 2. Move template to active location
mkdir -p .github/workflows
cp .github/CI_WORKFLOW_TEMPLATE.yml .github/workflows/ci.yml
git add .github/workflows/ci.yml && git push
```

The pipeline runs 4 jobs on every push to `main`:
`test` (Node 18/20/22 matrix) → `code-quality` → `security` → `deploy`

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [`API.md`](./API.md) | Complete tRPC endpoint reference |
| [`ARCHITECTURE.md`](./ARCHITECTURE.md) | System design and data flows |
| [`SECURITY.md`](./SECURITY.md) | Security guide and vulnerability prevention |
| [`DEPLOYMENT.md`](./DEPLOYMENT.md) | AWS, DigitalOcean, Docker, Vercel |
| [`CONTRIBUTING.md`](./CONTRIBUTING.md) | Developer contribution guide |
| [`PERFORMANCE.md`](./PERFORMANCE.md) | Frontend/backend optimization |
| [`CHANGELOG.md`](./CHANGELOG.md) | Full version history (v1.0.0 → v1.3.1) |

---

## 📄 License

MIT © 2026 [Lightning Energy — George Fotopoulos](./LICENSE)

---

<div align="center">

**Prepared by George Fotopoulos, Renewables Consultant**  
Lightning Energy · 1 Waverley Road, Malvern East VIC 3145  
📞 0419 574 520 · ✉️ george.f@lightning-energy.com.au

*Professional solar battery storage solutions for residential and commercial applications*

</div>
