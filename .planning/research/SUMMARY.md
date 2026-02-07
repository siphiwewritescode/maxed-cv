# Project Research Summary

**Project:** Maxed-CV - AI-powered CV Tailoring Platform
**Domain:** Resume/CV Builder with AI Optimization and ATS Compatibility
**Researched:** 2026-02-07
**Confidence:** MEDIUM-HIGH

## Executive Summary

Maxed-CV is an AI-powered CV tailoring platform targeting the South African job market. The research validates a clear technical approach: **NestJS backend with Next.js 14+ frontend, PostgreSQL database, Gemini AI for content generation, and queue-based architecture for async processing**. The platform's core differentiator is job URL scraping that automatically extracts requirements and tailors CVs, eliminating the manual copy-paste workflow that plagues existing solutions.

The recommended architecture follows proven patterns for AI-powered document generation: modular backend services coordinated through BullMQ job queues, with PDF generation isolated as an async worker process. The stack is production-ready with high confidence, emphasizing self-hosted Docker deployment, ATS-first PDF templates using @react-pdf/renderer, and Vercel AI SDK for provider-agnostic AI integration. South African market specifics (notice period fields, local terminology, POPIA compliance) require deliberate implementation but are straightforward.

**Critical risks center on three areas:** (1) ATS parsing failures from complex PDF layouts will kill the product instantly - ATS-safe templates must be validated from day one, not retrofitted; (2) Gemini API rate limits (5 RPM on free tier) require queue-based processing architecture from MVP to prevent user-facing failures; (3) Web scraping reliability against anti-bot detection necessitates fallback-first design with manual input always available. POPIA compliance is non-negotiable given South African data privacy enforcement in 2026. These risks are all manageable through proper architecture choices made upfront rather than deferred.

## Key Findings

### Recommended Stack

The research strongly validates the pre-selected core stack (NestJS, Next.js, PostgreSQL, Prisma) with high confidence. Modern resume platforms converge on similar architectures: type-safe backends with ORM abstraction, React-based frontends with SSR for SEO, and relational databases for structured CV data.

**Core technologies:**
- **NestJS 10.x**: Backend API framework - TypeScript-first with modular architecture, excellent dependency injection, scales well for CV generation workflows
- **Next.js 14.x+**: Frontend framework - App Router for SEO (critical for SA job market), server components reduce client bundle, server actions simplify mutations
- **PostgreSQL 15.x+**: Primary database - ACID compliance for CV data integrity, full-text search with BM25 (2026 feature) eliminates Elasticsearch need, JSON support for flexible schemas
- **Prisma 5.x**: ORM and migrations - Type-safe queries prevent runtime errors, schema-first approach, excellent developer experience, no repository pattern needed
- **@react-pdf/renderer 4.3.x**: PDF generation - React-based declarative API produces text-based PDFs natively, naturally enforces single-column ATS-safe layouts, server-side rendering via Node.js
- **Vercel AI SDK (ai + @ai-sdk/google)**: Gemini integration - Provider-agnostic interface (future OpenRouter/OpenAI swaps trivial), streaming support, standardized error handling
- **BullMQ + Redis**: Job queues - Essential for async AI generation and PDF processing, horizontal scaling of workers, retry logic with exponential backoff
- **Docker + Docker Compose**: Containerization - Self-hosted deployment requirement, environment consistency, volume persistence for PDF storage

**Critical stack decisions:**
- **@react-pdf/renderer over Puppeteer**: Puppeteer consumes 200-500MB per PDF and causes memory leaks at scale. @react-pdf/renderer is lightweight, produces ATS-compatible text-based PDFs, and avoids headless browser overhead.
- **Vercel AI SDK over @google/generative-ai**: Multi-provider flexibility future-proofs against API changes, unified interface reduces vendor lock-in, React hooks simplify frontend integration.
- **PostgreSQL FTS over Elasticsearch**: Operational overhead of Elasticsearch unjustified for <1M documents, PostgreSQL BM25 support (2026) handles master profile search adequately, eliminates data duplication and sync complexity.
- **Local filesystem over S3/MinIO**: For self-hosted MVP, Docker volumes with filesystem storage is simplest. MinIO abandoned by maintainers in late 2025. Scale to object storage (Garage, Cloudflare R2) only when distributed deployment needed.

**Version compatibility verified:**
- NestJS 10.x + Prisma 5.x + PostgreSQL 15.x-16.x + Node.js 20.x LTS (HIGH confidence)
- Next.js 14.x+ + React 18.x+ + NextAuth.js 5.x + Node.js 20.x LTS (HIGH confidence, NextAuth v5 requires Next 14+)

### Expected Features

Research reveals clear feature prioritization based on competitive analysis (Rezi, Teal, Resume.io, TailoredCV) and ATS optimization requirements.

**Must have (table stakes):**
- **Master Profile Storage** - Users expect comprehensive profile with work history, education, skills, certifications; SA-specific fields (notice period, languages, driver's license)
- **Professional ATS-Safe Templates** - Single-column, standard fonts, no graphics/tables/columns; competitors have 6-100+ templates but confusion about ATS safety
- **PDF Export (text-based)** - Universal requirement, must be selectable text not images, under 200KB file size, auto-generated contextual filename
- **Real-Time Preview** - Split-screen editing interface is industry standard (Kickresume, Novoresume); users expect live feedback
- **Multiple Resume Versions** - Job seekers tailor CVs for different roles; competitors all offer version management
- **Work Experience & Education Sections** - Standard reverse-chronological format with bullet points, structured input fields

**Should have (competitive advantage):**
- **Job URL Scraping → Auto-Tailoring** - Core differentiator for Maxed-CV; TailoredCV has URL input but not as primary workflow; eliminates manual copy-paste friction
- **Match Score with Breakdown** - Rezi and Teal lead here; shows percentage match (>65% threshold for ATS), identifies missing keywords, builds user confidence
- **AI Bullet Point Optimization** - Rewrites user input with action verbs, quantified metrics, job-aligned keywords; all major competitors offer this
- **SA-Specific Customization** - No major competitor focuses on South African market; local terminology (matric vs high school), POPIA-compliant fields (exclude ID numbers), SA English spelling
- **Real-Time ATS Scoring** - Rezi's killer feature; flags formatting issues live as user edits; requires deeper ATS simulation logic
- **Keyword Gap Analysis** - Visual interface showing missing critical keywords with suggestions for natural incorporation

**Defer (v2+):**
- **Mobile App** - Unclear demand, significant effort; mobile web sufficient for MVP
- **Job Application Tracking** - Teal's differentiator but scope creep; focus on CV quality first
- **Cover Letter Generation** - Adjacent feature, many competitors offer, but defer until CV workflow validated
- **LinkedIn Profile Optimization** - Different product category, requires LinkedIn API access challenges

**Anti-features to avoid:**
- **Overly Creative Templates** - Graphics/columns break ATS parsing (95% auto-rejection rate); provide 1-2 labeled "human review only" templates at most
- **AI "Write Everything for Me"** - Produces generic content, recruiters spot AI writing immediately in 2026; AI must be assistant not replacement
- **Keyword Stuffing** - Modern AI-powered ATS detect manipulation; semantic matching required not keyword lists
- **Social Features** - Scope creep, privacy concerns with CV sharing, not core value proposition

### Architecture Approach

Research strongly recommends **module-based domain isolation with queue-based async processing**. This pattern is proven for AI-powered document generation systems and addresses the domain's specific challenges (long AI processing times, PDF memory issues, rate limits).

**Major components:**
1. **Profile Module (NestJS)** - CRUD operations for master profiles; controller → service → Prisma pattern; stores personal details, work history, education, skills; SA-specific fields (notice period, languages)
2. **Scraper Module (NestJS)** - Job URL extraction service; Cheerio for static boards (Pnet, CareerJunction), Puppeteer for dynamic (LinkedIn); BullMQ queue worker with retry logic; caching layer (24h TTL) for repeated URLs
3. **AI Module (NestJS)** - Gemini API integration for CV tailoring; queue-based async processing (prevents 5-15s request timeouts); prompt engineering for keyword matching and content rewriting; rate limiting built into queue (4 RPM to stay under free tier)
4. **PDF Module (NestJS)** - @react-pdf/renderer for ATS-optimized generation; queue worker to prevent memory issues; stores PDFs in Docker volume filesystem; serves via download endpoint with signed URLs
5. **Frontend (Next.js)** - App Router with Server Components for data fetching; Client Components for interactive forms; Server Actions for mutations (profile CRUD, CV generation); split-screen preview with real-time rendering
6. **Infrastructure Layer** - PostgreSQL for structured CV data; Redis for BullMQ job queues; Docker Compose orchestration; environment-based config (@nestjs/config)

**Sequential job pipeline:**
```
User submits job URL + profile
    ↓
Scraper Queue → Extract job description → Cache result
    ↓
AI Queue → Generate tailored CV content → Store in database
    ↓
PDF Queue → Render ATS-safe PDF → Save to filesystem
    ↓
User polls status → Download PDF
```

**Key architectural patterns:**
- **Thin Controller, Fat Service** - Controllers handle HTTP validation, services contain business logic; standard NestJS pattern for testability
- **Prisma as Data Access Layer** - No repository pattern on top; Prisma is already type-safe abstraction, additional layer adds boilerplate without benefit
- **Queue-Based Async Processing** - BullMQ with Redis for all long-running operations (scraping, AI, PDF); prevents timeouts, enables horizontal scaling, provides retry logic
- **Next.js Server Actions for Mutations** - Reduces client JavaScript, provides progressive enhancement, type-safe API calls; use API routes only for webhooks/external integrations
- **Browser Reuse Pattern (if using Puppeteer)** - Launch browser once at startup, create new pages per request, close immediately; prevents memory leaks from zombie Chrome processes

**What NOT to do (anti-patterns):**
- Synchronous AI generation in API endpoints (timeouts, no retry logic)
- Repository pattern over Prisma (unnecessary abstraction, harder testing)
- Storing PDFs in PostgreSQL BYTEA (database bloat, slow queries, expensive backups)
- Frontend directly calling Gemini API (exposes keys, no rate limiting, tight coupling)
- No request validation (use DTOs with class-validator globally)

### Critical Pitfalls

Research identified 6 critical pitfalls with high-severity impact. These must be addressed in architecture and validated during development.

1. **ATS Parsing Failures from Complex PDF Layouts**
   - **Risk:** Multi-column layouts, tables, graphics cause 40%+ parsing errors; modern ATS improved but still fail on common patterns; automatic rejection even for qualified candidates
   - **Prevention:** Single-column layouts only; standard section headings ("Work Experience" not "My Journey"); text-based PDFs (verify with copy-paste test); test every template through Jobscan/Resume Worded validators before launch; use @react-pdf/renderer which naturally produces ATS-safe output
   - **Phase 1 critical:** Build ATS-first templates from day one; retrofitting visual templates is costly rewrite

2. **AI-Generated Content Sounds Robotic or Hallucinates**
   - **Risk:** Generic hollow tone recruiters recognize; AI fabricates achievements/skills candidate doesn't have; interview disasters or reputation damage
   - **Prevention:** Never generate without user-provided evidence; multi-stage generation (extract facts → enhance only verified data → flag AI additions for approval); low temperature (0.3-0.5); diff view showing changes; disclaimer requiring user review
   - **Phase 2 critical:** Build human oversight into AI workflow architecture; AI is copilot not autopilot

3. **Web Scraping Failures from Anti-Bot Detection**
   - **Risk:** Cloudflare/Akamai fingerprint bots; rate limiting, IP bans, challenge pages; LinkedIn actively blocks scrapers (legal but technically difficult)
   - **Prevention:** Fallback-first design (manual input always available); rate limit 1 req/2-3s per domain; rotating residential proxies for production; Puppeteer-extra stealth plugin; exponential backoff; focus on SA job boards (Pnet, CareerJunction) less aggressive than LinkedIn
   - **Phase 1 critical:** Scraping is optional enhancement not core dependency; manual input must work perfectly

4. **Gemini API Rate Limit Exhaustion**
   - **Risk:** Free tier 5 RPM (down from 10 RPM in Dec 2025); multiple concurrent users hit limits in minutes; 429 errors, "service unavailable"
   - **Prevention:** BullMQ queue with client-side rate limiting (4 RPM leaving buffer); show queue position to users; optimize tokens with context caching (-75% costs); upgrade to Tier 1 ($0 upfront, 150-300 RPM) before public launch; freemium limits (3 CVs/day free users)
   - **Phase 1 critical:** Implement queue + rate limiting from MVP day one; plan Tier 1 upgrade before launch

5. **POPIA/GDPR Non-Compliance with Personal Data**
   - **Risk:** CVs contain sensitive personal info; SA POPIA enforcement fines up to R10M or 10 years imprisonment; data breach or audit reveals violations
   - **Prevention:** Legal review before development; explicit consent for CV data collection; privacy policy in plain language; data minimization (no ID numbers/photos unless essential); encrypt at rest and in transit; retention limits (delete after 12 months inactivity); data subject rights (self-service export/deletion); breach notification (72h)
   - **Phase 0 critical:** Compliance must be in architecture from start; retrofitting is expensive and risky

6. **PDF Generation Memory Leaks and Performance Degradation**
   - **Risk:** Puppeteer consumes 200-500MB per PDF; concurrent load exhausts memory; Node.js crashes; 2s → 30s response times; browser tabs not closed properly
   - **Prevention:** Use @react-pdf/renderer (lightweight) instead of Puppeteer for MVP; if Puppeteer needed: browser reuse pattern, concurrency limits (queue-based), optimization flags (--disable-dev-shm-usage), temp file strategy for large HTML, 2GB RAM minimum for PDF service
   - **Phase 1 critical:** Choose lightweight library for MVP speed; only introduce Puppeteer if quality demands justify complexity

**Additional moderate pitfalls:**
- Generic error messages - users can't self-diagnose (scraping failed vs AI timeout vs PDF error)
- No database indexes - queries slow down after 1,000+ CVs
- Synchronous PDF generation - timeouts under 5-10 concurrent users
- Keyword stuffing - AI over-optimizes for ATS, reads unnaturally to humans
- Storing API keys in env vars visible in logs/traces - security breach risk

## Implications for Roadmap

Based on research findings, the roadmap should follow dependency-driven phasing with ATS compatibility and async architecture as foundational requirements.

### Suggested Phase Structure (5-6 phases)

**Phase 1: Foundation & Master Profile**
- **Rationale:** Database schema and profile CRUD are prerequisites for all other features; can't scrape jobs or generate CVs without user profile data
- **Delivers:** Users can create/edit comprehensive master profiles with SA-specific fields; POPIA-compliant data handling from day one; database schema with proper indexes
- **Technology:** NestJS Profile Module + Prisma + PostgreSQL + Next.js profile forms with React Hook Form + Zod validation
- **Addresses:** Table stakes feature (master profile storage), POPIA compliance pitfall
- **Avoids:** POPIA non-compliance (Phase 0 legal review completed)
- **Validation:** Profile CRUD operations tested, data encryption verified, retention policy implemented
- **Research needed:** Minimal - standard CRUD patterns, Prisma well-documented

**Phase 2: Job URL Scraping & Extraction**
- **Rationale:** Scraping must work before AI tailoring has input data; validates core differentiator (URL → auto-tailor workflow)
- **Delivers:** Users paste job URL, system extracts description, stores with caching (24h TTL); manual input fallback for blocked sites
- **Technology:** NestJS Scraper Module + Cheerio (Pnet, CareerJunction) + Puppeteer-extra stealth (LinkedIn if needed) + BullMQ queue + Redis
- **Addresses:** Differentiator feature (job URL scraping), scraping reliability pitfall
- **Avoids:** Anti-bot detection failures (fallback-first architecture, rate limiting, manual input always available)
- **Validation:** Test scraping on 5 major SA job boards, verify fallback triggers correctly on 403/429 errors, test cache hit/miss
- **Research needed:** **HIGH** - Site-specific anti-bot techniques for Indeed, LinkedIn, Glassdoor; SA job board (Pnet, Careers24) scraping patterns

**Phase 3: AI Content Generation**
- **Rationale:** Depends on profile data (Phase 1) and job requirements (Phase 2); core value proposition unlocks here
- **Delivers:** Gemini API integration generates tailored CV content from profile + job description; queue-based async processing; diff view shows AI changes for user approval
- **Technology:** NestJS AI Module + Vercel AI SDK + @ai-sdk/google + BullMQ AI queue + prompt engineering + rate limiting (4 RPM)
- **Addresses:** Differentiator feature (auto-tailoring), match score calculation
- **Avoids:** Rate limit exhaustion (queue + 4 RPM throttling), AI hallucinations (low temperature 0.3-0.5, fact-checking layer, human approval required)
- **Validation:** Load test 10 concurrent requests stay under rate limit, review 20 generated CVs for hallucinations, verify diff view highlights changes
- **Research needed:** **MEDIUM** - Prompt engineering for SA job market tone/terminology; balancing ATS optimization vs natural language

**Phase 4: ATS-Safe PDF Generation**
- **Rationale:** Depends on CV content from Phase 3; final deliverable users need for job applications
- **Delivers:** Queue-based PDF generation with @react-pdf/renderer; single ATS-optimized template; text-based PDFs with contextual filenames; download endpoint
- **Technology:** NestJS PDF Module + @react-pdf/renderer + BullMQ PDF queue + Docker volume storage + filename generation
- **Addresses:** Table stakes feature (PDF export), ATS compatibility
- **Avoids:** ATS parsing failures (single-column template, standard fonts, text-based output validated via copy-paste test), memory leaks (lightweight library, queue-based processing)
- **Validation:** Test generated PDFs through Jobscan/Resume Worded (>70% ATS score), verify text selectability, load test 10 concurrent PDF generations
- **Research needed:** **LOW** - @react-pdf/renderer well-documented, ATS requirements clear from research

**Phase 5: Preview, Status & Polish**
- **Rationale:** Usability enhancements after core workflow (Phases 1-4) functional; improves UX without blocking MVP
- **Delivers:** Split-screen live preview matching final PDF; job status polling ("Scraping... Tailoring... Generating PDF..."); match score percentage with keyword breakdown; error handling with actionable messages
- **Technology:** Next.js Client Components for preview rendering, status polling via SWR, match score calculation service, user-facing error messages
- **Addresses:** Table stakes feature (real-time preview), UX pitfalls (no status indication, generic errors)
- **Avoids:** User confusion about processing state, inability to self-diagnose failures
- **Validation:** Preview matches PDF exactly (pixel comparison), all error paths have user-facing messages, status polling updates every 2s
- **Research needed:** **LOW** - Standard React patterns

**Phase 6: Authentication & Freemium**
- **Rationale:** Can be deferred until Phases 1-5 deliver testable product; enables monetization and access control
- **Delivers:** User registration/login with NextAuth.js v5; freemium limits (3 CVs/day free, unlimited paid); JWT authentication on backend; rate limiting per user
- **Technology:** NextAuth.js 5.x + @nestjs/passport + @nestjs/jwt + bcrypt + @nestjs/throttler
- **Addresses:** Business model enablement, API abuse prevention
- **Avoids:** Freemium abuse (rate limiting, quota enforcement)
- **Validation:** Login flow tested, freemium limits enforced, JWT validation working
- **Research needed:** **LOW** - NextAuth v5 documented (though ecosystem transitional), NestJS Passport standard pattern

### Phase Ordering Rationale

**Dependency-driven sequencing:**
- Profile → Scraping → AI → PDF follows natural data flow (profile provides context, scraping provides job requirements, AI generates content, PDF renders output)
- Each phase depends on previous phase's output; can't skip or reorder without breaking dependencies
- Authentication deferred to Phase 6 because MVP can work with single test user; business logic more important than access control for validation

**Risk mitigation prioritization:**
- POPIA compliance baked into Phase 1 (foundation) not retrofitted later
- ATS compatibility validated in Phase 4 before adding templates/features
- Queue architecture introduced in Phase 2 (scraping) and reused in Phases 3-4, establishing pattern early
- Fallback-first design for scraping (Phase 2) prevents dependency on unreliable third parties

**Parallel work opportunities:**
- Frontend and backend can develop in parallel from Phase 1 onward (Profile Module backend while building profile forms frontend)
- Phase 2 Scraper Module independent, can be separate developer
- Phase 4 PDF module development can start while Phase 3 AI prompts refined

**Incremental value delivery:**
- Phase 1: Users can manage profiles (tangible but not full value)
- Phase 2: Users can extract job requirements (validates scraping approach)
- Phase 3: Users see AI-tailored content (core value unlocked)
- Phase 4: Users download PDFs (complete workflow)
- Phase 5: UX improvements (refinement)
- Phase 6: Access control + monetization (business model)

### Research Flags

**Phases requiring deeper research during planning:**

- **Phase 2 (Job Scraping):** HIGH priority - Each job site uses different anti-bot techniques; need targeted research on Indeed, LinkedIn, Glassdoor selectors and fingerprinting; SA-specific boards (Pnet, Careers24, CareerJunction) need validation for anti-scraping measures
- **Phase 3 (AI Content):** MEDIUM priority - Prompt engineering for SA job market tone/terminology needs validation; generic prompts may sound off for SA professional norms; temperature tuning to balance ATS optimization vs natural language

**Phases with standard patterns (skip research-phase):**

- **Phase 1 (Profile CRUD):** Well-documented NestJS + Prisma patterns, no domain-specific complexity
- **Phase 4 (PDF Generation):** @react-pdf/renderer documented, ATS requirements clear from current research
- **Phase 5 (Preview/Polish):** Standard React patterns
- **Phase 6 (Authentication):** NestJS Passport + NextAuth well-documented (though NextAuth v5 ecosystem transitional, sufficient docs exist)

**Topics needing validation during execution:**

- ATS compatibility testing - Test generated PDFs against real ATS systems (Workday, Greenhouse) used in SA market during Phase 4
- Gemini prompt engineering - SA job market specifics need real-world validation during Phase 3
- Job board scraping - Anti-scraping measures evolve; monitor success rates and adapt during Phase 2

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| **Stack** | **HIGH** | Core choices (NestJS, Next.js, PostgreSQL, Prisma) validated through official docs and 2026 industry patterns; @react-pdf/renderer verified for ATS compatibility; Vercel AI SDK officially supported by Google; Docker self-hosting well-documented |
| **Features** | **MEDIUM-HIGH** | Competitive analysis across 4+ major platforms (Rezi, Teal, Resume.io, TailoredCV) shows clear feature expectations; ATS requirements verified through multiple 2026 sources; SA-specific needs inferred from CV format guides (some data limited) |
| **Architecture** | **HIGH** | Module-based domain isolation + queue-based async processing is proven pattern for AI document generation; verified through official NestJS/BullMQ docs, Azure/AWS architecture guides, multiple implementation examples; sequential job pipeline pattern well-established |
| **Pitfalls** | **MEDIUM-HIGH** | ATS parsing issues extensively documented; AI hallucination prevention strategies verified; web scraping anti-bot techniques current as of 2026; Gemini rate limits official from Google docs; POPIA requirements from official sources; PDF memory issues verified through GitHub issues/articles |

**Overall confidence: MEDIUM-HIGH**

The research provides strong foundation for roadmap creation. Core technology choices validated through official sources and industry consensus. Feature prioritization backed by competitive analysis. Architecture patterns proven for this domain. Pitfalls identified with concrete prevention strategies.

### Gaps to Address

**Gaps requiring attention during planning/execution:**

1. **SA job board scraping specifics** - Research focused on global platforms (LinkedIn, Indeed); Pnet, Careers24, CareerJunction anti-scraping measures need validation during Phase 2 implementation; mitigation: start with manual input, add scraping incrementally per board

2. **NextAuth.js v5 developer experience** - Documentation improving but ecosystem knowledge transitional (v4 → v5 migration); team feedback during Phase 6 will inform if custom JWT solution better; mitigation: plan 20% buffer time for auth integration

3. **SA ATS market share** - Research identified major ATS systems (Workday, Greenhouse, Taleo) but SA company usage distribution unclear; affects testing priority; mitigation: test against all three major systems, gather user feedback on which systems they encounter

4. **Gemini API cost modeling at scale** - Free tier limits understood, but actual token usage per CV tailoring needs measurement; affects pricing strategy; mitigation: implement token counting from Phase 3, project costs based on real usage after 100 CVs generated

5. **POPIA SA-specific nuances** - General POPIA requirements researched, but HR/recruitment data may have specific requirements; mitigation: legal review before Phase 1, audit after Phase 6

6. **PDF ATS compatibility edge cases** - Single-column layouts validated, but some ATS systems may have additional quirks; mitigation: test against real ATS systems during Phase 4, gather user feedback on application success rates

**How to handle during roadmap execution:**

- **Validation checkpoints:** Each phase includes validation criteria that tests assumptions (e.g., "Test scraping on 5 SA job boards" in Phase 2)
- **Iteration budget:** Plan 15-20% time buffer per phase for addressing discovered gaps
- **User feedback loops:** After Phase 4 (MVP complete), gather feedback on ATS success rates, AI quality, scraping reliability
- **Monitoring instrumentation:** Track scraping success rates, AI token usage, PDF generation times from Phase 2+ to validate assumptions with data

## Sources

### Primary (HIGH confidence)

**Official Documentation:**
- [NestJS Official Docs](https://docs.nestjs.com/) - Module architecture, Prisma integration, authentication patterns
- [Next.js 14 Official Docs](https://nextjs.org/docs) - App Router, Server Components, Server Actions, self-hosting
- [Prisma Official Docs](https://www.prisma.io/docs) - Schema design, migrations, connection pooling
- [Vercel AI SDK Docs](https://ai-sdk.dev/docs/introduction) - Gemini integration, streaming, structured outputs
- [Gemini API Rate Limits](https://ai.google.dev/gemini-api/docs/rate-limits) - Official quotas, tier pricing
- [React-PDF Official Docs](https://react-pdf.org/) - PDF generation, ATS-compatible output
- [BullMQ Official Docs](https://docs.bullmq.io/) - Queue patterns, NestJS integration

**Stack Research (STACK.md):**
- Multiple 2026-current sources validating technology choices
- ATS compatibility verified through Jobscan, Resume.io, SmallPDF guides
- PDF generation library comparisons (LogRocket, PDFBolt)
- PostgreSQL FTS capabilities (ParadeDB, TigerData 2026 analysis)

**Features Research (FEATURES.md):**
- Competitive analysis: Rezi, Teal, Resume.io, TailoredCV, Novoresume
- ATS requirements from 8+ sources (Resume.io, Jobscan, CVAnywhere, ResumeAdapter, Scale.jobs)
- SA CV format guides (MyPerfectCV, Dan&Ata Talent, SA Government)

**Architecture Research (ARCHITECTURE.md):**
- NestJS architecture patterns (Level Up Coding, Medium articles)
- BullMQ integration guides (Medium, official docs)
- AI system design patterns (Zen van Riel, AWS, Azure architecture centers)
- PDF generation architecture (Medium scalability guides)

**Pitfalls Research (PITFALLS.md):**
- ATS pitfalls from EliteResumes, CareerFlow, OwlApply, DistinctiveWeb
- AI hallucination prevention (AIApply, Inc.com, Blockchain.news)
- Web scraping anti-bot detection (ZenRows, ScrapingBee, Medium)
- POPIA compliance (POPIA.co.za, SecurePrivacy, CaptainCompliance)

### Secondary (MEDIUM confidence)

**Implementation Examples:**
- Gemini + NestJS integration (Medium articles)
- Next.js + NestJS monorepo deployment (DEV Community)
- Puppeteer optimization for PDF (GitHub issues, Medium)

**Industry Analysis:**
- Resume builder feature comparisons (Kickresume, BeamJobs, Uppl.ai)
- Resume mistakes and anti-features (Teal, Medium, ResumeShaper)
- Freemium abuse prevention (ALOA, DigitalAPI)

### Tertiary (LOW confidence, needs validation)

**SA Market Specifics:**
- South African job board anti-scraping measures (inferred, needs validation)
- SA ATS system market share (inferred from global patterns, needs validation)
- SA professional tone preferences (assumed similar to UK English, needs validation)

---

*Research completed: 2026-02-07*
*Ready for roadmap: Yes*
*Next step: Roadmap creation with phase breakdown and task definition*
