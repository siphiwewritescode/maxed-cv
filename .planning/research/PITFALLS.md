# Pitfalls Research

**Domain:** CV/Resume Builder Platforms (AI-powered, ATS-optimized)
**Researched:** 2026-02-07
**Confidence:** MEDIUM-HIGH (based on multiple verified sources and industry patterns)

## Critical Pitfalls

### Pitfall 1: ATS Parsing Failures from Complex PDF Layouts

**What goes wrong:**
Resume PDFs that look beautiful to humans are completely unreadable to ATS systems. Multi-column layouts, tables, text boxes, and graphics cause ATS parsers to scramble content, skip sections entirely, or misread critical information like dates and job titles. The result is automatic rejection even for qualified candidates.

**Why it happens:**
- Developers prioritize visual appeal over parseability
- PDF generation libraries often export complex HTML/CSS as images or embedded objects
- Teams test PDFs by opening them in Adobe Reader (which looks fine) instead of testing actual ATS parsing
- Modern ATS systems in 2026 are better than legacy versions, but they still fail on common layout patterns

**How to avoid:**
- **Single-column layouts only.** No tables, no columns, no text boxes.
- Use standard section headings: "Work Experience" not "My Journey" or creative variants
- Export PDFs as text-based (not image-based). Verify with: copy/paste text from PDF into notepad — if nothing pastes, ATS can't read it.
- Test every template through multiple ATS parsing validators before launch (Jobscan, Resume Worded, etc.)
- Enforce simple HTML structure: semantic HTML (`<h1>`, `<p>`, `<ul>`) without complex CSS positioning or absolute positioning
- Use standard fonts only: Arial, Calibri, Times New Roman, Helvetica
- Consistent date format: MM/YYYY or "Month Year" — never "Jan '21" or missing months

**Warning signs:**
- Users report passing resume through ATS checkers and getting scores below 70%
- When you copy/paste from generated PDF, text appears in wrong order or sections are missing
- Date fields in ATS show as "Unable to parse" or experience years calculated incorrectly
- Tables or columns in resume template designs

**Phase to address:**
**Phase 1: Core PDF Generation** — Build ATS-first templates from day one. Do NOT build visual templates first and retrofit for ATS later. That leads to rewrites.

**Sources:**
- [Why Your Resume Gets Rejected by ATS: 12 Common Pitfalls to Avoid in 2026](https://eliteresumes.co/career-resources/ats-optimization/why-resume-rejected-ats.html)
- [Top 10 ATS Resume Mistakes to Avoid in 2026](https://www.careerflow.ai/blog/ats-resume-mistakes-to-avoid)
- [ATS-Friendly Resume Guide (2026): Format, Keywords, Score, and Fixes](https://owlapply.com/en/blog/ats-friendly-resume-guide-2026-format-keywords-score-and-fixes)
- [Free ATS Resume Test: Fix Parsing Issues in 5 Minutes](https://www.distinctiveweb.com/resume-writing/free-ats-test-for-resume)

---

### Pitfall 2: AI-Generated Content That Sounds Robotic or Hallucinates

**What goes wrong:**
AI-generated resume content becomes generic, hollow, and obviously machine-written. Experienced recruiters immediately recognize the robotic tone. Worse, AI can hallucinate achievements, exaggerate responsibilities, or fabricate skills the candidate doesn't have, leading to interview disasters or reputation damage.

**Why it happens:**
- Prompt engineering focuses on keywords and structure, not authenticity
- AI models (including Gemini) produce plausible-sounding but invented details when given sparse input
- No human-in-the-loop review catches fabrications before PDF generation
- Keyword stuffing: AI over-optimizes for ATS at the expense of natural language
- Temperature/creativity settings too high lead to embellishments

**How to avoid:**
- **Never generate content without user-provided evidence.** AI should refine and enhance real experiences, not invent them.
- Implement multi-stage generation:
  1. Extract facts from user input (job titles, dates, responsibilities)
  2. Generate enhancements only for verified facts
  3. Flag any AI additions for user approval before PDF generation
- Use low temperature settings (0.3-0.5) to reduce hallucinations
- Implement fact-checking layer: cross-reference AI output against original user input
- Provide tone controls: let users choose "professional," "conversational," "technical" — don't default to one AI voice
- Show diff view: highlight what AI added/changed vs. original text
- **Critical:** Add disclaimer in UI: "AI suggestions require your review. Do not include achievements you didn't accomplish."

**Warning signs:**
- Generated content includes specific metrics (e.g., "increased sales by 37%") when user provided vague input
- All bullet points follow identical structure/pattern (screams "AI-generated")
- Content sounds impressive but generic — could apply to anyone in that role
- Technical skills listed that user never mentioned
- Achievements use suspiciously precise numbers
- User feedback: "This doesn't sound like me"

**Phase to address:**
**Phase 2: AI Content Generation** — Build human oversight into the workflow architecture. AI is copilot, not autopilot.

**Sources:**
- [Should I Use AI to Write My Resume? 2026 Reality Check](https://aiapply.co/blog/should-i-use-ai-to-write-my-resume)
- [How AI Resume Screening Broke Hiring—and How We Can Fix It](https://www.inc.com/joe-procopio/how-ai-resume-screening-broke-hiring-and-how-we-can-fix-it/91266763)
- [Latest Strategies to Prevent AI Hallucinations in ChatGPT: 2026 Analysis](https://blockchain.news/ainews/latest-strategies-to-prevent-ai-hallucinations-in-chatgpt-2026-analysis-and-solutions)

---

### Pitfall 3: Web Scraping Failures from Anti-Bot Detection

**What goes wrong:**
Job URL scraping stops working without warning. Job sites deploy Cloudflare, Akamai, or custom bot detection that fingerprints your scraper as non-human traffic. You get rate-limited, IP-banned, or served challenge pages. User's job URL submission fails silently or returns empty content.

**Why it happens:**
- Basic HTTP requests use obvious bot patterns: no cookies, no browser fingerprint, suspicious user-agent
- Scraping too fast (multiple requests per second) triggers rate limiting
- Same IP address makes thousands of requests
- Missing JavaScript execution for sites with dynamic content
- Cloudflare and major job sites (LinkedIn, Indeed, Glassdoor) actively block scrapers as of 2025-2026

**How to avoid:**
- **Respect robots.txt and terms of service.** Legal risk is real. Consider alternatives first:
  - User copies/pastes job description instead of scraping
  - API integrations where available (fewer job sites offer these)
  - Manual upload of job description text
- If you must scrape:
  - **Rate limiting:** Maximum 1 request per 2-3 seconds per domain
  - **Rotating proxies:** Use residential proxies, not datacenter IPs
  - **Headless browser with stealth:** Puppeteer-extra with stealth plugin mimics real Chrome
  - **Randomize behavior:** Vary scroll heights, click patterns, wait times
  - **Respect retry-after headers:** When you get 429 (rate limit), honor the retry delay
  - **Implement exponential backoff:** First retry after 5s, then 10s, then 30s, etc.
- **Fallback strategy:** Always provide manual input option when scraping fails
- **Monitoring:** Alert when scraping success rate drops below 80%
- **Quota per user:** Limit scraping to 5-10 job URLs per day per free user to control costs and reduce ban risk

**Warning signs:**
- Scraping suddenly returns 403 Forbidden or 429 Rate Limited
- Cloudflare challenge pages in response HTML
- Empty content extracted despite valid URLs
- Captcha requests in responses
- IP address gets banned (all requests fail)
- Job sites update their HTML structure (selectors break)

**Phase to address:**
**Phase 1: Job Scraping MVP** — Build with fallback-first architecture. Scraping is optional enhancement, not core dependency. Phase 3 could harden scraping with stealth techniques if demand justifies risk/complexity.

**Sources:**
- [Bypass Bot Detection (2026): 5 Best Methods](https://www.zenrows.com/blog/bypass-bot-detection)
- [Web Scraping in 2025: Bypassing Modern Bot Detection](https://medium.com/@sohail_saifii/web-scraping-in-2025-bypassing-modern-bot-detection-fcab286b117d)
- [Web Scraping without getting blocked (2026 Solutions)](https://www.scrapingbee.com/blog/web-scraping-without-getting-blocked/)
- [Why "Basic" Web Scraping is Dying](https://go4scrap.medium.com/why-basic-web-scraping-is-dying-navigating-the-era-of-sophisticated-anti-bot-evasion-e04cbe932a95)

---

### Pitfall 4: Gemini API Rate Limit Exhaustion

**What goes wrong:**
Free tier Gemini API only allows 5 RPM (requests per minute) and limited daily quota. With multiple concurrent users tailoring CVs, you hit rate limits within minutes. Requests fail with 429 errors. Users see "Service temporarily unavailable" and abandon the platform.

**Why it happens:**
- Underestimating real-world concurrent usage
- No request queuing or throttling on your side
- Rate limits are per project, not per API key (creating multiple keys doesn't help)
- Free tier dropped from 10 RPM to 5 RPM in December 2025 update
- Each CV tailoring request might need multiple Gemini calls (summary, work experience bullets, skills section, etc.)

**How to avoid:**
- **Implement client-side rate limiting before hitting Gemini API:**
  - Queue requests using Bull or similar job queue
  - Limit concurrent Gemini calls to 80% of quota (4 RPM on free tier, leaving buffer)
  - Show users queue position: "Your CV is being tailored... 3 requests ahead of you"
- **Optimize token usage:**
  - Use context caching for repeated prompts (reduces costs by up to 75%)
  - Batch similar operations where possible
  - Use Gemini Flash-Lite for non-critical content generation (higher quotas)
- **Upgrade plan early:**
  - Tier 1 ($0 upfront, just enable billing): 150-300 RPM — essential for production
  - Tier 2 (after $250 spend): 1,000+ RPM
  - Plan upgrade based on user growth projections
- **Freemium tier limits:**
  - Free users: 3 CV tailoring sessions per day
  - Paid users: Unlimited (backed by higher API tier)
- **Monitoring:**
  - Track RPM usage in real-time
  - Alert when approaching 70% of quota
  - Auto-throttle aggressively when hitting 90%
- **Fallback:**
  - If API fails, save request and process later (async queue)
  - Email user when CV is ready instead of real-time generation

**Warning signs:**
- 429 errors in logs with RESOURCE_EXHAUSTED
- API responses include retry-after headers
- Users report "slow" or "failed" CV generation
- Spiky usage patterns (everyone uses it at 9am) exhaust daily quota
- Concurrent user count exceeds RPM limit divided by average request duration

**Phase to address:**
**Phase 1: MVP** — Implement queue + rate limiting from day one. Phase 2 should upgrade to Tier 1 before public launch. Phase 3 optimizes with context caching.

**Sources:**
- [Gemini API Rate Limits 2026: Complete Developer Guide](https://blog.laozhang.ai/en/posts/gemini-api-rate-limits-guide)
- [5 Ways to Solve AI Studio Gemini 3 Pro Rate Limits – 2026 Complete Guide](https://help.apiyi.com/en/ai-studio-gemini-3-pro-rate-limit-solution-en.html)
- [Gemini API Pricing and Quotas: Complete 2026 Guide](https://www.aifreeapi.com/en/posts/gemini-api-pricing-and-quotas)
- [Gemini API Free Tier Rate Limits: Complete Guide for 2026](https://www.aifreeapi.com/en/posts/gemini-api-free-tier-rate-limits)

---

### Pitfall 5: POPIA/GDPR Non-Compliance with Personal Data

**What goes wrong:**
You store users' full names, contact details, work history, education, and potentially sensitive information (race, health status from CV gaps, etc.) without proper consent, security, or data subject rights. South Africa's POPIA enforcement fines can be severe, and European users bring GDPR into scope. A data breach or compliance audit reveals violations, resulting in fines, legal action, and reputational damage.

**Why it happens:**
- MVP focuses on features, security and compliance are deferred
- Developers don't understand POPIA requirements (assumed it's like GDPR, but nuances differ)
- No legal review of data handling practices
- Storing data "just in case" instead of minimizing collection
- No data retention policy — CVs stored forever
- Missing consent flows, privacy policy, or data deletion mechanisms

**How to avoid:**
- **Understand POPIA requirements:**
  - Applies to all South African companies and any company processing SA residents' data
  - No threshold — even small startups must comply
  - Personal information includes name, contact details, employment history, education, ID numbers
  - Users have right to access, correction, and deletion of their data
- **Implementation checklist:**
  - **Lawful basis for processing:** Get explicit consent for CV data collection with clear purpose
  - **Transparency:** Privacy policy in plain language, not legal jargon
  - **Data minimization:** Only collect what's needed for CV generation — don't ask for ID numbers, photos, or sensitive personal info unless essential
  - **Security safeguards:** Encrypt data at rest (database encryption), encrypt in transit (HTTPS/TLS), hash sensitive fields
  - **Retention limits:** Delete CV data after 12 months of inactivity (or let users choose retention period)
  - **Data subject rights:** Implement self-service data export (download my CV data as JSON) and account deletion (hard delete, not soft)
  - **Breach notification:** If database is compromised, notify affected users within 72 hours per POPIA
- **South African specifics:**
  - POPIA enforcement by Information Regulator increased fines in 2025 — compliance is not optional
  - Fines up to R10 million or 10 years imprisonment for serious violations
- **Architecture:**
  - Store CV content separately from user authentication data
  - Use row-level encryption for sensitive fields (work history, personal statements)
  - Implement audit logs for data access (who accessed what, when)

**Warning signs:**
- Privacy policy is generic template with no mention of POPIA
- No consent checkboxes during registration
- Users can't delete their account or export their data
- Database stores plaintext sensitive information
- No data retention policy documented
- CV data from 3 years ago still in database with no user activity

**Phase to address:**
**Phase 0: Pre-Development** — Get legal review of data handling plan before building. Phase 1 must include compliant data architecture. Retrofitting compliance is expensive and risky.

**Sources:**
- [Protection of Personal Information Act (POPI Act) - POPIA](https://popia.co.za/)
- [Understanding South Africa's POPIA](https://secureprivacy.ai/blog/south-africa-popia-compliance)
- [Privacy Laws 2026: Global Updates & Compliance Guide](https://secureprivacy.ai/blog/privacy-laws-2026)
- [The Protection of Personal Information Act (POPIA): A Comprehensive Guide](https://captaincompliance.com/education/the-protection-of-personal-information-act-popia-a-comprehensive-guide-to-south-africas-data-privacy-regulation/)

---

### Pitfall 6: PDF Generation Memory Leaks and Performance Degradation

**What goes wrong:**
Puppeteer/Chromium consumes 200-500 MB of memory per PDF generation. Under concurrent load, server memory exhausts, Node.js process crashes, or response times balloon from 2 seconds to 30+ seconds. In production, each user's PDF request spawns a headless Chrome instance that doesn't release memory properly, leading to cascading failures.

**Why it happens:**
- Puppeteer launches full Chrome browser for each request (heavyweight operation)
- Browser tabs not properly closed after PDF generation
- Concurrent requests spawn multiple Chrome instances simultaneously
- Large HTML content (10+ page CVs) increases memory footprint
- No concurrency limits on PDF generation endpoint
- Docker containers with insufficient memory allocation

**How to avoid:**
- **Architectural decision:**
  - **Option A:** Use lightweight PDF library (PDFKit, pdfmake) instead of Puppeteer — lower quality but 10x less memory
  - **Option B:** Use Puppeteer but with strict controls (recommended for high-fidelity PDFs)
- **If using Puppeteer:**
  - **Launch with optimization flags:**
    - `--disable-dev-shm-usage` (avoids /dev/shm space issues)
    - `--no-sandbox` (only in Docker, security risk otherwise)
    - `--disable-setuid-sandbox`
    - `args: ['--disable-gpu', '--disable-software-rasterizer']`
  - **Browser reuse pattern:**
    - Launch browser once at server startup, reuse for all requests
    - Create new page for each request, close immediately after PDF generation
    - Periodically restart browser (every 100 PDFs or every hour) to prevent memory creep
  - **Concurrency limits:**
    - Queue PDF generation requests (Bull, BullMQ)
    - Limit concurrent generations to CPU core count minus 1
    - Show users: "Generating PDF... 2 requests ahead"
  - **Temp file strategy:**
    - Save large HTML to temp file instead of passing as string over Chrome DevTools Protocol
    - Navigate to file:// URL — reduces memory transfer overhead by 20%
    - Clean up temp files after PDF generation
  - **Memory monitoring:**
    - Track heap usage per request
    - Alert when Node.js memory exceeds 80% of limit
    - Implement circuit breaker: disable PDF generation if memory critical
- **Container resource allocation:**
  - Allocate minimum 2GB RAM for PDF generation service
  - Separate PDF generation into dedicated microservice (isolates failures from main app)
  - Scale horizontally: multiple PDF generation pods with load balancing

**Warning signs:**
- Response times increase over time (memory leak symptom)
- Server crashes with "JavaScript heap out of memory" errors
- Docker containers restarting frequently
- CPU usage spikes during concurrent PDF generation
- Browser processes visible in task manager after requests complete (not cleaned up)

**Phase to address:**
**Phase 1: PDF Generation Core** — Choose lightweight library first for MVP speed. Phase 2 introduces Puppeteer with proper resource management if quality demands it. Phase 3 scales with dedicated PDF microservice.

**Sources:**
- [Headless chromium hogs too much memory when exporting huge reports to PDF](https://github.com/puppeteer/puppeteer/issues/5416)
- [Never use Puppeteer to create NodeJS PDFs on the server](https://medium.com/@cristian.rosas/never-use-pupeeter-to-create-nodejs-pdfs-on-the-server-recommendation-5cc3a884eba7)
- [Optimizing Puppeteer for PDF Generation: Overcoming challenges with large file sizes](https://medium.com/@danindu/optimizing-puppeteer-for-pdf-generation-overcoming-challenges-with-large-file-sizes-8b7777edbeca)
- [Puppeteer Isn't Meant for PDFs — Here's Why](https://medium.com/@onu.khatri/puppeteer-isnt-meant-for-pdfs-here-s-why-1e3a4419263f)

---

## Technical Debt Patterns

Shortcuts that seem reasonable but create long-term problems.

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Skip ATS testing during development | Faster MVP launch | All CVs fail ATS parsing — requires template redesign from scratch | Never — ATS is core value prop |
| Store all CV data in single encrypted blob | Simple schema | Can't search/filter user CVs, can't implement versioning, hard to backup selectively | Never — granular storage is table stakes |
| No request queue, hit Gemini API directly | Simpler architecture | Rate limit failures, poor UX, manual retry logic in every API call | Only for prototype/demo |
| Use Puppeteer without concurrency limits | "It works on my laptop" | Production crashes under 10 concurrent users | Only for single-user testing |
| Generic error messages ("Something went wrong") | Less code to maintain | Users can't self-diagnose issues (did scraping fail? AI timeout? PDF error?), more support tickets | Never — error clarity reduces support load |
| No data retention policy | Don't have to build deletion logic | POPIA violation, database bloat, expensive backups | Never — compliance is not optional |
| Hardcode API keys in environment variables | Quick to deploy | Keys in version control, logs, error traces — security breach waiting to happen | Only in local dev, never in prod |

---

## Integration Gotchas

Common mistakes when connecting to external services.

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| Gemini API | Treating API errors as fatal failures | Implement retry logic with exponential backoff. Queue failed requests for later processing. Show user graceful degradation message. |
| Job Site Scraping | Assuming HTML structure is stable | Version scrapers per site. Detect structure changes with validation checks. Fail gracefully when structure breaks. Notify admin immediately. |
| PDF Generation | Generating PDFs synchronously in API endpoint | Use async job queue (BullMQ). Return "processing" status immediately. Webhook or polling for completion. Prevents request timeouts. |
| PostgreSQL with Prisma | Storing large text blocks (CV content) as JSON | Use proper text columns with full-text search indexes. JSON is harder to query, migrate, and backup efficiently. |
| Authentication (NextAuth/Passport) | Storing CV data tied to auth session | Decouple CV data from auth system. User IDs link them, but CV service can operate independently. Easier to migrate auth providers later. |
| Email notifications | Sending emails synchronously after CV generation | Queue email jobs separately. Email provider downtime shouldn't block PDF generation completion. |

---

## Performance Traps

Patterns that work at small scale but fail as usage grows.

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Synchronous PDF generation in API route | Response times 10-30s, timeouts under load | Use job queue, return immediately with job ID, poll for completion or webhook | 5-10 concurrent users |
| No database indexes on CV queries | Queries slow down over time | Index user_id, created_at, updated_at columns. Full-text index on CV content for search. | 1,000+ CVs in database |
| Gemini API calls without batching | 10 separate API calls for 10 CV sections | Batch prompts where possible. Single call with structured output for multiple sections. Reduces latency and quota usage. | 50+ users/hour |
| Storing full CV history without archiving | Database grows unbounded, backups take hours | Implement soft delete + archival after 12 months. Move old CVs to cold storage (S3 Glacier). | 10,000+ CVs |
| Client-side CV rendering before PDF generation | Large HTML sent over network, slow rendering | Server-side rendering with minimal CSS. Only send final HTML to PDF service. | CVs > 5 pages |
| No CDN for static assets (fonts, logos) | PDF generation slower as traffic increases | Use CDN for all static assets. Puppeteer caches fonts locally in Docker image. | 100+ PDF generations/day |

---

## Security Mistakes

Domain-specific security issues beyond general web security.

| Mistake | Risk | Prevention |
|---------|------|------------|
| Storing plaintext CVs in database | Data breach exposes all user CVs, including sensitive personal info | Encrypt CV content at rest. Use database-level encryption + application-level encryption for sensitive fields. |
| No rate limiting on scraping endpoint | Attackers use your service to scrape thousands of job sites, exhausting your IP quota, getting your IPs banned | Rate limit per user: 10 job URLs/hour. Authenticate scraping requests. Monitor for abuse patterns. |
| Exposing internal error details in API responses | "Gemini API key expired" or "Database connection failed" leaks architecture details | Return generic errors to client. Log detailed errors server-side only. |
| PDF generation endpoint without authentication | Public endpoint allows anyone to generate CVs, exhausting server resources | Require authentication token for all PDF generation. Implement freemium quotas (3 CVs/day for free users). |
| Storing user API keys (if you allow BYOK) | User's Gemini API keys in your database — if breached, their quotas are drained | If supporting BYOK (Bring Your Own Key), encrypt with user-specific key derived from their password. Better: don't store keys, use OAuth or key proxy. |
| No input sanitization on job descriptions | XSS attacks if job description contains malicious scripts, injected into PDF or rendered in app | Sanitize all user input and scraped content. Use DOMPurify or similar. Escape HTML before rendering. |
| Allowing unlimited PDF regenerations | User generates same CV 1000 times, DDoS-ing your service | Rate limit: 10 PDF generations per CV per day. Cache recently generated PDFs (5 min TTL) — serve cached version if content unchanged. |

---

## UX Pitfalls

Common user experience mistakes in this domain.

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| No preview before PDF generation | User downloads PDF, finds formatting issues, regenerates 5 times — frustration and wasted server resources | Live HTML preview that matches final PDF exactly. "What you see is what you get" editor. |
| ATS score shown without explanation | "Your CV scores 62% ATS-friendly" — user doesn't know what to fix | Show actionable feedback: "Remove table in Experience section" + "Add keywords: project management, agile" + "Fix date format in Education" |
| AI suggestions auto-applied without review | User doesn't realize AI changed "managed team" to "led 15-person team achieving 40% revenue growth" — embarrassing in interview | Show diff view: "AI suggested changes" with accept/reject for each. User explicitly approves before PDF generation. |
| Generic error: "Failed to tailor CV" | User doesn't know if problem is job URL, AI timeout, or their CV content | Specific errors: "Couldn't access job URL (site blocked scraping)" or "AI request timed out — try shorter job description" or "Missing work experience section" |
| No indication of AI processing time | User clicks "Tailor CV" and nothing happens for 10 seconds — assumes it's broken, clicks again (duplicate requests) | Show progress: "Analyzing job requirements... Tailoring work experience... Optimizing keywords... Generating PDF..." with estimated time remaining. |
| Requiring full CV upload before showing any value | User must input entire CV history before seeing what platform does | Offer sample/demo mode: "See how it works with example CV" or allow partial input and show tailored suggestions incrementally. |
| "Download PDF" as only output option | User wants to edit in Word, copy to job application form, or send to recruiter in different format | Offer multiple exports: PDF, DOCX, plain text, JSON (for import to other tools). |

---

## "Looks Done But Isn't" Checklist

Things that appear complete but are missing critical pieces.

- [ ] **PDF Generation:** Often missing text selectability verification — check that text can be copied from PDF (not image-based)
- [ ] **ATS Optimization:** Often missing actual ATS parser testing — verify through Jobscan, Resume Worded, or enterprise ATS demo, not just "it looks simple"
- [ ] **AI Content:** Often missing hallucination detection — verify AI didn't invent achievements or skills not in original input
- [ ] **Web Scraping:** Often missing fallback for blocked sites — verify manual input option works when scraping fails
- [ ] **Rate Limiting:** Often missing queue monitoring/alerting — verify you can see queue depth and alert when backing up
- [ ] **Data Privacy:** Often missing actual deletion (soft-deletes don't comply with POPIA) — verify hard delete removes all traces including backups
- [ ] **Error Handling:** Often missing user-facing error messages — verify users see actionable errors, not just "500 Internal Server Error"
- [ ] **Concurrency:** Often missing load testing — verify system handles 10+ concurrent PDF generations without crashing
- [ ] **Token Usage:** Often missing Gemini token counting/budgeting — verify you track tokens per request and can project costs at scale
- [ ] **Mobile Responsiveness:** Often missing mobile PDF preview — verify CV preview renders correctly on mobile before PDF generation

---

## Recovery Strategies

When pitfalls occur despite prevention, how to recover.

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| All CVs fail ATS parsing (bad templates) | HIGH | 1. Pause new PDF generations immediately. 2. Redesign templates with ATS-first approach. 3. Batch-regenerate existing CVs with new templates. 4. Email all users with updated CVs. 5. Offer refunds/credits to paid users. |
| AI generates fabricated achievements | MEDIUM | 1. Add disclaimer to all existing CVs: "AI-generated content — verify accuracy before use". 2. Implement fact-checking layer in next release. 3. Email users warning them to review AI sections. 4. Offer manual editing interface to correct issues. |
| Gemini API quota exhausted mid-day | LOW | 1. Enable job queue if not already active. 2. Upgrade to Tier 1 immediately (enable billing). 3. Process queued requests once quota available. 4. Email queued users: "High demand — your CV will be ready in 2 hours". |
| POPIA compliance violation discovered | HIGH | 1. Consult legal counsel immediately. 2. Self-report to Information Regulator (reduces penalties). 3. Implement missing compliance measures (encryption, deletion, consent). 4. Notify affected users per POPIA breach notification requirements. 5. Prepare for potential audit. |
| Scraping blocked by major job site | LOW-MEDIUM | 1. Switch to manual input option for that domain immediately. 2. Investigate stealth scraping techniques (residential proxies, Puppeteer-extra stealth). 3. Consider official API partnerships (unlikely for most job sites). 4. Add domain-specific error message: "LinkedIn blocks automated access — please copy/paste job description". |
| PDF service crashes under load | MEDIUM | 1. Scale horizontally: add more PDF generation workers. 2. Implement concurrency limits immediately. 3. Clear browser process zombie instances. 4. Restart PDF service (queued jobs will retry). 5. Allocate more memory to containers. 6. Consider migrating to lighter PDF library if recurring issue. |

---

## Pitfall-to-Phase Mapping

How roadmap phases should address these pitfalls.

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| ATS Parsing Failures | Phase 1: Core Templates | Test every template through 3+ ATS parsers. Copy/paste test. Score > 70% required. |
| AI Content Hallucinations | Phase 2: AI Integration | Diff view showing AI changes. Manual approval required. Test with minimal user input to detect fabrication. |
| Web Scraping Blocked | Phase 1: Job Input | Manual input option always available. Test scraping failure gracefully falls back. Test 5 major job sites. |
| Gemini Rate Limits | Phase 1: MVP | Implement queue from day one. Load test with 10 concurrent users. Monitor rate limit usage. Upgrade to Tier 1 before public launch. |
| POPIA Non-Compliance | Phase 0: Pre-Development | Legal review of data handling plan. Privacy policy drafted. Data deletion implemented. Audit trail for data access. |
| PDF Memory Issues | Phase 1: PDF Generation | Load test with 10 concurrent generations. Memory monitoring enabled. Concurrency limits enforced. Test CV regeneration 20 times in a row (detect memory leaks). |
| No Error Visibility | Phase 1: All Features | Every error path has user-facing message. Test all failure scenarios. Log detailed errors server-side only. |
| Keyword Stuffing (AI over-optimizes) | Phase 2: AI Tuning | Human review of 20 generated CVs. ATS score vs. readability balance. Temperature tuning. Tone variation testing. |
| Sync PDF Generation Timeout | Phase 1: Architecture | PDF generation must be async with job queue. Test timeout scenarios. Max wait time < 30s before returning "processing" status. |
| Database Query Slowdown | Phase 2: After 1000 CVs | Add indexes on user_id, created_at. Full-text search index if search feature added. Query performance tests with 10k+ records. |

---

## Phase-Specific Research Flags

These topics likely need deeper investigation during specific phases.

| Phase | Topic Needing Research | Why |
|-------|------------------------|-----|
| Phase 1: Job Scraping | Specific anti-bot techniques for Indeed, LinkedIn, Glassdoor | Each site uses different detection methods — need targeted solutions |
| Phase 2: AI Content | Prompt engineering for South African job market tone | SA professional norms may differ from US/UK — generic prompts might sound off |
| Phase 2: ATS Optimization | Which SA companies use which ATS systems | Taleo, Workday, Greenhouse, iCIMS — testing priorities based on SA market share |
| Phase 3: Scaling | Cost modeling for Gemini API at 1000 users/day | Need actual usage data to project costs and decide on caching strategy |
| Phase 3: Compliance Audit | POPIA audit checklist specific to HR tech | General POPIA guidance exists, but HR/recruitment data may have specific requirements |
| Phase 4: Monetization | Acceptable freemium limits in CV builder market | Competitive analysis: what do Novoresume, Resume.io, Zety offer in free tier? |

---

## Sources Summary

**ATS Compatibility:**
- [Why Your Resume Gets Rejected by ATS: 12 Common Pitfalls to Avoid in 2026](https://eliteresumes.co/career-resources/ats-optimization/why-resume-rejected-ats.html)
- [Top 10 ATS Resume Mistakes to Avoid in 2026](https://www.careerflow.ai/blog/ats-resume-mistakes-to-avoid)
- [ATS-Friendly Resume Guide (2026): Format, Keywords, Score, and Fixes](https://owlapply.com/en/blog/ats-friendly-resume-guide-2026-format-keywords-score-and-fixes)
- [Can ATS Read PDF Resumes in 2026?](https://smallpdf.com/blog/do-applicant-tracking-systems-prefer-resumes-in-pdf-format)
- [Free ATS Resume Checker](https://novoresume.com/tools/ats-resume-checker)
- [ATS Resume Formatting Rules (2026)](https://www.resumeadapter.com/blog/ats-resume-formatting-rules-2026)

**AI Content Generation:**
- [Should I Use AI to Write My Resume? 2026 Reality Check](https://aiapply.co/blog/should-i-use-ai-to-write-my-resume)
- [How AI Resume Screening Broke Hiring—and How We Can Fix It](https://www.inc.com/joe-procopio/how-ai-resume-screening-broke-hiring-and-how-we-can-fix-it/91266763)
- [Latest Strategies to Prevent AI Hallucinations in ChatGPT: 2026 Analysis](https://blockchain.news/ainews/latest-strategies-to-prevent-ai-hallucinations-in-chatgpt-2026-analysis-and-solutions)

**Web Scraping:**
- [Bypass Bot Detection (2026): 5 Best Methods](https://www.zenrows.com/blog/bypass-bot-detection)
- [Web Scraping in 2025: Bypassing Modern Bot Detection](https://medium.com/@sohail_saifii/web-scraping-in-2025-bypassing-modern-bot-detection-fcab286b117d)
- [Web Scraping without getting blocked (2026 Solutions)](https://www.scrapingbee.com/blog/web-scraping-without-getting-blocked/)
- [Why "Basic" Web Scraping is Dying](https://go4scrap.medium.com/why-basic-web-scraping-is-dying-navigating-the-era-of-sophisticated-anti-bot-evasion-e04cbe932a95)

**Gemini API Rate Limits:**
- [Rate limits - Gemini API Official Docs](https://ai.google.dev/gemini-api/docs/rate-limits)
- [Gemini API Rate Limits 2026: Complete Developer Guide](https://blog.laozhang.ai/en/posts/gemini-api-rate-limits-guide)
- [5 Ways to Solve AI Studio Gemini 3 Pro Rate Limits](https://help.apiyi.com/en/ai-studio-gemini-3-pro-rate-limit-solution-en.html)
- [Gemini API Pricing and Quotas: Complete 2026 Guide](https://www.aifreeapi.com/en/posts/gemini-api-pricing-and-quotas)

**Data Privacy (POPIA):**
- [Protection of Personal Information Act (POPI Act)](https://popia.co.za/)
- [Understanding South Africa's POPIA](https://secureprivacy.ai/blog/south-africa-popia-compliance)
- [Privacy Laws 2026: Global Updates & Compliance Guide](https://secureprivacy.ai/blog/privacy-laws-2026)
- [Complete GDPR Compliance Guide (2026-Ready)](https://secureprivacy.ai/blog/gdpr-compliance-2026)

**PDF Generation:**
- [Headless chromium hogs too much memory](https://github.com/puppeteer/puppeteer/issues/5416)
- [Never use Puppeteer to create NodeJS PDFs on the server](https://medium.com/@cristian.rosas/never-use-pupeeter-to-create-nodejs-pdfs-on-the-server-recommendation-5cc3a884eba7)
- [Optimizing Puppeteer for PDF Generation](https://medium.com/@danindu/optimizing-puppeteer-for-pdf-generation-overcoming-challenges-with-large-file-sizes-8b7777edbeca)
- [Puppeteer Isn't Meant for PDFs — Here's Why](https://medium.com/@onu.khatri/puppeteer-isnt-meant-for-pdfs-here-s-why-1e3a4419263f)

**Freemium Abuse Prevention:**
- [Freemium Without Fraud: The Abuse‑Economics Model](https://aloa.co/blog/api-rate-limits-abuse-economics)
- [How to implement rate limiting to prevent API abuse](https://www.digitalapi.ai/blogs/how-to-implement-rate-limiting-to-prevent-api-abuse)

---

*Pitfalls research for: CV/Resume Builder Platform (AI-powered, ATS-optimized)*
*Researched: 2026-02-07*
*Confidence: MEDIUM-HIGH (Multiple verified sources, industry patterns confirmed)*
