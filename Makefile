# =============================================================================
# Lightning Energy Dashboard — Makefile
# Convenience shortcuts for development, testing, and deployment
# Usage: make <target>
# =============================================================================

.PHONY: help dev build test check clean migrate backup health deploy analyze

# Default target
help:
	@echo ""
	@echo "Lightning Energy Dashboard — Available Commands"
	@echo "═══════════════════════════════════════════════"
	@echo ""
	@echo "  Development"
	@echo "  ───────────────────────────────────────────────"
	@echo "  make dev          Start dev server (localhost:3001)"
	@echo "  make check        Run TypeScript type-check"
	@echo "  make test         Run unit test suite"
	@echo "  make test-cov     Run tests with coverage report"
	@echo "  make lint         Run linter (if configured)"
	@echo ""
	@echo "  Build"
	@echo "  ───────────────────────────────────────────────"
	@echo "  make build        Production build"
	@echo "  make analyze      Build + open bundle visualizer"
	@echo "  make clean        Remove dist/ directory"
	@echo ""
	@echo "  Database"
	@echo "  ───────────────────────────────────────────────"
	@echo "  make migrate      Run all pending DB migrations"
	@echo "  make backup       Create compressed DB backup"
	@echo ""
	@echo "  Deployment"
	@echo "  ───────────────────────────────────────────────"
	@echo "  make predeploy    Run pre-deployment checklist"
	@echo "  make health       Check running server health"
	@echo "  make deploy       Full: check → build → deploy"
	@echo ""

# ── Development ──────────────────────────────────────────────────────────────

dev:
	npm run dev

check:
	npm run check

test:
	npm test

test-cov:
	npm run test:coverage

lint:
	@if [ -f .eslintrc.js ] || [ -f .eslintrc.json ] || [ -f eslint.config.js ]; then \
		npx eslint client/src --ext .ts,.tsx; \
	else \
		echo "No ESLint config found — skipping"; \
	fi

# ── Build ─────────────────────────────────────────────────────────────────────

build:
	npm run build

analyze:
	ANALYZE=true npm run build

clean:
	rm -rf dist/
	@echo "dist/ removed"

# ── Database ──────────────────────────────────────────────────────────────────

migrate:
	@bash scripts/migrate.sh

backup:
	@bash scripts/backup.sh

# ── Deployment ───────────────────────────────────────────────────────────────

predeploy:
	@bash scripts/pre-deploy-check.sh

health:
	@bash scripts/health-check.sh

# Full deployment pipeline: type-check → test → build → predeploy
deploy: check test build predeploy
	@echo ""
	@echo "✓ All deployment checks passed. Deploy artifact: dist/"
	@echo "  Run: npm start  or  node dist/index.js"
	@echo ""

# ── Install ───────────────────────────────────────────────────────────────────

install:
	npm install --legacy-peer-deps

# ── Git helpers ───────────────────────────────────────────────────────────────

status:
	@git log --oneline -5
	@echo ""
	@git status --short
