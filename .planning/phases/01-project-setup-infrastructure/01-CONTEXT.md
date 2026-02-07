# Phase 1 Context: Project Setup & Infrastructure

**Created:** 2026-02-07
**Phase Goal:** Establish technical foundation with working backend, database, Docker environment, and basic frontend structure

## Overview

This phase sets up the complete development infrastructure for Maxed-CV. The user prefers a developer-friendly setup with instant feedback (hot reload), simple commands, and sample data for immediate testing. Frontend and backend are organized as separate projects for cleaner separation.

## Decisions

### Project Structure

**Decision:** Separate folders for frontend and backend

**Rationale:**
- Cleaner separation of concerns
- Frontend (Next.js) and Backend (NestJS) live in separate directories
- Each can have its own dependencies, configuration, and deployment strategy

**Implementation notes:**
- Suggested structure:
  ```
  maxed-cv/
  ├── backend/          # NestJS API
  ├── frontend/         # Next.js app
  ├── docker-compose.yml # Orchestrates all services
  └── README.md
  ```
- Shared types/interfaces can be published as npm package or duplicated (decision for planner)

---

### Database Setup

**Decision:** Create sample data during setup

**Rationale:**
- User wants to see the app working immediately after setup
- Sample data enables end-to-end testing without manual data entry
- Helpful for non-technical user to validate the system is working

**Sample data requirements:**
- Test user account (verified email)
- Sample Master Profile with:
  - Personal details (realistic SA data)
  - 2-3 work experience entries with bullet points
  - Skills list
  - 1-2 projects
  - Education entry
  - Certification (optional)
- Sample job description for testing AI generation

**Implementation notes:**
- Use Prisma seed script for sample data
- Document credentials in README for easy access
- Sample data should be SA-themed (Cape Town, SA companies, SA English)

---

### Hot Reload

**Decision:** Enable instant updates (hot reload) for development

**Rationale:**
- Maximizes developer productivity
- User wants immediate feedback when changing code
- Standard for modern web development

**Requirements:**
- **Backend (NestJS):** Use `npm run start:dev` with nodemon or ts-node-dev for instant restart on file changes
- **Frontend (Next.js):** Next.js has built-in hot reload via `next dev`
- **Docker:** Volume mounting must support hot reload (bind mounts, not named volumes for source code)

**Implementation notes:**
- Docker compose should mount source code as volumes
- Node_modules should use named volumes (not bind mounts) for performance
- Changes to package.json or Docker config require manual restart (expected)

---

### Development Commands

**Decision:** Simple npm commands (`npm run dev`) to start everything

**Rationale:**
- User prefers simple, memorable commands
- Lower barrier to entry for non-technical contributors
- Standard across Node.js projects

**Required commands:**
- `npm run dev` — Start entire stack (frontend + backend + database + Redis)
- `npm run backend` — Start only backend
- `npm run frontend` — Start only frontend
- `npm run db:migrate` — Run database migrations
- `npm run db:seed` — Seed sample data
- `npm run db:reset` — Reset database (drop + migrate + seed)

**Implementation notes:**
- Root package.json contains scripts that orchestrate Docker Compose
- Scripts should be cross-platform (Windows + macOS + Linux)
- Clear terminal output showing URLs and ports when services start

---

## Technical Stack (from PROJECT.md)

**Confirmed technologies:**
- **Backend:** NestJS + PostgreSQL + Prisma ORM
- **Frontend:** Next.js (with strong SEO focus)
- **Containerization:** Docker + Docker Compose
- **Message Queue:** Redis + BullMQ (for AI and PDF generation queues)
- **AI:** Gemini API (future: OpenRouter multi-provider)

**Not decided yet (for planner):**
- Authentication library (NextAuth.js v5 vs Passport vs custom)
- Email service (for verification emails)
- Frontend UI library (Tailwind? MUI? Shadcn?)

---

## Success Criteria (from ROADMAP.md)

Phase is complete when:
1. NestJS backend API starts successfully and responds to health check endpoint
2. PostgreSQL database runs in Docker container with Prisma migrations executed
3. Next.js frontend runs and connects to backend API
4. Docker Compose orchestrates all services (backend, database, frontend, Redis)
5. CI/CD pipeline runs basic tests and builds successfully

---

## Out of Scope for Phase 1

**Not in this phase:**
- Authentication implementation (Phase 2)
- Master Profile CRUD (Phase 3)
- Job scraping logic (Phase 4)
- AI integration (Phase 5)
- PDF generation (Phase 6)

**Only foundation:**
- Project scaffolding
- Database schema (tables defined, no CRUD yet)
- API health check endpoint
- Frontend landing page (no functionality)
- Docker orchestration
- Development tooling

---

## Notes for Downstream Agents

**For Researcher:**
- Research best practices for NestJS + Next.js monorepo alternatives (separate repos with shared types)
- Investigate Docker hot reload setup for NestJS (common gotchas)
- Find Prisma seeding examples for realistic sample data
- Check Next.js 14+ App Router best practices (for SEO requirements)

**For Planner:**
- Create separate setup tasks for backend, frontend, Docker, and CI/CD
- Ensure sample data seed script is comprehensive (enables Phase 3+ testing)
- Include README documentation as deliverable (dev setup instructions)
- Consider environment variable management (.env files, validation)
- Prisma schema should define all tables for Phases 2-6 (even if unused initially)

---

*Context captured from discussion with user on 2026-02-07*
