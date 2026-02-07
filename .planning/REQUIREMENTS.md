# Requirements: Maxed-CV

**Defined:** 2026-02-07
**Core Value:** Eliminate CV tailoring friction for South African professionals, ensuring CVs pass ATS filters and reach human recruiters

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Authentication

- [ ] **AUTH-01**: User can sign up with email and password
- [ ] **AUTH-02**: User can log in and stay logged in across sessions
- [ ] **AUTH-03**: User can reset password via email link
- [ ] **AUTH-04**: User receives email verification after signup
- [ ] **AUTH-05**: User session persists across browser refresh

### Master Profile

- [ ] **PROF-01**: User can create Master Profile with personal details (name, email, phone)
- [ ] **PROF-02**: User can add work experience entries (job title, company, dates, bullet points)
- [ ] **PROF-03**: User can edit existing work experience entries
- [ ] **PROF-04**: User can delete work experience entries
- [ ] **PROF-05**: User can add skills to their profile
- [ ] **PROF-06**: User can add projects with descriptions
- [ ] **PROF-07**: User can add education entries (degree, institution, dates)
- [ ] **PROF-08**: User can add certifications
- [ ] **PROF-09**: Master Profile data is stored securely per POPIA standards
- [ ] **PROF-10**: User can edit their Master Profile at any time

### Job Input

- [ ] **JOB-01**: User can paste a job URL into the system
- [ ] **JOB-02**: System scrapes job description from LinkedIn
- [ ] **JOB-03**: System scrapes job description from Pnet
- [ ] **JOB-04**: System scrapes job description from Careers24
- [ ] **JOB-05**: System scrapes job description from CareerJunction
- [ ] **JOB-06**: System extracts key requirements from job description (skills, experience, keywords)
- [ ] **JOB-07**: System handles scraping failures gracefully with error messages
- [ ] **JOB-08**: User can manually paste job description as fallback if scraping fails

### AI CV Generation

- [ ] **AI-01**: System analyzes job requirements against Master Profile
- [ ] **AI-02**: System identifies relevant experience based on keyword matching
- [ ] **AI-03**: System prioritizes relevant experience (reorders bullet points to top)
- [ ] **AI-04**: System optimizes bullet point language to emphasize matching skills
- [ ] **AI-05**: System applies South African English language standards (organised, not organized)
- [ ] **AI-06**: System shows AI changes/highlights (what was modified and why)
- [ ] **AI-07**: AI generation is queue-based (async processing) to handle rate limits
- [ ] **AI-08**: System never fabricates experience or skills not in Master Profile

### CV Preview & Download

- [ ] **PREV-01**: User sees split-screen preview (AI highlights on left, PDF preview on right)
- [ ] **PREV-02**: System displays ATS match score (keyword alignment percentage)
- [ ] **PREV-03**: User can review AI changes before downloading
- [ ] **PREV-04**: System generates ATS-optimized PDF (single-column layout, no tables/graphics)
- [ ] **PREV-05**: PDF uses standard fonts (Arial or Calibri)
- [ ] **PREV-06**: PDF has selectable text (not images or scanned content)
- [ ] **PREV-07**: System auto-generates contextual filename (Name_JobTitle_Location.pdf)
- [ ] **PREV-08**: User can download the generated CV as PDF

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Master Profile Enhancement

- **PROF-V2-01**: User can specify city location (Cape Town, Johannesburg, etc.)
- **PROF-V2-02**: User can specify notice period
- **PROF-V2-03**: User can list language proficiencies (English, isiZulu, Afrikaans, etc.)

### Job Management

- **JOB-V2-01**: System caches scraped job descriptions for reuse
- **JOB-V2-02**: User can view previously scraped jobs
- **JOB-V2-03**: System stores job data for future reference

### Monetization

- **MON-V2-01**: System implements free tier with usage limits (e.g., 3 CVs per month)
- **MON-V2-02**: System implements paid tier for unlimited access
- **MON-V2-03**: User can upgrade from free to paid tier
- **MON-V2-04**: System tracks usage against limits

### Additional Features

- **FEAT-V2-01**: System supports multiple CV versions per user
- **FEAT-V2-02**: User can manage and organize multiple generated CVs
- **FEAT-V2-03**: System provides DOCX export option (in addition to PDF)

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Cover letter generation | Focus on CV tailoring only for v1; cover letters are separate use case |
| Application tracking | Don't track which jobs user applied to or application status; focus on CV generation |
| Multi-user/team accounts | Single user accounts only; no company/team features in v1 |
| Job search/discovery | Users find jobs themselves via existing job boards; we don't compete with LinkedIn/Pnet |
| Social features | No sharing, comments, or social networking; focus on individual CV generation |
| Creative CV templates | Research shows 95% ATS rejection rate for creative layouts; ATS-safe only |
| Mobile app | Web-first approach; mobile can be considered post-v1 |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| AUTH-01 | Phase 2 | Pending |
| AUTH-02 | Phase 2 | Pending |
| AUTH-03 | Phase 2 | Pending |
| AUTH-04 | Phase 2 | Pending |
| AUTH-05 | Phase 2 | Pending |
| PROF-01 | Phase 3 | Pending |
| PROF-02 | Phase 3 | Pending |
| PROF-03 | Phase 3 | Pending |
| PROF-04 | Phase 3 | Pending |
| PROF-05 | Phase 3 | Pending |
| PROF-06 | Phase 3 | Pending |
| PROF-07 | Phase 3 | Pending |
| PROF-08 | Phase 3 | Pending |
| PROF-09 | Phase 3 | Pending |
| PROF-10 | Phase 3 | Pending |
| JOB-01 | Phase 4 | Pending |
| JOB-02 | Phase 4 | Pending |
| JOB-03 | Phase 4 | Pending |
| JOB-04 | Phase 4 | Pending |
| JOB-05 | Phase 4 | Pending |
| JOB-06 | Phase 4 | Pending |
| JOB-07 | Phase 4 | Pending |
| JOB-08 | Phase 4 | Pending |
| AI-01 | Phase 5 | Pending |
| AI-02 | Phase 5 | Pending |
| AI-03 | Phase 5 | Pending |
| AI-04 | Phase 5 | Pending |
| AI-05 | Phase 5 | Pending |
| AI-06 | Phase 5 | Pending |
| AI-07 | Phase 5 | Pending |
| AI-08 | Phase 5 | Pending |
| PREV-01 | Phase 6 | Pending |
| PREV-02 | Phase 6 | Pending |
| PREV-03 | Phase 6 | Pending |
| PREV-04 | Phase 6 | Pending |
| PREV-05 | Phase 6 | Pending |
| PREV-06 | Phase 6 | Pending |
| PREV-07 | Phase 6 | Pending |
| PREV-08 | Phase 6 | Pending |

**Coverage:**
- v1 requirements: 39 total
- Mapped to phases: 39 (100% coverage)
- Unmapped: 0

---
*Requirements defined: 2026-02-07*
*Last updated: 2026-02-07 after roadmap creation*
