# Phase 1: Project Setup & Infrastructure - Research

**Researched:** 2026-02-07
**Domain:** Full-stack TypeScript infrastructure (NestJS, Next.js, Docker, Prisma)
**Confidence:** HIGH

## Summary

This research investigates the implementation approach for establishing a production-ready development foundation with NestJS backend, Next.js 14+ frontend (App Router), PostgreSQL with Prisma ORM, and Docker orchestration. The standard approach uses separate project directories with Docker Compose orchestration, hot reload via bind mounts, and npm scripts at the root level for developer convenience.

Modern tooling has matured significantly. NestJS 11 with TypeScript provides opinionated structure. Next.js 14+ App Router with Server Components is the current standard (Next.js 15 introduces caching changes but App Router patterns remain consistent). Prisma 7 (now Rust-free) with PostgreSQL handles database operations. Docker Compose with development-optimized bind mounts enables hot reload for both backend and frontend.

The critical insight for this phase: **separation of concerns doesn't require monorepo tooling**. Two independent projects with proper Docker networking and shared type management (via npm package or duplication) provides cleaner boundaries while avoiding monorepo complexity overhead for a project of this scale.

**Primary recommendation:** Use separate backend/ and frontend/ folders, Docker Compose for orchestration, root-level npm scripts wrapping docker-compose commands with cross-env for Windows compatibility, Prisma seeding with comprehensive sample data, and dedicated health check endpoint via @nestjs/terminus.

## User Constraints (from CONTEXT.md)

### Locked Decisions

1. **Project Structure:** Separate folders for frontend and backend
   - Backend in `backend/` directory (NestJS)
   - Frontend in `frontend/` directory (Next.js)
   - Docker Compose at root level orchestrates both
   - Each project has independent dependencies and configuration

2. **Database Setup:** Create comprehensive sample data during setup
   - Test user account (verified email)
   - Sample Master Profile with SA-themed data:
     - Personal details (realistic South African data)
     - 2-3 work experience entries with bullet points
     - Skills list
     - 1-2 projects
     - Education entry
     - Certification (optional)
   - Sample job description for testing AI generation (future phase)
   - Use Prisma seed script
   - Document credentials in README

3. **Hot Reload:** Enable instant updates for development
   - Backend: `npm run start:dev` with file watching
   - Frontend: Next.js built-in hot reload via `next dev`
   - Docker: Bind mounts for source code, named volumes for node_modules

4. **Development Commands:** Simple npm commands at root level
   - `npm run dev` — Start entire stack
   - `npm run backend` — Start only backend
   - `npm run frontend` — Start only frontend
   - `npm run db:migrate` — Run database migrations
   - `npm run db:seed` — Seed sample data
   - `npm run db:reset` — Reset database (drop + migrate + seed)
   - Scripts must be cross-platform (Windows, macOS, Linux)

### Technical Stack (Confirmed)

- **Backend:** NestJS 11+ + PostgreSQL 16+ + Prisma ORM 7+
- **Frontend:** Next.js 14+ (App Router, not Pages Router)
- **Containerization:** Docker + Docker Compose
- **Message Queue:** Redis 7+ + BullMQ (for future phases)
- **AI:** Gemini API (Phase 5)

### Claude's Discretion

- **Shared Types Strategy:** Choose between npm package or type duplication
- **Environment Variable Validation:** Select validation library (Zod recommended)
- **Frontend UI Library:** Not decided yet (deferred to Phase 3+)
- **Authentication Library:** Not decided yet (deferred to Phase 2)
- **Email Service:** Not decided yet (deferred to Phase 2)

### Deferred Ideas (OUT OF SCOPE for Phase 1)

- Authentication implementation
- Master Profile CRUD operations
- Job scraping logic
- AI integration (Gemini API)
- PDF generation
- Production deployment configuration
- Advanced monitoring/logging

**Only foundation work:** Project scaffolding, database schema definition (tables only, no CRUD), API health check endpoint, frontend landing page (no functionality), Docker orchestration, development tooling.

## Standard Stack

The established libraries/tools for this domain.

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| NestJS | 11.1.13+ | Backend framework | TypeScript-first, opinionated architecture, excellent for maintainable APIs |
| Next.js | 14.2+ | Frontend framework | React with SSR/SSG, App Router with Server Components, SEO-first |
| Prisma | 7.1.0+ | ORM | Type-safe database client, excellent migrations, Rust-free as of v7 |
| PostgreSQL | 16+ | Database | Robust relational DB, excellent JSON support, industry standard |
| Docker | 24+ | Containerization | Standard for consistent dev/prod environments |
| Docker Compose | 2.24+ | Orchestration | Multi-container orchestration for local development |
| Redis | 7.4+ | Cache/Queue | In-memory data store, BullMQ backend |
| BullMQ | 5+ | Job queue | Reliable queue for async tasks (AI, PDF generation) |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @nestjs/terminus | 10+ | Health checks | Required - API health endpoint monitoring |
| class-validator | 0.14+ | DTO validation | Required - Input validation in NestJS |
| class-transformer | 0.5+ | DTO transformation | Required - Works with class-validator |
| cross-env | 7.0+ | Cross-platform env vars | Required - Windows/Mac/Linux compatibility |
| @faker-js/faker | 8+ | Test data generation | Recommended - Realistic seed data |
| zod | 3.22+ | Runtime validation | Recommended - Environment variable validation |
| ts-node | 10+ | TypeScript execution | Required - Run Prisma seed scripts |
| nodemon | 3+ | File watching | Required - Backend hot reload in Docker |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Next.js 14 | Next.js 15 | Next 15 has caching changes (uncached by default), React 19 RC support, but less stable for production as of Feb 2026 |
| Separate projects | Turborepo/Nx monorepo | Monorepo adds tooling complexity; unnecessary for 2-project setup |
| nodemon | ts-node-dev | ts-node-dev faster restarts but nodemon more configurable and Docker Compose watch compatible |
| Zod | envalid or ts-dotenv | All viable; Zod preferred for TypeScript-first validation and type inference |
| PostgreSQL | MySQL | Both solid; PostgreSQL better JSON support, more features |

**Installation (Backend):**
```bash
# Core NestJS
npm install @nestjs/common@^11.0.0 @nestjs/core@^11.0.0 @nestjs/platform-express@^11.0.0
npm install -D @nestjs/cli@^11.0.0 @nestjs/schematics@^11.0.0 @nestjs/testing@^11.0.0

# Prisma ORM
npm install @prisma/client@^7.1.0
npm install -D prisma@^7.1.0

# Validation
npm install class-validator@^0.14.0 class-transformer@^0.5.0

# Health checks
npm install @nestjs/terminus@^10.0.0

# Development
npm install -D nodemon@^3.0.0 ts-node@^10.0.0 typescript@^5.0.0

# Environment validation
npm install zod@^3.22.0
npm install dotenv@^16.0.0
```

**Installation (Frontend):**
```bash
# Next.js
npx create-next-app@latest frontend --typescript --app --no-src-dir

# Additional dependencies
npm install zod@^3.22.0  # For form validation and API response validation
```

**Installation (Root):**
```bash
# Cross-platform scripts
npm install -D cross-env@^7.0.0
```

## Architecture Patterns

### Recommended Project Structure

```
maxed-cv/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma           # Database schema
│   │   ├── seed.ts                 # Sample data seed script
│   │   └── migrations/             # Migration history
│   ├── src/
│   │   ├── main.ts                 # Entry point
│   │   ├── app.module.ts           # Root module
│   │   ├── config/
│   │   │   ├── env.validation.ts   # Zod schemas for env vars
│   │   │   └── database.config.ts  # Prisma config
│   │   ├── health/
│   │   │   ├── health.module.ts
│   │   │   └── health.controller.ts
│   │   └── [feature]/              # Feature modules (Phase 2+)
│   │       ├── [feature].module.ts
│   │       ├── [feature].controller.ts
│   │       ├── [feature].service.ts
│   │       ├── dto/                # Data Transfer Objects
│   │       └── entities/           # Prisma entities
│   ├── Dockerfile.dev              # Development Docker config
│   ├── .env.example                # Environment template
│   ├── package.json
│   ├── tsconfig.json
│   └── nodemon.json                # Hot reload config
├── frontend/
│   ├── app/
│   │   ├── layout.tsx              # Root layout with metadata
│   │   ├── page.tsx                # Landing page
│   │   ├── globals.css             # Global styles
│   │   └── api/                    # API routes (if needed)
│   ├── public/
│   │   ├── favicon.ico
│   │   └── opengraph-image.png     # Social media preview
│   ├── lib/
│   │   ├── api.ts                  # Backend API client
│   │   └── env.ts                  # Environment validation
│   ├── types/                      # Shared types (duplicated from backend or npm package)
│   ├── Dockerfile.dev              # Development Docker config
│   ├── next.config.js              # Next.js config (output: 'standalone' for production)
│   ├── .env.local.example          # Environment template
│   └── package.json
├── docker-compose.yml              # Development orchestration
├── docker-compose.prod.yml         # Production orchestration (future)
├── .github/
│   └── workflows/
│       └── ci.yml                  # GitHub Actions pipeline
├── package.json                    # Root orchestration scripts
├── .env.example                    # Root environment template
└── README.md                       # Setup instructions
```

### Pattern 1: NestJS Modular Architecture

**What:** Group related features into self-contained modules with controllers, services, and DTOs.

**When to use:** Always. NestJS is built around modules - this is the framework's core design.

**Example:**
```typescript
// Source: NestJS official documentation + community best practices
// backend/src/health/health.module.ts
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';

@Module({
  imports: [TerminusModule],
  controllers: [HealthController],
})
export class HealthModule {}

// backend/src/health/health.controller.ts
import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService, PrismaHealthIndicator } from '@nestjs/terminus';
import { PrismaService } from '../prisma/prisma.service';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: PrismaHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.db.pingCheck('database'),
    ]);
  }
}
```

### Pattern 2: Next.js App Router with Server Components

**What:** Use Server Components by default, Client Components only for interactivity. Generate metadata for SEO at page level.

**When to use:** Always in Next.js 14+ App Router. This is the modern approach replacing Pages Router.

**Example:**
```typescript
// Source: Next.js 14+ official documentation
// frontend/app/layout.tsx (Root Layout)
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    template: '%s | Maxed-CV',
    default: 'Maxed-CV - AI-Powered CV Tailoring',
  },
  description: 'Tailor your CV to job descriptions using AI. Get noticed by recruiters.',
  openGraph: {
    title: 'Maxed-CV - AI-Powered CV Tailoring',
    description: 'Tailor your CV to job descriptions using AI',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

// frontend/app/page.tsx (Server Component - default)
export default function HomePage() {
  // This runs on the server
  return (
    <main>
      <h1>Welcome to Maxed-CV</h1>
      <p>AI-powered CV tailoring for South African job seekers</p>
    </main>
  );
}
```

### Pattern 3: Docker Hot Reload Configuration

**What:** Bind mount source code for hot reload, use named volumes for node_modules to avoid performance issues.

**When to use:** All Docker development setups. Critical for developer experience.

**Example:**
```yaml
# Source: Docker official docs + community best practices
# docker-compose.yml
version: '3.9'

services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile.dev
    volumes:
      # Bind mount for hot reload (source code)
      - ./backend/src:/app/src:delegated
      - ./backend/prisma:/app/prisma:delegated
      # Named volumes for dependencies (performance)
      - backend_node_modules:/app/node_modules
    environment:
      DATABASE_URL: postgresql://postgres:password@db:5432/maxedcv
      REDIS_HOST: redis
      REDIS_PORT: 6379
      NODE_ENV: development
    ports:
      - "3001:3001"
    command: npm run start:dev
    depends_on:
      - db
      - redis

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.dev
    volumes:
      # Bind mount for hot reload
      - ./frontend/app:/app/app:delegated
      - ./frontend/public:/app/public:delegated
      - ./frontend/lib:/app/lib:delegated
      # Named volumes for performance
      - frontend_node_modules:/app/node_modules
      - frontend_next:/app/.next
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:3001
    ports:
      - "3000:3000"
    command: npm run dev
    depends_on:
      - backend

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: maxedcv
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7.4-alpine
    ports:
      - "6379:6379"

volumes:
  backend_node_modules:
  frontend_node_modules:
  frontend_next:
  postgres_data:
```

### Pattern 4: Prisma Seeding with Comprehensive Data

**What:** Create realistic test data with Prisma Client, using Faker.js for variety. Clear existing data first for idempotency.

**When to use:** Always for development databases. Enables immediate testing without manual data entry.

**Example:**
```typescript
// Source: Prisma official documentation + best practices
// backend/prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data (development only)
  await prisma.experience.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.project.deleteMany();
  await prisma.education.deleteMany();
  await prisma.masterProfile.deleteMany();
  await prisma.user.deleteMany();

  console.log('Seeding database...');

  // Create test user
  const user = await prisma.user.create({
    data: {
      email: 'test@maxedcv.com',
      name: 'Sipho Ngwenya',
      emailVerified: new Date(),
      createdAt: new Date(),
    },
  });

  console.log('Created user:', user.email);

  // Create Master Profile with SA-themed data
  const masterProfile = await prisma.masterProfile.create({
    data: {
      userId: user.id,
      firstName: 'Sipho',
      lastName: 'Ngwenya',
      email: 'test@maxedcv.com',
      phone: '+27 82 123 4567',
      location: 'Cape Town, Western Cape, South Africa',
      headline: 'Senior Full-Stack Developer | TypeScript | React | Node.js',
      summary: 'Passionate software engineer with 5+ years building scalable web applications. Based in Cape Town with experience across fintech and e-commerce domains.',
      experiences: {
        create: [
          {
            company: 'Yoco',
            position: 'Senior Full-Stack Developer',
            location: 'Cape Town, South Africa',
            startDate: new Date('2021-03-01'),
            endDate: null, // Current position
            description: 'Building payment processing solutions for small businesses across South Africa.',
            bulletPoints: [
              'Architected microservices handling 100k+ daily transactions',
              'Reduced API response times by 40% through database optimization',
              'Mentored 3 junior developers in TypeScript best practices',
            ],
          },
          {
            company: 'Takealot',
            position: 'Full-Stack Developer',
            location: 'Cape Town, South Africa',
            startDate: new Date('2019-06-01'),
            endDate: new Date('2021-02-28'),
            description: 'Developed features for South Africa\'s largest e-commerce platform.',
            bulletPoints: [
              'Built real-time inventory management system using React and Node.js',
              'Implemented search optimization improving conversion by 15%',
              'Collaborated with product teams using Agile methodologies',
            ],
          },
        ],
      },
      skills: {
        create: [
          { name: 'TypeScript', category: 'Languages' },
          { name: 'JavaScript', category: 'Languages' },
          { name: 'React', category: 'Frontend' },
          { name: 'Next.js', category: 'Frontend' },
          { name: 'Node.js', category: 'Backend' },
          { name: 'NestJS', category: 'Backend' },
          { name: 'PostgreSQL', category: 'Databases' },
          { name: 'Docker', category: 'DevOps' },
          { name: 'Git', category: 'Tools' },
        ],
      },
      projects: {
        create: [
          {
            name: 'SA Tourism Portal',
            description: 'Built a Next.js-based tourism booking platform highlighting Western Cape attractions. Integrated with local payment providers and SA tourism APIs.',
            url: 'https://github.com/username/sa-tourism',
            technologies: ['Next.js', 'TypeScript', 'PostgreSQL', 'Stripe'],
          },
        ],
      },
      education: {
        create: [
          {
            institution: 'University of Cape Town',
            degree: 'BSc Computer Science',
            fieldOfStudy: 'Computer Science',
            startDate: new Date('2015-02-01'),
            endDate: new Date('2018-12-01'),
            location: 'Cape Town, South Africa',
          },
        ],
      },
    },
  });

  console.log('Created Master Profile for:', masterProfile.email);
  console.log('Seed data complete!');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

### Pattern 5: Environment Variable Validation with Zod

**What:** Validate environment variables at startup using Zod schemas. Fail fast if configuration is invalid.

**When to use:** Always. Prevents runtime errors from misconfiguration.

**Example:**
```typescript
// Source: Zod documentation + TypeScript best practices
// backend/src/config/env.validation.ts
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().regex(/^\d+$/).transform(Number).default('3001'),
  DATABASE_URL: z.string().url(),
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z.string().regex(/^\d+$/).transform(Number).default('6379'),
  // Future: AI API keys (Phase 5)
  // GEMINI_API_KEY: z.string().min(1).optional(),
});

export type Env = z.infer<typeof envSchema>;

export function validateEnv(): Env {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error('❌ Invalid environment variables:', result.error.format());
    throw new Error('Invalid environment configuration');
  }

  return result.data;
}

// Usage in main.ts
// backend/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { validateEnv } from './config/env.validation';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  // Validate environment variables at startup
  const env = validateEnv();

  const app = await NestFactory.create(AppModule);

  // Enable global validation for DTOs
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,           // Strip properties not in DTO
    forbidNonWhitelisted: true, // Throw error for extra properties
    transform: true,            // Auto-transform to DTO types
  }));

  await app.listen(env.PORT);
  console.log(`🚀 Backend running on http://localhost:${env.PORT}`);
}

bootstrap();
```

### Pattern 6: Cross-Platform Root Scripts

**What:** Use cross-env for environment variables and docker-compose commands wrapped in npm scripts at root level.

**When to use:** Always for root-level orchestration. Ensures Windows/Mac/Linux compatibility.

**Example:**
```json
// Source: npm scripts best practices + Docker Compose patterns
// package.json (root)
{
  "name": "maxed-cv",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "docker-compose up",
    "dev:build": "docker-compose up --build",
    "backend": "docker-compose up backend db redis",
    "frontend": "docker-compose up frontend",
    "stop": "docker-compose down",
    "clean": "docker-compose down -v",
    "db:migrate": "docker-compose exec backend npm run prisma:migrate",
    "db:seed": "docker-compose exec backend npm run prisma:seed",
    "db:reset": "docker-compose exec backend npm run prisma:reset",
    "db:studio": "docker-compose exec backend npm run prisma:studio",
    "logs:backend": "docker-compose logs -f backend",
    "logs:frontend": "docker-compose logs -f frontend",
    "test:backend": "docker-compose exec backend npm test",
    "test:frontend": "docker-compose exec frontend npm test"
  },
  "devDependencies": {
    "cross-env": "^7.0.3"
  }
}

// backend/package.json
{
  "scripts": {
    "start:dev": "nodemon --watch 'src/**/*.ts' --exec 'ts-node' src/main.ts",
    "build": "nest build",
    "start:prod": "node dist/main.js",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:seed": "ts-node prisma/seed.ts",
    "prisma:reset": "prisma migrate reset",
    "prisma:studio": "prisma studio",
    "test": "jest"
  },
  "prisma": {
    "seed": "ts-node prisma/seed.ts"
  }
}

// frontend/package.json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "test": "jest"
  }
}
```

### Anti-Patterns to Avoid

- **Running migrations in Dockerfile RUN commands:** Migrations should run at container startup, not during build. Database may not be ready at build time, and builds should be reproducible regardless of DB state.

- **Using bind mounts for node_modules:** Causes severe performance issues on macOS/Windows Docker. Always use named volumes for dependencies.

- **Manual process.env access without validation:** Environment misconfigurations cause runtime failures. Always validate at startup with Zod or similar.

- **Mixing Server and Client Components incorrectly in Next.js:** Don't add 'use client' to everything. Server Components are default and preferred for data fetching.

- **Committing .env files:** Secrets leak. Use .env.example as template, add .env to .gitignore.

- **Using Pages Router for new Next.js projects:** App Router is the future. Pages Router is legacy as of Next.js 13+.

- **Building Docker images with full node_modules:** Use multi-stage builds and Next.js standalone output to reduce image size by ~70%.

## Don't Hand-Roll

Problems that look simple but have existing solutions.

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Input validation | Custom validation functions | class-validator + class-transformer | Handles edge cases (nested objects, arrays, custom decorators), type-safe, widely tested |
| Health check endpoints | Custom /health route | @nestjs/terminus | Built-in indicators for DB, Redis, disk, memory; standardized response format |
| Environment variable validation | Manual checks in main.ts | Zod (or envalid/ts-dotenv) | Type inference, runtime validation, clear error messages, prevents startup with invalid config |
| Database migrations | Custom SQL scripts | Prisma Migrate | Schema versioning, rollback support, type generation, seed integration |
| Hot reload in Docker | Custom file watchers | nodemon (backend) + Next.js built-in (frontend) | Handles edge cases (deleted files, renamed files), efficient polling for Docker volumes |
| Cross-platform scripts | Conditional logic per OS | cross-env | Handles env var syntax differences ($ vs %), single codebase |
| Job queues | Custom Redis pub/sub | BullMQ | Retry logic, delayed jobs, priority queues, monitoring UI (Bull Board), handles crashes |
| Test data generation | Hardcoded values | @faker-js/faker | Realistic data, variety, locale support (SA data available) |
| API response types | Manual type definitions duplicated | Shared types package or code generation | Single source of truth, prevents drift, type safety across stack |
| Docker multi-stage builds | Single Dockerfile | Official patterns (dependencies → builder → runner) | Smaller images, layer caching, separate dev/prod configs |

**Key insight:** Infrastructure tooling has matured. In 2026, hand-rolling these solutions is technical debt. Use battle-tested libraries that handle edge cases you haven't encountered yet.

## Common Pitfalls

### Pitfall 1: Docker Volume Mount Performance Issues

**What goes wrong:** Bind mounting node_modules from host to container causes 10-100x slowdown on macOS/Windows, making hot reload unbearably slow.

**Why it happens:** Docker on macOS/Windows runs in a VM. Syncing thousands of small files (node_modules) between host and VM filesystem is extremely slow due to network overhead.

**How to avoid:**
- Bind mount source code directories only (`./backend/src`, `./frontend/app`)
- Use named volumes for `node_modules` and `.next` folders
- Use `:delegated` or `:cached` flags on bind mounts for performance
- Example: `- ./backend/src:/app/src:delegated` and `- backend_node_modules:/app/node_modules`

**Warning signs:**
- npm install taking 5+ minutes in container
- Hot reload delays of 10+ seconds
- High CPU usage on Docker Desktop

### Pitfall 2: Prisma Client Not Generated in Docker

**What goes wrong:** `prisma generate` not run after installing dependencies, causing "Cannot find module '@prisma/client'" errors when starting the backend.

**Why it happens:** @prisma/client is generated code, not a normal npm package. Must run `prisma generate` after `npm install` and after schema changes.

**How to avoid:**
- Add `postinstall` script to backend package.json: `"postinstall": "prisma generate"`
- Run `prisma generate` in Dockerfile after `npm install`
- Ensure prisma/ directory is available in Docker context

**Warning signs:**
- Backend crashes on startup with module not found error
- TypeScript errors for Prisma types in IDE

### Pitfall 3: NestJS Hot Reload Not Working in Docker

**What goes wrong:** Code changes don't trigger backend restart in Docker container. Must manually restart.

**Why it happens:** File system events don't propagate properly to containers on some systems. nodemon/ts-node-dev may need polling enabled.

**How to avoid:**
- Use nodemon with `--legacy-watch` flag for polling: `nodemon --legacy-watch --watch 'src/**/*.ts' --exec 'ts-node' src/main.ts`
- Ensure source directories are bind-mounted (not named volumes)
- Check nodemon.json configuration includes correct file extensions
- Verify container has correct working directory

**Warning signs:**
- Backend continues running old code after file changes
- No console output indicating restart after code change

### Pitfall 4: Next.js Metadata Not Applied (SEO Broken)

**What goes wrong:** Page metadata (title, description, OG tags) not appearing in HTML, causing poor SEO and broken social media previews.

**Why it happens:** Using Pages Router patterns in App Router, or exporting both `metadata` object and `generateMetadata` function from same file (not allowed).

**How to avoid:**
- Use `export const metadata: Metadata = {...}` for static pages
- Use `export async function generateMetadata() {...}` for dynamic pages (never both)
- Place metadata in page.tsx or layout.tsx, not components
- Verify in browser dev tools: View Page Source → check <head> tags

**Warning signs:**
- Social media link previews show generic "React App" title
- Google Search Console reports missing metadata
- Page title in browser tab is wrong

### Pitfall 5: Database Connection Issues Between Containers

**What goes wrong:** Backend cannot connect to PostgreSQL container, fails with "connection refused" or timeout errors.

**Why it happens:** Using `localhost` in DATABASE_URL instead of Docker service name. Containers have separate network namespaces.

**How to avoid:**
- Use Docker service name as hostname in DATABASE_URL: `postgresql://user:pass@db:5432/dbname` (where "db" is service name in docker-compose.yml)
- Ensure `depends_on` is set correctly in docker-compose.yml
- Use Docker networks explicitly if needed
- Wait for database to be ready before starting backend (healthcheck or wait-for-it script)

**Warning signs:**
- Backend logs show "ECONNREFUSED" errors
- Prisma Client throws connection timeout
- Works locally but fails in Docker

### Pitfall 6: Prisma Migrate Dev in Production

**What goes wrong:** Running `prisma migrate dev` in production causes data loss or schema conflicts.

**Why it happens:** `migrate dev` is interactive and may reset the database. Not designed for production.

**How to avoid:**
- Use `prisma migrate deploy` in production/CI (non-interactive, safe)
- Use `prisma migrate dev` only in local development
- Never run migrations during Docker image build (RUN command)
- Run migrations at container startup or via separate deployment step

**Warning signs:**
- Production database schema out of sync with code
- Migration history conflicts
- Unexpected data loss

### Pitfall 7: Environment Variables Not Available in Browser (Next.js)

**What goes wrong:** Backend API URL or other config not available in client-side Next.js code.

**Why it happens:** Next.js distinguishes server-side and client-side env vars. Variables without `NEXT_PUBLIC_` prefix are only available server-side.

**How to avoid:**
- Prefix client-side vars with `NEXT_PUBLIC_`: `NEXT_PUBLIC_API_URL=http://localhost:3001`
- Server-side vars (secrets) should NOT have this prefix
- Use runtime config for values that differ per environment
- Document which vars are needed in .env.example

**Warning signs:**
- `process.env.API_URL` is undefined in browser console
- Frontend cannot reach backend API
- Works server-side but fails client-side

### Pitfall 8: Cross-Platform Script Failures

**What goes wrong:** npm scripts work on macOS/Linux but fail on Windows (or vice versa).

**Why it happens:** Different command syntax (rm vs del, && vs &), path separators (/ vs \), environment variable syntax ($ vs %).

**How to avoid:**
- Use cross-env for environment variables: `cross-env NODE_ENV=production`
- Use npm packages instead of shell commands (rimraf instead of rm -rf)
- Avoid bash-specific syntax in scripts
- Test scripts on all target platforms or use CI with multiple OS

**Warning signs:**
- Scripts fail on Windows with "'rm' is not recognized"
- Environment variables empty on Windows
- Path errors with backslashes

## Code Examples

Verified patterns from official sources and community best practices.

### NestJS Module with Prisma Service

```typescript
// Source: NestJS + Prisma official documentation
// backend/src/prisma/prisma.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
    console.log('✅ Connected to database');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    console.log('❌ Disconnected from database');
  }
}

// backend/src/prisma/prisma.module.ts
import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Makes PrismaService available across all modules
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
```

### Next.js API Client with Type Safety

```typescript
// Source: Next.js + TypeScript best practices
// frontend/lib/api.ts
import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url(),
});

const env = envSchema.parse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
});

export class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = env.NEXT_PUBLIC_API_URL;
  }

  async get<T>(path: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return response.json();
  }

  async post<T>(path: string, data: unknown): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return response.json();
  }
}

export const api = new ApiClient();
```

### Docker Development Dockerfiles

```dockerfile
# Source: Docker + Node.js best practices
# backend/Dockerfile.dev
FROM node:22-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci

# Generate Prisma Client
RUN npx prisma generate

# Expose port
EXPOSE 3001

# Development command (will be overridden by docker-compose)
CMD ["npm", "run", "start:dev"]

# frontend/Dockerfile.dev
FROM node:22-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Expose port
EXPOSE 3000

# Development command (will be overridden by docker-compose)
CMD ["npm", "run", "dev"]
```

### GitHub Actions CI Pipeline (Minimal)

```yaml
# Source: GitHub Actions + Docker best practices
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  backend-test:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:16-alpine
        env:
          POSTGRES_USER: postgres
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'
          cache-dependency-path: backend/package-lock.json

      - name: Install dependencies
        working-directory: backend
        run: npm ci

      - name: Generate Prisma Client
        working-directory: backend
        run: npx prisma generate

      - name: Run migrations
        working-directory: backend
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test
        run: npx prisma migrate deploy

      - name: Run tests
        working-directory: backend
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test
        run: npm test

  frontend-build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json

      - name: Install dependencies
        working-directory: frontend
        run: npm ci

      - name: Build
        working-directory: frontend
        env:
          NEXT_PUBLIC_API_URL: http://localhost:3001
        run: npm run build

      - name: Run tests
        working-directory: frontend
        run: npm test
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Next.js Pages Router | Next.js App Router | Next.js 13 (Oct 2022), stable in 14 | Server Components by default, better SEO, nested layouts, streaming |
| Prisma with Rust engines | Prisma Rust-free (optional) | Prisma 7.0 (2025) | Simpler deployment, no binary compatibility issues, same performance |
| Manual webpack config for hot reload | Built-in Next.js HMR | Next.js 10+ (2020+) | Zero config needed for frontend hot reload |
| class-transformer + class-validator manual setup | NestJS ValidationPipe with global config | NestJS 8+ (2021+) | One-line setup, automatic DTO validation |
| dotenv with manual parsing | Zod + dotenv with type inference | Zod 3+ (2023+) | Type-safe config, runtime validation, fails fast on startup |
| Docker Compose v1 (docker-compose) | Docker Compose v2 (docker compose) | 2021-2022 | Integrated with Docker CLI, better performance |
| ts-node-dev for development | nodemon + ts-node (or tsx) | 2024+ | Better Docker compatibility, more stable |
| Next.js 14 (stable) | Next.js 15 (latest) | Oct 2024 | React 19 RC, Turbopack, uncached by default, but less production-ready |

**Deprecated/outdated:**

- **Pages Router (Next.js):** Still supported but legacy. New projects should use App Router.

- **Prisma Migrate --experimental flag:** No longer experimental as of Prisma 3+. Stable for production.

- **NestJS @nestjs/config with custom validation:** Zod integration is now standard. Manual validation is outdated.

- **Docker Compose v1 syntax:** v2 is now default. Transition complete as of Docker Desktop 4.0+.

- **Node 16/18 for development:** Node 22 LTS (April 2025) is current. Use 22 or 20 LTS minimum.

## Open Questions

Things that couldn't be fully resolved.

### 1. Shared Types Strategy

**What we know:** Two approaches exist:
- **Separate npm package:** Create `@maxedcv/shared-types` package, publish to npm (or use npm link for local development)
- **Type duplication:** Copy types from backend to frontend when API contracts change

**What's unclear:** Which approach is more maintainable for a 2-project setup without monorepo tooling? npm package adds complexity (versioning, publishing), but duplication risks drift.

**Recommendation:** Start with type duplication for Phase 1 (only health check endpoint). Reassess in Phase 2-3 when more API contracts exist. If more than 5 shared interfaces, switch to npm package approach.

### 2. Docker Compose Watch vs. Bind Mounts

**What we know:** Docker Compose v2.22+ introduced `watch` feature for file synchronization, potentially replacing bind mounts for hot reload.

**What's unclear:** How stable is `watch` with nodemon on Windows? Does it improve performance vs. traditional bind mounts?

**Recommendation:** Use traditional bind mounts for Phase 1 (proven stable). Monitor Docker Compose watch maturity and test in Phase 2.

### 3. Next.js 15 vs. 14 for Production (Feb 2026)

**What we know:**
- Next.js 15 is latest (React 19 RC, Turbopack, caching changes)
- Next.js 14 is stable (React 18, proven in production)
- Caching behavior changed in 15 (uncached by default)

**What's unclear:** Is Next.js 15 production-ready in Feb 2026? React 19 RC means not fully stable.

**Recommendation:** Use Next.js 14.2+ for Phase 1 (stable, well-documented). Upgrade to 15 when React 19 reaches stable release (likely Q2 2026).

### 4. Prisma Connection Pooling for Development

**What we know:** Prisma Accelerate provides global connection pooling and caching. PgBouncer is alternative.

**What's unclear:** Do we need connection pooling in development? How many connections will local development use?

**Recommendation:** No connection pooling for Phase 1 development. PostgreSQL default (100 connections) is sufficient. Add Prisma Accelerate or PgBouncer in Phase 6 (production deployment).

## Sources

### Primary (HIGH confidence)

- [NestJS Releases](https://github.com/nestjs/nest/releases) - Version 11.1.13 confirmed
- [NestJS Official Documentation](https://docs.nestjs.com/) - Project structure, modules, controllers
- [Next.js Official Documentation](https://nextjs.org/docs/app) - App Router, metadata API, Server Components
- [Prisma Releases](https://github.com/prisma/prisma/releases) - Version 7.1.0 confirmed
- [Prisma Official Documentation - Seeding](https://www.prisma.io/docs/orm/prisma-migrate/workflows/seeding) - Seed script configuration
- [Prisma Official Documentation - Connection Pooling](https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/databases-connections/connection-pool) - Production DB setup
- [Docker Official Documentation - Volumes](https://docs.docker.com/engine/storage/volumes/) - Volume vs. bind mount performance
- [BullMQ Installation Docs](https://docs.bullmq.io/bull/install) - Redis queue setup
- [Zod Official Documentation](https://zod.dev) - TypeScript-first validation

### Secondary (MEDIUM confidence, verified with multiple sources)

- [Next.js 14 vs 15 Comparison (Medium)](https://medium.com/@abdulsamad18090/next-js-14-vs-next-js-15-rc-a-detailed-comparison-d0160e425dc9) - Caching changes, React 19 support
- [NestJS Project Structure Best Practices (Medium)](https://arnab-k.medium.com/best-practices-for-structuring-a-nestjs-application-b3f627548220) - Modular architecture
- [Docker Hot Reload for Next.js (DEV Community)](https://dev.to/yuvraajsj18/enabling-hot-reloading-for-nextjs-in-docker-4k39) - Volume configuration
- [Docker Hot Reload for NestJS (DEV Community)](https://dev.to/osalumense/why-nestjs-hot-reload-does-not-work-in-docker-and-how-to-fix-it-properly-4de4) - nodemon configuration
- [Prisma Seed with TypeScript Guide](https://www.xjavascript.com/blog/prisma-seed-typescript/) - Comprehensive seeding patterns
- [Type-Safe Environment with Zod](https://sdorra.dev/posts/2023-08-22-type-safe-environment) - Env validation patterns
- [Next.js Standalone Docker (DEV Community)](https://dev.to/angojay/optimizing-nextjs-docker-images-with-standalone-mode-2nnh) - Production builds
- [Docker Volumes vs Bind Mounts (OneUpTime Blog, Jan 2026)](https://oneuptime.com/blog/post/2026-01-16-docker-bind-mounts-vs-volumes/view) - Performance comparison
- [NestJS Terminus Health Checks (Wanago.io)](http://wanago.io/2021/10/11/api-nestjs-health-checks-terminus-datadog/) - Health endpoint patterns
- [GitHub Actions with NestJS (DEV Community)](https://dev.to/ehsaantech/from-testing-to-automation-nestjs-and-github-actions-7h1) - CI/CD setup

### Tertiary (LOW confidence, community sources)

- [Setting Up Local Dev Environment (Medium)](https://levelup.gitconnected.com/setting-up-a-local-development-environment-with-next-js-0049cfd6d437) - NestJS + Next.js + Docker example
- [Cross-Platform Docker Compose (Yourwebhoster.eu)](https://www.yourwebhoster.eu/2020/02/26/how-to-make-docker-compose-cross-platform-mac-windows-linux/) - Cross-platform considerations
- [Sharing Types in Monorepos (Bits and Pieces)](https://blog.bitsrc.io/stay-in-sync-share-typescript-types-between-seperate-repositories-3d7850a68fef) - Type sharing strategies
- [NestJS with Docker and Heroku (BundleApps)](https://www.bundleapps.io/blog/nestjs-docker-heroku-github-actions-guide) - Deployment patterns

## Metadata

**Confidence breakdown:**

- **Standard stack:** HIGH - All versions verified from official sources (GitHub releases, npm registry)
- **Architecture patterns:** HIGH - NestJS, Next.js, Prisma patterns from official documentation
- **Docker hot reload:** MEDIUM - Multiple community sources agree on bind mount + named volume pattern, verified with official Docker docs
- **Shared types strategy:** MEDIUM - Multiple approaches documented, no single "official" solution
- **Prisma seeding:** HIGH - Official Prisma documentation + community best practices align
- **Environment validation:** HIGH - Zod official docs + TypeScript patterns widely adopted
- **CI/CD setup:** MEDIUM - GitHub Actions patterns verified across multiple sources

**Research date:** 2026-02-07

**Valid until:** 2026-03-07 (30 days) - Stack is mature and stable. Next.js 15 adoption and React 19 stable release may change recommendations in Q2 2026.

---

**Research complete.** Ready for planning phase.
