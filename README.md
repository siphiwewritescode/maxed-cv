# Maxed-CV

AI-powered CV tailoring platform for the South African job market.

## What is Maxed-CV?

Maxed-CV eliminates the friction of manual CV customisation that causes talented professionals to lose momentum in a competitive job market. Simply paste a job URL from LinkedIn, Pnet, or other SA job boards, and our AI tailors your CV to match the requirements — delivering an ATS-optimised PDF in seconds.

**Core workflow:**
1. Create your Master Profile (comprehensive career history)
2. Paste a job URL
3. AI tailors your CV to highlight relevant experience
4. Download ATS-optimised PDF with smart filename

## Tech Stack

- **Backend:** NestJS 11 + PostgreSQL 16 + Prisma ORM 5.22
- **Frontend:** Next.js 14 (App Router) + React 18
- **Infrastructure:** Docker + Docker Compose + Redis 7.4
- **AI:** Gemini API (planned for Phase 5)
- **Queue:** BullMQ (planned for async CV generation)

## Prerequisites

- **Docker Desktop** (with Docker Compose v2)
- **Node.js 22+** (for local development without Docker)
- **Git**

## Quick Start

```bash
# Clone the repository
git clone <repo-url>
cd maxed-cv

# Start all services
npm run dev

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:3001
# Health check: http://localhost:3001/health
```

The first startup will:
1. Build Docker images for backend and frontend
2. Start PostgreSQL and Redis containers
3. Run database migrations automatically
4. Start backend (with hot reload)
5. Start frontend (with hot reload)

## Development Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start entire stack (frontend + backend + database + Redis) |
| `npm run dev:build` | Start with fresh Docker builds (use after dependency changes) |
| `npm run backend` | Start only backend + database + Redis |
| `npm run frontend` | Start only frontend |
| `npm run stop` | Stop all services |
| `npm run clean` | Stop all services and remove volumes (fresh start) |
| `npm run db:migrate` | Run database migrations |
| `npm run db:seed` | Seed sample data |
| `npm run db:reset` | Reset database (drop + migrate + seed) |
| `npm run db:studio` | Open Prisma Studio (database browser) |
| `npm run logs` | Follow all service logs |
| `npm run logs:backend` | Follow backend logs only |
| `npm run logs:frontend` | Follow frontend logs only |

## Test Account

After running `npm run db:seed`, use these credentials to explore the platform:

- **Email:** test@maxedcv.com
- **Name:** Sipho Ngwenya
- **Profile includes:** 3 work experiences (Yoco, Takealot, OfferZen), 9 skills, 2 SA-themed projects, UCT education, AWS certification

## Project Structure

```
maxed-cv/
├── backend/          # NestJS API (Port 3001)
│   ├── prisma/       # Database schema and migrations
│   └── src/
│       ├── main.ts   # Application entry point
│       ├── health/   # Health check endpoint
│       └── prisma/   # Global PrismaService
├── frontend/         # Next.js App (Port 3000)
│   ├── app/          # App Router pages and layouts
│   └── lib/          # Shared utilities (API client, env validation)
├── docker-compose.yml
├── .github/workflows/ci.yml
└── package.json      # Root orchestration scripts
```

## Environment Variables

Copy the example files and customise as needed:

```bash
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.local.example frontend/.env.local
```

**Key variables:**
- `DATABASE_URL` - PostgreSQL connection string (use "db" hostname for Docker, "localhost" for local dev)
- `REDIS_HOST` / `REDIS_PORT` - Redis connection
- `NEXT_PUBLIC_API_URL` - Backend API URL for frontend (must have `NEXT_PUBLIC_` prefix for browser access)

## Architecture

**Service Communication:**
- Frontend (Next.js) → Backend (NestJS) via REST API
- Backend → PostgreSQL via Prisma ORM
- Backend → Redis for queue management (BullMQ)
- AI generation and PDF creation run asynchronously via queues

**Data Flow:**
1. User creates Master Profile (stored in PostgreSQL)
2. User pastes job URL → Backend scrapes job description
3. Backend extracts requirements → Queues AI generation task
4. AI analyses profile vs requirements → Generates tailored content
5. Frontend displays split-screen preview (AI highlights + PDF preview)
6. User downloads ATS-optimised PDF

## SA-Specific Features

Maxed-CV is built specifically for the South African job market:

- **Notice Period Field:** Standard recruiter requirement in SA
- **SA English:** All content uses South African English spelling (organised, optimised, etc.)
- **Privacy-First:** No ID numbers on CVs (SA privacy standards)
- **Local Job Boards:** Supports LinkedIn, Pnet, Careers24, CareerJunction
- **Location Specificity:** City-level locations for remote/hybrid filtering

## Development Workflow

**Hot Reload:**
Both frontend and backend support hot reload in Docker. Code changes trigger automatic restarts.

**Database Changes:**
```bash
# 1. Modify backend/prisma/schema.prisma
# 2. Create migration
npm run db:migrate
# 3. Prisma Client regenerates automatically
```

**Adding Dependencies:**
```bash
# Backend
cd backend && npm install <package>

# Frontend
cd frontend && npm install <package>

# Rebuild Docker images
npm run dev:build
```

**Debugging:**
```bash
# View logs for specific service
npm run logs:backend
npm run logs:frontend

# Inspect database
npm run db:studio
```

## CI/CD

GitHub Actions pipeline runs on push/PR to main:

- **Backend tests:** Runs with PostgreSQL service, includes Prisma migrations
- **Frontend build:** Verifies Next.js builds successfully

Pipeline configuration: `.github/workflows/ci.yml`

## Roadmap

**Current Phase:** Phase 1 - Project Setup & Infrastructure ✅

**Upcoming Phases:**
- **Phase 2:** Authentication & Security (NextAuth.js, email verification)
- **Phase 3:** Master Profile Management (CRUD for experiences, skills, projects)
- **Phase 4:** Job URL Scraping (LinkedIn, Pnet, fallback to manual input)
- **Phase 5:** AI CV Generation (Gemini integration, queue-based processing)
- **Phase 6:** PDF Generation & Preview (ATS-optimised layout, split-screen UI)

Full roadmap: `.planning/ROADMAP.md`

## Contributing

This is a private project. Contributions are not currently accepted.

## License

Private project. All rights reserved.

---

**Questions or Issues?**
Check `.planning/` directory for detailed project documentation, research findings, and phase planning.
