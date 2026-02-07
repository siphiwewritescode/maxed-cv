# Maxed-CV

## What This Is

Maxed-CV is an AI-powered CV tailoring platform designed specifically for the South African job market. Users store a comprehensive "Master Profile" containing their experience, skills, and projects, then simply paste a job URL (from LinkedIn, Pnet, etc.) to receive an ATS-optimized, tailored CV in seconds. The platform uses AI to scrape job requirements and intelligently reframe the user's experience to match, applying SA English language standards and modern privacy practices (excluding sensitive data like ID numbers).

## Core Value

Eliminate the friction of manual CV tailoring that causes talented South African professionals to lose momentum in a highly competitive job market, ensuring every applicant has the best possible chance of passing ATS filters and reaching human recruiters.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] User can create an account and log in securely
- [ ] User can create and edit a Master Profile (personal details, work experience, skills, projects, education, certifications)
- [ ] Master Profile includes SA-specific fields (city location, notice period, language proficiencies)
- [ ] User can paste a job URL and system scrapes the job description
- [ ] AI identifies key requirements from job description (keywords, skills, experience)
- [ ] AI generates tailored CV by prioritizing relevant experience and optimizing bullet points
- [ ] AI applies SA English language standards to all content
- [ ] User sees split-screen preview (AI highlights on left, PDF preview on right)
- [ ] System generates ATS-optimized PDF with single-column layout
- [ ] System auto-generates contextual filename (e.g., Name_JobTitle_Location.pdf)
- [ ] User can download the generated CV as PDF
- [ ] Freemium model: Free tier with usage limits, paid tier for unlimited access

### Out of Scope

- **Cover letter generation** — Focus on CV tailoring only for v1
- **Application tracking** — Don't track which jobs user applied to or application status
- **Multi-user/team accounts** — Single user accounts only, no company/team features
- **Job search/discovery features** — Users find jobs themselves via existing job boards

## Context

**Market Reality:**
The South African job market is intensely competitive, and the manual labor of customizing a CV for every LinkedIn or Pnet listing is where many talented professionals lose momentum. Applicant Tracking Systems (ATS) like Workday and Greenhouse are gatekeepers that filter applications before they reach human recruiters.

**User Pain Point:**
This is a classic "scratch your own itch" problem — the founder experienced firsthand the exhaustion of manually tweaking CVs for each application, realizing that automation could ensure a developer's profile actually "speaks the same language" as the recruiter's ATS.

**South African Context:**
- Local language standards (SA English: "organised" not "organized")
- Cultural norms (notice period is standard recruiter requirement)
- Local job boards (LinkedIn, Pnet are primary)
- Privacy standards (no ID numbers on CVs)
- Location specificity (city-level for remote/hybrid filtering)

## Constraints

- **Tech Stack**: NestJS + PostgreSQL + Prisma (backend), Next.js (frontend) — chosen for modern development practices and type safety
- **SEO**: Strong SEO focus required for public platform discoverability
- **Hosting**: Self-hosted using Docker on local infrastructure — cost optimization
- **AI Provider**: Gemini (Google) for CV generation due to generous free tier, with future expansion to OpenRouter for multi-provider support
- **Privacy**: Must exclude sensitive personal data (ID numbers) from CVs per SA privacy standards
- **ATS Compatibility**: PDF output must be optimized for major ATS systems (Workday, Greenhouse)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Gemini as primary AI provider | Generous free tier keeps initial costs minimal while validating product-market fit | — Pending |
| Self-hosting with Docker | Eliminates hosting costs during development and early validation phase | — Pending |
| Freemium model | Validates demand with free tier, monetizes power users who see value | — Pending |
| NestJS + Next.js stack | Modern TypeScript stack provides type safety, SEO capabilities, and developer experience | — Pending |
| SA-specific features (notice period, languages, SA English) | Differentiates from generic global CV builders, addresses local market needs | — Pending |
| No cover letters in v1 | Focus on core value proposition (CV tailoring) before expanding scope | — Pending |

---
*Last updated: 2026-02-07 after initialization*
