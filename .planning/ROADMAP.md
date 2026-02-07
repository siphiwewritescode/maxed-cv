# Roadmap: Maxed-CV

## Overview

This roadmap delivers an AI-powered CV tailoring platform for the South African job market across 6 phases. Starting with project foundation and authentication, we build master profile management, job URL scraping capabilities, AI-powered CV generation, and finally PDF export with real-time preview. Each phase delivers a coherent capability that builds toward the complete workflow: user creates master profile → pastes job URL → AI generates tailored CV → downloads ATS-optimized PDF.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Project Setup & Infrastructure** - Foundation with database, Docker, and API scaffolding
- [ ] **Phase 2: Authentication & Security** - User registration, login, and session management
- [ ] **Phase 3: Master Profile Management** - Create and edit comprehensive user profiles with SA-specific fields
- [ ] **Phase 4: Job URL Scraping** - Extract job descriptions from LinkedIn, Pnet, and other SA job boards
- [ ] **Phase 5: AI CV Generation** - Gemini-powered content tailoring with queue-based processing
- [ ] **Phase 6: PDF Generation & Preview** - ATS-optimized PDF export with split-screen preview

## Phase Details

### Phase 1: Project Setup & Infrastructure
**Goal**: Establish technical foundation with working backend, database, Docker environment, and basic frontend structure
**Depends on**: Nothing (first phase)
**Requirements**: (Foundation work, no direct requirement mapping)
**Success Criteria** (what must be TRUE):
  1. NestJS backend API starts successfully and responds to health check endpoint
  2. PostgreSQL database runs in Docker container with Prisma migrations executed
  3. Next.js frontend runs and connects to backend API
  4. Docker Compose orchestrates all services (backend, database, frontend, Redis)
  5. CI/CD pipeline runs basic tests and builds successfully
**Plans**: 4 plans

Plans:
- [x] 01-01-PLAN.md — Scaffold NestJS backend with Prisma schema and health check endpoint
- [x] 01-02-PLAN.md — Scaffold Next.js frontend with App Router, SEO metadata, and API client
- [x] 01-03-PLAN.md — Docker Compose orchestration, Dockerfiles, root npm scripts, and env config
- [x] 01-04-PLAN.md — Prisma seed data (SA-themed), CI/CD pipeline, and README documentation

### Phase 2: Authentication & Security
**Goal**: Users can create accounts, log in securely, and manage their authentication state
**Depends on**: Phase 1
**Requirements**: AUTH-01, AUTH-02, AUTH-03, AUTH-04, AUTH-05
**Success Criteria** (what must be TRUE):
  1. User can sign up with email and password and receive verification email
  2. User can log in with verified credentials and session persists across browser refresh
  3. User can reset forgotten password via email link
  4. User can log out from any page and session is cleared
  5. Unauthenticated users are redirected to login when accessing protected routes
**Plans**: 7 plans

Plans:
- [ ] 02-01-PLAN.md — Install auth dependencies, update Prisma schema (OAuth + tokens), bootstrap session/Passport middleware
- [ ] 02-02-PLAN.md — Users module and Auth module (local strategy, signup, login, logout, guards)
- [ ] 02-03-PLAN.md — Sessions management service (multi-device limits) and Email module (Handlebars templates)
- [ ] 02-04-PLAN.md — Email verification flow and password reset flow (backend)
- [ ] 02-05-PLAN.md — Google and LinkedIn OAuth strategies with account linking
- [ ] 02-06-PLAN.md — Rate limiting, absolute session expiry, session tracking integration, seed data update
- [ ] 02-07-PLAN.md — Frontend auth pages (login, signup, reset, verify), route protection, dashboard

### Phase 3: Master Profile Management
**Goal**: Users can create, edit, and manage comprehensive master profiles with all CV data
**Depends on**: Phase 2
**Requirements**: PROF-01, PROF-02, PROF-03, PROF-04, PROF-05, PROF-06, PROF-07, PROF-08, PROF-09, PROF-10
**Success Criteria** (what must be TRUE):
  1. User can create Master Profile with personal details (name, email, phone)
  2. User can add multiple work experience entries with job title, company, dates, and bullet points
  3. User can edit and delete existing work experience entries
  4. User can add skills, projects, education entries, and certifications
  5. Master Profile data is stored securely and complies with POPIA standards (no sensitive ID numbers)
  6. User can view and edit their complete profile at any time
**Plans**: TBD

Plans:
- [ ] 03-01: [TBD during planning]

### Phase 4: Job URL Scraping
**Goal**: Users can paste job URLs and system extracts requirements from SA job boards with fallback handling
**Depends on**: Phase 3
**Requirements**: JOB-01, JOB-02, JOB-03, JOB-04, JOB-05, JOB-06, JOB-07, JOB-08
**Success Criteria** (what must be TRUE):
  1. User can paste job URL from LinkedIn, Pnet, Careers24, or CareerJunction into the system
  2. System successfully scrapes job description and displays extracted content to user
  3. System extracts key requirements (skills, experience, keywords) from job description
  4. System handles scraping failures gracefully with clear error messages
  5. User can manually paste job description as fallback when scraping fails
  6. Scraped job data is cached to avoid redundant requests
**Plans**: TBD

Plans:
- [ ] 04-01: [TBD during planning]

### Phase 5: AI CV Generation
**Goal**: System generates tailored CV content by analyzing job requirements against user profile using Gemini AI
**Depends on**: Phase 4
**Requirements**: AI-01, AI-02, AI-03, AI-04, AI-05, AI-06, AI-07, AI-08
**Success Criteria** (what must be TRUE):
  1. System analyzes job requirements against Master Profile and identifies relevant experience
  2. System prioritizes relevant experience by reordering bullet points to emphasize matching skills
  3. System optimizes bullet point language using South African English standards
  4. User sees AI changes highlighted (what was modified and why)
  5. AI generation processes asynchronously via queue to handle rate limits without blocking user
  6. System never fabricates experience or skills not present in Master Profile
**Plans**: TBD

Plans:
- [ ] 05-01: [TBD during planning]

### Phase 6: PDF Generation & Preview
**Goal**: Users can preview tailored CV and download ATS-optimized PDF with contextual filename
**Depends on**: Phase 5
**Requirements**: PREV-01, PREV-02, PREV-03, PREV-04, PREV-05, PREV-06, PREV-07, PREV-08
**Success Criteria** (what must be TRUE):
  1. User sees split-screen preview with AI highlights on left and PDF preview on right
  2. System displays ATS match score showing keyword alignment percentage
  3. User can review all AI changes before downloading PDF
  4. System generates ATS-optimized PDF with single-column layout, standard fonts, and selectable text
  5. System auto-generates contextual filename in format Name_JobTitle_Location.pdf
  6. User can download the generated CV as PDF file
**Plans**: TBD

Plans:
- [ ] 06-01: [TBD during planning]

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Project Setup & Infrastructure | 4/4 | Complete | 2026-02-07 |
| 2. Authentication & Security | 0/7 | Planning complete | - |
| 3. Master Profile Management | 0/0 | Not started | - |
| 4. Job URL Scraping | 0/0 | Not started | - |
| 5. AI CV Generation | 0/0 | Not started | - |
| 6. PDF Generation & Preview | 0/0 | Not started | - |
