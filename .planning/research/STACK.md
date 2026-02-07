# Technology Stack Research

**Project:** Maxed-CV - AI-powered CV Tailoring Platform
**Domain:** Resume/CV Builder with AI Optimization and ATS Compatibility
**Researched:** 2026-02-07
**Confidence:** MEDIUM-HIGH

## Core Stack (Pre-Selected)

| Technology | Version | Purpose | Rationale |
|------------|---------|---------|-----------|
| NestJS | 10.x | Backend API framework | TypeScript-first, modular architecture, excellent DI system, scales well |
| Next.js | 14.x+ | Frontend framework | React-based, App Router for SEO, server components, South African market needs strong SEO |
| PostgreSQL | 15.x+ | Primary database | ACID compliance, full-text search (FTS) with BM25 via pg_textsearch, JSON support for flexible schemas |
| Prisma | 5.x | ORM and migrations | Type-safe queries, excellent DX, schema-first approach, migration management |
| Docker | 24.x | Containerization | Self-hosted deployment requirement, environment consistency |

## PDF Generation (ATS-Compatible)

**CRITICAL REQUIREMENT:** ATS systems require text-based, single-column PDFs without images, tables, or text boxes.

| Library | Version | Purpose | Why Recommended | Confidence |
|---------|---------|---------|-----------------|------------|
| @react-pdf/renderer | 4.3.x | Server-side PDF generation | React-based declarative API, Node.js support via `renderToStream/renderToFile`, produces text-based PDFs, excellent for single-column layouts | HIGH |
| PDFKit | 0.15.x | Alternative/fallback PDF generation | Low-level control, lightweight, no headless browser overhead, font embedding, proven for professional documents | MEDIUM |

### What NOT to Use for PDF Generation

| Avoid | Why | Impact |
|-------|-----|--------|
| Puppeteer/Playwright for CVs | 20-40% slower than PDFKit, high memory usage (headless browser), overkill for structured documents | Performance bottleneck at scale, unnecessary resource consumption |
| jsPDF | CVE-2025-68428 path traversal vulnerability in pre-4.0 versions, less mature than alternatives | Security risk if not carefully managed |
| HTML-to-PDF via screenshots | Produces image-based PDFs that ATS cannot parse | Zero ATS compatibility - deal breaker |

### ATS Compatibility Requirements (Verified 2026)

Based on current ATS standards (Workday, Greenhouse, LinkedIn):

- **Single-column layout** - Modern ATS can read columns but single-column reduces parsing errors by 40%+
- **Text-based PDFs** - All content must be selectable/copyable (verify with copy-paste test)
- **No images, icons, or graphics** in content areas
- **No tables or text boxes** - Use plain text with bullet points
- **Standard fonts** - Arial, Calibri, Helvetica (10-12pt, headings 12-14pt)
- **Left-aligned text** with standard section headings

**Recommendation:** Use `@react-pdf/renderer` as primary engine. Its React-based component model naturally enforces single-column layouts and produces clean, text-based PDFs. PDFKit as fallback for edge cases requiring low-level control.

## AI Integration (Gemini)

| Library | Version | Purpose | Why Recommended | Confidence |
|---------|---------|---------|-----------------|------------|
| @ai-sdk/google | 1.x | Gemini API integration | Vercel AI SDK provides unified interface across providers, streaming support, function calling, easy provider switching | HIGH |
| ai | 4.x | AI SDK Core | Unified API for text generation, structured outputs, tools/function calling, framework-agnostic | HIGH |

### Installation
```bash
npm install ai @ai-sdk/google
```

### Alternative Approach
```bash
npm install @google/generative-ai
```

**Rationale for Vercel AI SDK:** While `@google/generative-ai` is the official SDK, Vercel AI SDK provides:
- Unified interface (future OpenRouter support becomes trivial)
- Built-in streaming and React hooks (for Next.js frontend)
- Standardized error handling
- Model-agnostic code (swap providers with 2-line change)

**Confidence:** HIGH - Official Vercel + Google integration, well-documented, active maintenance

## Web Scraping (Job Descriptions)

| Library | Version | Purpose | When to Use | Confidence |
|---------|---------|---------|-------------|------------|
| Cheerio | 1.0.x | HTML parsing for static content | Pnet, static job boards (10x faster than Puppeteer) | HIGH |
| Puppeteer | 23.x | Headless browser for dynamic content | LinkedIn (JavaScript-rendered content) | MEDIUM |
| Axios | 1.7.x | HTTP client | Fetching HTML before parsing with Cheerio | HIGH |

### Strategy

**For Static Job Boards (Pnet, CareerJunction):**
```
Axios (fetch HTML) -> Cheerio (parse DOM) -> Extract job description
```
- **Performance:** 5-10ms for simple queries
- **Memory:** Lightweight, ~10MB per scrape
- **Complexity:** Low

**For Dynamic Job Boards (LinkedIn):**
```
Puppeteer (render page) -> Wait for selectors -> Extract content
```
- **Performance:** 20-40% slower than Cheerio
- **Memory:** ~100MB per browser instance
- **Complexity:** Medium (anti-scraping measures)

### Legal Considerations (FLAGGED)

**WARNING:** LinkedIn actively blocks scrapers and it violates their ToS. While LinkedIn vs HiQ (2019) ruled scraping public data is legal, LinkedIn uses aggressive anti-scraping:
- Rate limiting
- CAPTCHA challenges
- IP blocking

**Mitigation:**
- Use rotating proxies (ScraperAPI, Bright Data)
- Implement exponential backoff
- Consider LinkedIn Jobs API (Proxycurl) as paid alternative
- Focus on South African job boards (Pnet, CareerJunction) which are less aggressive

**Confidence:** MEDIUM - Technical implementation is straightforward, but operational reliability for LinkedIn is LOW without proxy infrastructure.

## Authentication

### Backend (NestJS)

| Library | Version | Purpose | Why Recommended | Confidence |
|---------|---------|---------|-----------------|------------|
| @nestjs/passport | 10.x | Authentication middleware integration | Official NestJS package, plug-and-play architecture | HIGH |
| @nestjs/jwt | 10.x | JWT token handling | Official NestJS package, seamless integration | HIGH |
| passport | 0.7.x | Authentication strategies | Industry standard, supports JWT/OAuth/Local | HIGH |
| passport-jwt | 4.0.x | JWT strategy for Passport | Standard JWT authentication pattern | HIGH |
| bcrypt | 5.x | Password hashing | Industry standard, secure salt rounds | HIGH |

### Frontend (Next.js)

| Library | Version | Purpose | Why Recommended | Confidence |
|---------|---------|---------|-----------------|------------|
| NextAuth.js (Auth.js) | 5.x | Session management | Next.js 14 App Router support, code-first flexibility, supports credentials + OAuth | MEDIUM |

**Note on NextAuth.js v5:** Major rewrite with Next.js 14+ support. Requires App Router. Documentation is improving but still in transition from v4. Consider as "toolkit you assemble" rather than "product you adopt."

**Alternative:** Roll your own with `@nestjs/jwt` on backend + localStorage/cookies on frontend if NextAuth.js feels too heavyweight.

**Confidence:** MEDIUM - NextAuth.js v5 is stable but ecosystem knowledge is transitional. Backend JWT implementation is HIGH confidence.

## File Storage

| Approach | Technology | Purpose | Why Recommended | Confidence |
|----------|-----------|---------|-----------------|------------|
| Local Filesystem | Node.js `fs` module | PDF storage for self-hosted deployment | Simplest solution for single-node, Docker volumes provide persistence | HIGH |
| Multer | 1.4.x | File upload handling | NestJS-native integration via `@nestjs/platform-express`, well-documented | HIGH |

### What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| MinIO | Project abandoned by maintainers in late 2025, commercial pivot away from community | Local filesystem (single-node) or Garage (distributed) |
| AWS S3 | Self-hosted requirement, vendor lock-in, unnecessary complexity for early stages | Local filesystem with Docker volumes |

### Storage Strategy

**Phase 1 (MVP):**
- Store PDFs in `/app/storage/cvs/{userId}/{cvId}.pdf`
- Use Docker volumes to persist across container restarts
- Store file metadata (path, size, created_at) in PostgreSQL via Prisma

**Phase 2 (Scale):**
- If distributed storage needed, consider Garage (MinIO alternative)
- Or migrate to cloud (Cloudflare R2, Backblaze B2) if scaling beyond single-node

**Rationale:** Premature optimization. Local filesystem is reliable, simple, and fits self-hosted Docker requirement. Scale later if needed.

**Confidence:** HIGH for Phase 1, MEDIUM for Phase 2 (scaling path TBD)

## Database & Search

| Technology | Version | Purpose | Why Recommended | Confidence |
|------------|---------|---------|-----------------|------------|
| PostgreSQL | 15.x+ | Primary database | Already chosen, excellent FTS capabilities | HIGH |
| pg_textsearch | Built-in | Full-text search with BM25 | BM25 now in Postgres (2026), eliminates need for Elasticsearch for small-to-medium apps | MEDIUM-HIGH |

### What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| Elasticsearch | Operational overhead (separate cluster), data duplication, sync complexity, overkill for <1M documents | PostgreSQL FTS with GIN indexes |
| MongoDB | Relational data (users, profiles, CVs, jobs), ACID requirements | PostgreSQL |

### Search Strategy

**MVP Approach:**
- Use PostgreSQL `tsvector` and `tsquery` for master profile search
- GIN indexes on searchable text columns
- 5-10ms query times for ~100K documents (acceptable for MVP)

**When to Consider Elasticsearch:**
- >10M documents
- Advanced ML-based search ranking needed
- Real-time search across massive datasets

**Current verdict:** PostgreSQL FTS is sufficient. Re-evaluate at 100K+ users.

**Confidence:** HIGH - Based on 2026 PostgreSQL FTS improvements (BM25 support via pg_textsearch)

## Development Tools

| Tool | Purpose | Why Recommended | Confidence |
|------|---------|-----------------|------------|
| ESLint | Linting | TypeScript + NestJS/Next.js configs, enforce code quality | HIGH |
| Prettier | Code formatting | Consistent style across team | HIGH |
| Husky | Git hooks | Pre-commit linting, prevent bad commits | HIGH |
| Docker Compose | Local development | Orchestrate NestJS + Next.js + PostgreSQL + pgAdmin | HIGH |
| pgAdmin | Database GUI | Visualize schema, debug queries (dev only) | MEDIUM |
| Postman/Insomnia | API testing | Test NestJS endpoints during development | MEDIUM |

## Supporting Libraries

### Backend (NestJS)

| Library | Version | Purpose | When to Use | Confidence |
|---------|---------|---------|-------------|------------|
| class-validator | 0.14.x | DTO validation | Validate incoming requests, enforce data integrity | HIGH |
| class-transformer | 0.5.x | Object transformation | Transform plain objects to class instances | HIGH |
| helmet | 8.x | Security headers | Production security (CSP, HSTS, etc.) | HIGH |
| @nestjs/throttler | 6.x | Rate limiting | Prevent abuse of API endpoints | HIGH |
| @nestjs/config | 3.x | Environment variables | Type-safe config management | HIGH |
| cors | 2.x | CORS handling | Allow Next.js frontend to call NestJS backend | HIGH |

### Frontend (Next.js)

| Library | Version | Purpose | When to Use | Confidence |
|---------|---------|---------|-------------|------------|
| Tailwind CSS | 4.x | Styling | Utility-first CSS, excellent DX, modern South African market expects polished UI | HIGH |
| Zod | 3.x | Schema validation | Client-side validation, type-safe forms, pairs well with React Hook Form | HIGH |
| React Hook Form | 7.x | Form management | Complex forms (Master Profile), excellent DX | HIGH |
| SWR or TanStack Query | Latest | Data fetching | Client-side data caching, optimistic updates | MEDIUM |

## Installation Scripts

### Backend (NestJS)

```bash
# Core framework
npm install @nestjs/common @nestjs/core @nestjs/platform-express

# Database
npm install @prisma/client
npm install -D prisma

# Authentication
npm install @nestjs/passport @nestjs/jwt passport passport-jwt bcrypt
npm install -D @types/passport-jwt @types/bcrypt

# AI Integration
npm install ai @ai-sdk/google

# PDF Generation
npm install @react-pdf/renderer
npm install pdfkit  # Fallback/alternative

# Web Scraping
npm install cheerio axios
npm install puppeteer  # Only if LinkedIn scraping needed

# File Upload
npm install multer
npm install -D @types/multer

# Utilities
npm install class-validator class-transformer
npm install @nestjs/config
npm install helmet
npm install @nestjs/throttler

# Dev tools
npm install -D @nestjs/cli
npm install -D eslint prettier
npm install -D husky
```

### Frontend (Next.js)

```bash
# Core framework (created via create-next-app)
npx create-next-app@latest maxed-cv-frontend --typescript --tailwind --app

# Forms & Validation
npm install react-hook-form zod @hookform/resolvers

# Authentication
npm install next-auth@beta  # v5 for Next.js 14+

# Data Fetching
npm install swr
# OR
npm install @tanstack/react-query

# PDF Viewer (optional - for previewing CVs in browser)
npm install react-pdf

# Dev tools
npm install -D eslint prettier
```

## Alternatives Considered

| Category | Recommended | Alternative | When to Use Alternative | Confidence |
|----------|-------------|-------------|------------------------|------------|
| PDF Generation | @react-pdf/renderer | PDFKit | Need low-level control, complex graphics | MEDIUM |
| AI SDK | Vercel AI SDK | @google/generative-ai | Want official Google SDK, no multi-provider plans | HIGH |
| Web Scraping | Cheerio | Puppeteer | All job boards are JavaScript-heavy | MEDIUM |
| Authentication (Backend) | Passport + JWT | Custom JWT | Very simple use case, want zero dependencies | HIGH |
| Authentication (Frontend) | NextAuth.js v5 | Custom implementation | NextAuth.js too complex, want full control | MEDIUM |
| File Storage | Local filesystem | MinIO/Garage | Need distributed storage from day 1 | LOW (MinIO abandoned) |
| Search | PostgreSQL FTS | Elasticsearch | >10M documents, advanced ML ranking | MEDIUM |
| Form Management | React Hook Form | Formik | Team prefers Formik, existing Formik experience | MEDIUM |

## Version Compatibility Matrix

| NestJS | Prisma | PostgreSQL | Node.js | Confidence |
|--------|--------|------------|---------|------------|
| 10.x | 5.x | 15.x - 16.x | 20.x LTS | HIGH |

| Next.js | React | NextAuth.js | Node.js | Confidence |
|---------|-------|-------------|---------|------------|
| 14.x+ | 18.x+ | 5.x (beta) | 20.x LTS | HIGH |

**Critical Compatibility Note:** NextAuth.js v5 requires Next.js 14+. If using Next.js 13, use NextAuth.js v4.

## Stack Patterns by Variant

### If scaling beyond single-node deployment

**Current:** Local filesystem for PDFs
**Change to:** Garage (MinIO successor) or Cloudflare R2 (S3-compatible, no egress fees)
**Rationale:** Distributed storage for horizontal scaling

### If LinkedIn scraping proves unreliable

**Current:** Puppeteer-based scraping
**Change to:** Proxycurl Jobs API (paid service, $0.001/request)
**Rationale:** Legal compliance, no anti-scraping battles, reliable data

### If job description parsing needs improvement

**Current:** Manual text extraction
**Add:** OpenAI GPT-4 or Gemini structured output mode
**Rationale:** Extract job requirements as JSON (title, skills, responsibilities, qualifications)

### If SEO becomes critical earlier than expected

**Current:** Next.js App Router with SSR
**Enhance:** Add OpenGraph tags, JSON-LD structured data, sitemap generation
**Rationale:** South African job market is competitive, early SEO advantage matters

## Docker Compose Setup

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_USER: maxedcv
      POSTGRES_PASSWORD: dev_password
      POSTGRES_DB: maxedcv_dev
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./backend
    ports:
      - "3001:3001"
    depends_on:
      - postgres
    environment:
      DATABASE_URL: postgresql://maxedcv:dev_password@postgres:5432/maxedcv_dev
      JWT_SECRET: dev_secret_change_in_production
      GEMINI_API_KEY: ${GEMINI_API_KEY}
    volumes:
      - ./backend:/app
      - /app/node_modules
      - cv_storage:/app/storage/cvs

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:3001
    volumes:
      - ./frontend:/app
      - /app/node_modules
      - /app/.next

volumes:
  postgres_data:
  cv_storage:
```

## Production Considerations

### Security Checklist

- [ ] Use Helmet for security headers
- [ ] Enable CORS with specific origins (not `*`)
- [ ] Implement rate limiting via @nestjs/throttler
- [ ] Store secrets in environment variables (never in code)
- [ ] Use bcrypt with 10+ salt rounds for password hashing
- [ ] Validate all inputs with class-validator
- [ ] Sanitize file uploads (check mimetype, size, scan for malware)
- [ ] Use HTTPS in production (Let's Encrypt)
- [ ] Implement CSRF protection for state-changing operations

### Performance Checklist

- [ ] Use GIN indexes on PostgreSQL FTS columns
- [ ] Implement pagination for large result sets
- [ ] Cache frequently accessed data (SWR on frontend, Redis optional on backend)
- [ ] Use Next.js Image component for optimized images
- [ ] Enable gzip compression on NestJS
- [ ] Use Next.js `output: "standalone"` for smaller Docker images
- [ ] Lazy-load Puppeteer only when LinkedIn scraping is requested
- [ ] Stream PDFs to client instead of buffering in memory

### Monitoring (Future)

- [ ] Add logging (Winston or Pino)
- [ ] Implement health checks (`/health` endpoint)
- [ ] Track PDF generation time (alert if >5s)
- [ ] Monitor database query performance (Prisma logging)
- [ ] Track AI API usage and costs

## Sources

### PDF Generation & ATS Compatibility
- [Resume Columns & ATS 2026](https://yotru.com/blog/resume-columns-ats-single-vs-double-column) - ATS compatibility guidelines
- [Can ATS Read PDF Resumes in 2026?](https://smallpdf.com/blog/do-applicant-tracking-systems-prefer-resumes-in-pdf-format) - PDF format requirements
- [PDFKit vs Puppeteer Comparison](https://blog.logrocket.com/best-html-pdf-libraries-node-js/) - Performance analysis
- [Top PDF Generation Libraries 2025](https://pdfbolt.com/blog/top-nodejs-pdf-generation-libraries) - Library comparison
- [React-PDF Official Docs](https://react-pdf.org/) - Technical capabilities
- [PDFKit Official Docs](https://pdfkit.org/) - Technical capabilities

### AI Integration (Gemini)
- [Integrating Gemini AI with NestJS](https://medium.com/@arisarisyi/integrating-gemini-ai-with-nestjs-a-quick-start-guide-4b52a36e5c0d) - Implementation guide
- [Vercel AI SDK Official Docs](https://ai-sdk.dev/docs/introduction) - Official documentation
- [Market Research Agent with Gemini](https://ai.google.dev/gemini-api/docs/vercel-ai-sdk-example) - Google official example
- [Vercel AI SDK Google Package](https://www.npmjs.com/package/@ai-sdk/google) - Package documentation

### Web Scraping
- [Cheerio vs Puppeteer 2026](https://proxyway.com/guides/cheerio-vs-puppeteer-for-web-scraping) - Performance comparison
- [LinkedIn Jobs Scraper](https://github.com/llorenspujol/linkedin-jobs-scraper) - Implementation reference
- [Is Cheerio faster than Puppeteer?](https://www.scrapingbee.com/webscraping-questions/cheerio/is-cheerio-faster-than-puppeteer/) - Performance data

### Authentication
- [NestJS Official Authentication Docs](https://docs.nestjs.com/security/authentication) - Official guide
- [NextAuth.js v5 Migration](https://authjs.dev/getting-started/migrating-to-v5) - v5 changes
- [Top Authentication Solutions 2026](https://workos.com/blog/top-authentication-solutions-nextjs-2026) - Ecosystem overview

### File Storage
- [Alternatives to MinIO](https://rmoff.net/2026/01/14/alternatives-to-minio-for-single-node-local-s3/) - MinIO abandonment, alternatives
- [NestJS File Upload with Multer](https://www.freecodecamp.org/news/how-to-handle-file-uploads-in-nestjs-with-multer/) - Implementation guide

### Database & Search
- [PostgreSQL vs Elasticsearch 2026](https://www.paradedb.com/blog/elasticsearch_vs_postgres) - Performance comparison
- [It's 2026, Just Use Postgres](https://www.tigerdata.com/blog/its-2026-just-use-postgres) - BM25 in PostgreSQL

### Docker & Infrastructure
- [Dockerizing NestJS with Prisma and PostgreSQL](https://notiz.dev/blog/dockerizing-nestjs-with-prisma-and-postgresql/) - Setup guide
- [NestJS + Redis + Postgres Docker Compose](https://www.tomray.dev/nestjs-docker-compose-postgres) - Configuration examples

---

**Research Confidence Assessment:**

| Area | Confidence | Rationale |
|------|------------|-----------|
| PDF Generation | MEDIUM-HIGH | @react-pdf/renderer verified via official docs, ATS requirements verified via multiple 2026 sources, PDFKit as proven fallback |
| AI Integration | HIGH | Vercel AI SDK + Gemini officially supported, multiple implementation examples, active ecosystem |
| Web Scraping | MEDIUM | Technical implementation clear, but LinkedIn anti-scraping is operational risk |
| Authentication | HIGH | NestJS Passport pattern is industry standard, NextAuth.js v5 is stable but ecosystem transitional |
| File Storage | HIGH | Local filesystem for MVP is proven pattern, Docker volumes well-understood |
| Database & Search | HIGH | PostgreSQL FTS with BM25 verified for 2026, Prisma is stable |
| Overall Stack | MEDIUM-HIGH | Core choices are solid, some operational unknowns (LinkedIn scraping, NextAuth.js v5 DX) |

**Open Questions for Phase-Specific Research:**

1. LinkedIn scraping reliability - May need deeper research on proxy infrastructure or pivot to Proxycurl API
2. NextAuth.js v5 DX - Team feedback during implementation will inform if custom solution is better
3. PDF ATS compatibility testing - Need to test generated PDFs against real ATS systems (Workday, Greenhouse)
4. Gemini prompt engineering - Job description parsing quality needs validation
5. South African job board scraping - Need to survey Pnet, CareerJunction anti-scraping measures

---

*Stack research for: AI-powered CV/Resume Builder Platform*
*Researched: 2026-02-07*
*Mode: Ecosystem Research - Stack Dimension*
