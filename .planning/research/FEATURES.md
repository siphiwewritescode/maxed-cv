# Feature Research

**Domain:** AI-Powered CV/Resume Builder Platform
**Researched:** 2026-02-07
**Confidence:** MEDIUM-HIGH

## Feature Landscape

### Table Stakes (Users Expect These)

Features users assume exist. Missing these = product feels incomplete.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| **Professional Templates (ATS-Safe)** | All modern resume builders provide multiple templates. Users expect clean, ATS-compatible designs that pass automated screening while looking professional to humans. | MEDIUM | Must balance visual appeal with ATS parsing requirements. Single-column layouts, standard fonts (Arial, Calibri, Helvetica), avoid graphics/tables/columns. Resume.io and Novoresume set the standard here. |
| **PDF Export** | Universal expectation. Users need to download their CV as a PDF for submission. Must be text-based (selectable text) not image-based. | LOW | DOCX is safest for ATS, but PDF is what users want for visual consistency. Offer both formats. File size should be under 200KB for PDFs. |
| **Profile/Personal Details Section** | Every CV has name, contact info, location, and professional summary. South African CVs specifically include optional notice period, driver's license, languages. | LOW | SA-specific: DO NOT include ID number, marital status, or religion (privacy/discrimination concerns). Notice period is optional but helpful. |
| **Work Experience Section** | Standard reverse-chronological work history with employer, title, dates, and bullet points. Users expect structured input fields. | LOW | Must support bullet points with action verbs and metrics. Common format: "Developed X resulting in Y% improvement." |
| **Education & Certifications** | Users expect dedicated sections for degrees and professional certifications with institution, dates, and credentials. | LOW | Format: Institution, Qualification, Year. Support for multiple entries. |
| **Skills Section** | List of hard and soft skills. Users expect to add/remove skills easily. | LOW | Should support categorization (Technical Skills, Soft Skills, Languages). ATS requires skills to match job description keywords exactly. |
| **Real-Time Preview** | Users want to see changes as they type. Split-screen interfaces are now standard (Kickresume, Novoresume). | MEDIUM | Technical requirement: Live preview while editing. Some allow direct editing in preview mode. |
| **Multiple Resume Versions** | Users apply to different types of jobs and need to maintain separate tailored versions. | MEDIUM | Allows users to maintain "master" profile plus tailored versions for different roles. Essential for job seekers applying to multiple positions. |
| **Mobile-Responsive Interface** | Users expect to access and edit their CV from any device, though desktop is primary usage. | MEDIUM | Not critical for MVP but increasingly expected in 2026. Mobile is more for quick edits than full creation. |

### Differentiators (Competitive Advantage)

Features that set the product apart. Not required, but valuable.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **Job URL Scraping → Auto-Tailoring** | Core unique feature for Maxed-CV. Paste job URL → AI extracts requirements → CV auto-tailored with matched keywords and restructured bullets. Eliminates manual tailoring friction. | HIGH | This is Maxed-CV's primary differentiator. Competitors require manual copy-paste of job descriptions. URL scraping + extraction + intelligent content rewriting is complex but high-value. |
| **Match Score with Breakdown** | AI analyzes CV against job description and provides percentage match score (typically >65% needed for ATS pass). Shows coverage of responsibilities, skills, and impact signals. | MEDIUM-HIGH | Rezi and Upplai lead here. Provides instant feedback: "Your resume has 72% match. Missing keywords: Python, Agile, Stakeholder Management." Builds user confidence before submission. |
| **Real-Time ATS Scoring** | Live analysis showing ATS compatibility as user edits. Flags formatting issues, missing keywords, and parsing problems before submission. | HIGH | Goes beyond match score - specifically checks for ATS parsing issues (tables, columns, graphics, fonts). Rezi's killer feature. Critical for users worried about auto-rejection. |
| **AI Bullet Point Optimization** | AI rewrites user's bullet points to be more impactful: adds action verbs, quantifies achievements, matches job description language. | MEDIUM-HIGH | Example: "Managed team" → "Led cross-functional team of 8 developers, delivering 15 features on time with 20% reduction in bugs." Users provide basic info, AI creates compelling narrative. |
| **Contextual Filename Generation** | Auto-generates professional filenames like "John_Smith_Senior_Developer_CompanyName.pdf" instead of generic "resume.pdf". Small feature, high perceived value. | LOW | Simple but thoughtful. Shows attention to detail. Format: FirstName_LastName_JobTitle_Company.pdf |
| **Keyword Gap Analysis** | Compares user's CV to job description and highlights missing critical keywords. Suggests where to add them naturally. | MEDIUM | Visual interface showing "Job requires: Python, Docker, AWS. Your CV has: Python. Missing: Docker, AWS." Users can click to add. |
| **SA-Specific Language/Proofing** | South African English spell-check, supports local terminology (matric, BBBEE, notice period conventions), excludes problematic fields (ID numbers). | MEDIUM | Differentiates from US/UK-focused tools. SA job seekers deal with unique requirements. Notice period norms, local qualifications (matric vs high school), SA English spelling. |
| **Version Comparison** | Side-by-side comparison of different CV versions to see what changed between tailored versions. | MEDIUM | Helpful for users managing multiple applications. "How is my Software Engineer CV different from my Technical Lead CV?" |
| **Master Profile System** | Users maintain comprehensive "master resume" with all experiences, then selectively include/exclude for each tailored version. Like a "career journal." | MEDIUM | Best practice: Users keep one complete profile, then create pruned versions for specific jobs. Enhancv calls this "My Content" feature. Essential for power users. |

### Anti-Features (Commonly Requested, Often Problematic)

Features that seem good but create problems.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| **Overly Creative Templates** | Users think colorful, graphic-heavy templates look impressive and will stand out. | ATS systems fail to parse graphics, tables, columns, text boxes. 95% of creative templates cause auto-rejection. Colors and icons break parsing. | Provide 2-3 "creative" templates labeled as "Human review only - NOT ATS-safe" for specific use cases (design portfolios, internal transfers). Default to ATS-safe templates. |
| **AI "Write Everything for Me"** | Users want to click one button and get complete AI-generated CV without any input. | Produces generic, empty, boring content. Missing personal facts and achievements. Recruiters spot AI-generated resumes immediately in 2026. Reduces user to commodity. | AI as **assistant**, not replacement. AI suggests, user customizes. Require user input for context, then enhance with AI. Force human review/editing of AI content. |
| **Keyword Stuffing** | Users think cramming job description keywords will boost ATS scores. | Modern AI-powered ATS (2026) scans for context, not just keywords. Keyword stuffing gets flagged as manipulation. Reads unnaturally to humans. | Semantic keyword matching - naturally incorporate keywords into existing bullet points. Contextual placement, not lists. |
| **Complete Automation (No User Editing)** | Users want "one-click resume" with zero effort. | Removes user's unique voice and story. Creates generic, templated output. Users need to own their narrative. | Guided AI assistance with required user input at key decision points. Make AI **transparent** - show what it changed and why. |
| **Social Features** | Users request profile sharing, community features, "upvote best CVs," peer reviews. | Scope creep. Not core value. Privacy concerns (CVs contain personal data). Maintenance burden. Distraction from core job search workflow. | Focus on individual experience. Provide best-practice examples as references, not user-generated content. |
| **Job Board Integration** | Users want "Apply with 1 click to 100 jobs." | Quality over quantity. Spray-and-pray doesn't work. Each application should be tailored. Integration complexity, maintenance burden. | Keep focus on **tailored** applications. Users should be intentional about each application, not auto-spam. Provide URL → Tailored CV workflow instead. |
| **Video Resumes / Portfolios** | Users think multimedia CVs will impress. | Most ATS can't process videos. Adds complexity. Not standard format. Most recruiters prefer text for initial screening. | Defer to post-MVP. Allow optional link to external portfolio/website in contact section. |
| **Blockchain-Verified Credentials** | Users think blockchain will make CVs more trustworthy. | Overhyped. Hiring managers don't understand or care about blockchain. Adds complexity without solving real problem. Background checks handle verification. | Traditional format. Focus on clarity and presentation, not unproven tech. |

## Feature Dependencies

```
[Master Profile Storage]
    └──requires──> [Profile Input Forms] (personal, experience, skills, education)
                       └──requires──> [Data Validation] (required fields, formats)

[Job URL Input]
    └──requires──> [URL Scraping Service]
                       └──requires──> [Job Description Extraction] (parse HTML/text)
                                          └──requires──> [Keyword/Requirement Extraction]

[AI CV Tailoring]
    ├──requires──> [Master Profile Data]
    ├──requires──> [Extracted Job Requirements]
    └──requires──> [LLM API Integration] (content rewriting)

[Match Score Calculation]
    ├──requires──> [Job Requirements]
    ├──requires──> [CV Content]
    └──enhances──> [Real-Time ATS Scoring]

[PDF Export]
    ├──requires──> [Template Rendering]
    ├──requires──> [CV Content]
    └──requires──> [PDF Generation Library]

[Split-Screen Preview]
    ├──requires──> [Real-Time Rendering]
    └──enhances──> [User Editing Experience]

[Version Management]
    ├──requires──> [Master Profile]
    └──enhances──> [CV Tailoring Workflow]

[ATS Optimization]
    ├──conflicts──> [Creative Templates] (graphics break ATS)
    └──requires──> [Format Validation] (check fonts, structure, columns)
```

### Dependency Notes

- **Master Profile is foundational**: All other features depend on having structured profile data. Must be built first.
- **Job URL → AI Tailoring is the core workflow**: URL input → scraping → extraction → tailoring. This is the value chain that differentiates Maxed-CV.
- **ATS Optimization conflicts with Creative Templates**: If users choose creative templates, must explicitly warn they are NOT ATS-safe.
- **Match Score enhances Real-Time ATS Scoring**: Both analyze job fit, but match score is content-based while ATS scoring is format-based. Complementary features.
- **Version Management requires Master Profile**: Users can't manage versions without a source of truth (master profile).

## MVP Definition

### Launch With (v1)

Minimum viable product - what's needed to validate core value proposition.

- [ ] **Master Profile Storage** - Users can input and save personal details, work experience, education, skills, certifications. SA-specific fields (notice period, languages, driver's license). CRUD operations.
- [ ] **Job URL Input & Scraping** - Paste job posting URL, system scrapes and extracts job description text. Must handle common SA job boards (Careers24, Pnet, LinkedIn).
- [ ] **AI Job Requirement Extraction** - Parse job description to identify key responsibilities, required skills, qualifications. Extract keywords.
- [ ] **AI CV Tailoring** - Generate tailored CV from master profile matched to job requirements. Rewrite bullet points with relevant keywords, prioritize matching experience, optimize for ATS.
- [ ] **ATS-Safe Template (Single Option)** - One clean, professional, ATS-optimized template. Single-column, standard fonts, no graphics. Simple but effective.
- [ ] **Split-Screen Preview** - Real-time preview showing CV as user edits. Highlight AI changes (what was added/modified).
- [ ] **PDF Export (Text-Based)** - Download tailored CV as ATS-compatible PDF with auto-generated contextual filename.
- [ ] **Match Score** - Show percentage match between CV and job description with basic breakdown (skills matched, keywords included).
- [ ] **Freemium Gate** - 3 free tailored CVs, then paywall. Simple credit system.

**Rationale**: These features deliver the core value: "Paste job URL → Get tailored, ATS-optimized CV in minutes." Everything else is enhancement.

### Add After Validation (v1.x)

Features to add once core is working and users validate the concept.

- [ ] **Real-Time ATS Scoring** - Live feedback on ATS compatibility issues (formatting, parsing problems, keyword density). Requires deeper ATS simulation logic.
- [ ] **AI Bullet Point Optimization** - Allow users to manually request AI rewrite of specific bullet points with different tones (concise, achievement-focused, technical).
- [ ] **Keyword Gap Analysis** - Visual interface showing missing critical keywords with suggestions for where to add them.
- [ ] **Multiple Resume Versions** - Save and manage multiple tailored versions with labels ("Software Engineer at Google," "Tech Lead at Startup").
- [ ] **Version Comparison** - Side-by-side diff showing what changed between versions.
- [ ] **Additional ATS-Safe Templates** - 2-3 more professional templates with slight visual variations (but all ATS-compatible).
- [ ] **DOCX Export** - Offer .docx download option for maximum ATS compatibility (some systems prefer Word).
- [ ] **SA English Proofing** - Spell-check and language suggestions specific to South African English.
- [ ] **Cover Letter Generation** - AI-generated cover letter based on CV and job description. Many users need this as companion feature.

**Trigger for adding**: User feedback requests, analytics showing drop-off points, competitive pressure.

### Future Consideration (v2+)

Features to defer until product-market fit is established.

- [ ] **Mobile App** - Native iOS/Android apps for on-the-go editing. Significant dev effort, unclear demand.
- [ ] **Job Application Tracking** - Dashboard to track which jobs applied to, application status, follow-ups. Scope creep, but some competitors (Teal, Huntr) offer this.
- [ ] **Portfolio/Projects Showcase** - Dedicated section for projects with images, links, descriptions. Useful for developers/designers, but niche.
- [ ] **Interview Prep Integration** - Generate likely interview questions based on job description. Different product category, but natural extension.
- [ ] **LinkedIn Profile Optimization** - Analyze LinkedIn profile and suggest improvements. Adjacent value, but requires LinkedIn API access.
- [ ] **Salary Insights** - Show typical salary ranges for role based on job description. Data sourcing challenge, but valuable.
- [ ] **Multi-Language Support** - Support languages beyond English (Afrikaans, Zulu, etc.). SA is multilingual, but English dominates professional world.
- [ ] **Team/Agency Features** - Allow recruiters/agencies to manage multiple candidates. Different user persona, requires B2B pivot.

**Why defer**: These are "nice to have" but don't validate core hypothesis. Risk scope creep before achieving product-market fit. Add based on user demand, not speculation.

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Master Profile Storage | HIGH | MEDIUM | P1 |
| Job URL Scraping | HIGH | HIGH | P1 |
| AI Job Requirement Extraction | HIGH | HIGH | P1 |
| AI CV Tailoring | HIGH | HIGH | P1 |
| ATS-Safe Template (1) | HIGH | LOW | P1 |
| Split-Screen Preview | HIGH | MEDIUM | P1 |
| PDF Export | HIGH | LOW | P1 |
| Match Score | HIGH | MEDIUM | P1 |
| Freemium Gate | HIGH | LOW | P1 |
| Real-Time ATS Scoring | HIGH | HIGH | P2 |
| AI Bullet Optimization | MEDIUM | MEDIUM | P2 |
| Keyword Gap Analysis | MEDIUM | MEDIUM | P2 |
| Multiple Resume Versions | HIGH | MEDIUM | P2 |
| Version Comparison | MEDIUM | MEDIUM | P2 |
| Additional Templates (2-3) | MEDIUM | MEDIUM | P2 |
| DOCX Export | MEDIUM | LOW | P2 |
| SA English Proofing | MEDIUM | MEDIUM | P2 |
| Cover Letter Generation | MEDIUM | HIGH | P2 |
| Mobile App | LOW | HIGH | P3 |
| Job Application Tracking | MEDIUM | HIGH | P3 |
| Portfolio Showcase | LOW | MEDIUM | P3 |
| Interview Prep | MEDIUM | HIGH | P3 |
| LinkedIn Optimization | MEDIUM | HIGH | P3 |
| Salary Insights | MEDIUM | HIGH | P3 |
| Multi-Language Support | LOW | HIGH | P3 |
| Team/Agency Features | LOW | HIGH | P3 |

**Priority key:**
- P1: Must have for launch - delivers core value proposition
- P2: Should have - add when possible to stay competitive
- P3: Nice to have - future consideration based on demand

## Competitor Feature Analysis

| Feature | Rezi | Teal | Resume.io | TailoredCV | Maxed-CV Approach |
|---------|------|------|-----------|------------|-------------------|
| **Job URL Input** | No (manual paste) | No (manual paste) | No (manual paste) | Yes (URL or manual) | **Yes** - Core differentiator |
| **AI Tailoring** | Yes (keyword-based) | Yes (contextual) | Yes (basic) | Yes (semantic matching) | **Yes** - Job URL workflow |
| **Match Score** | Yes (real-time) | Yes (with breakdown) | No | Yes (coverage analysis) | **Yes** - P1 feature |
| **ATS Scoring** | Yes (real-time) | Yes | Yes | Yes | P2 (after MVP) |
| **Master Profile** | Yes | Yes | Yes | Limited | **Yes** - P1 feature |
| **Version Management** | Yes | Yes (integrated with job tracker) | Yes | Limited | P2 |
| **Split-Screen Preview** | Yes | Yes | Yes | Yes | **Yes** - P1 feature |
| **Templates (ATS-Safe)** | 6+ | 20+ | 100+ | Limited | 1 for MVP, expand P2 |
| **PDF Export** | Yes | Yes | Yes | Yes | **Yes** - P1 feature |
| **DOCX Export** | Yes | Yes | Yes | No | P2 |
| **Bullet Point AI** | Yes | Yes | Yes | Yes | P2 |
| **Cover Letter Gen** | Yes | Yes | Yes | Limited | P2 |
| **Job Tracking** | No | **Yes** (major feature) | No | No | P3 |
| **SA-Specific** | No | No | No | No | **Yes** - Differentiator |
| **Pricing** | $29/mo | $49/mo (premium) | $24.95/mo | Pay-per-use | Freemium (3 free) |

### Key Competitive Insights

**What works:**
- **Rezi**: Real-time ATS scoring is killer feature. Users love instant feedback. Freemium model with generous free tier.
- **Teal**: Integration of job tracking with resume building is powerful. Keeps users in platform throughout job search. Higher price justified by comprehensive feature set.
- **TailoredCV**: Job URL input exists but not widely adopted. Implementation seems basic. Opportunity for Maxed-CV to do it better.
- **Resume.io**: Massive template library is attractive, but ATS safety varies. Users confused about which templates are ATS-safe.

**What doesn't work:**
- **Manual job description paste**: Friction point. Users often don't paste full description, leading to poor tailoring.
- **Too many templates**: Choice paralysis. Resume.io has 100+ templates but no clear guidance on which are ATS-safe.
- **Hidden paywalls**: Resume-Now and others criticized for advertising "free" then blocking download. Damages trust.
- **Generic AI output**: Users complain AI suggestions are bland and generic when not given enough context.

**Maxed-CV's competitive position:**
- **Unique**: Job URL → Auto-scraping → Tailoring workflow. Only TailoredCV has URL input, but not as core feature.
- **SA-specific**: No major competitor focuses on South African market. Local terminology, formats, expectations.
- **Transparent freemium**: 3 free tailored CVs, then pay. Clear limit, no hidden paywalls.
- **Quality over quantity**: Few ATS-safe templates (start with 1), but every template is guaranteed to pass ATS. No confusion.

## What Makes a CV Truly ATS-Optimized?

Based on research, ATS optimization requires adherence to specific technical and content requirements:

### Format Requirements (Critical)

1. **File Format**: DOCX is safest. PDFs work if text-based (selectable text), but some ATS struggle with PDFs. Never use image-based PDFs or scanned documents.

2. **Layout**:
   - **Single-column only**: Multi-column layouts cause parsing errors because ATS reads left-to-right, top-to-bottom.
   - **No tables**: Tables break parsing. Use simple text formatting.
   - **No text boxes**: ATS ignores or scrambles text in text boxes.
   - **No headers/footers**: Information in headers/footers may not be parsed.

3. **Fonts**:
   - Standard fonts only: Arial, Calibri, Cambria, Times New Roman, Helvetica, Georgia
   - Size: 10-12pt for body, 12-14pt for headings
   - No decorative or script fonts

4. **Graphics & Design**:
   - **No images**: ATS cannot read text in images
   - **No charts/graphs**: Skill bars, competency charts, infographics all break parsing
   - **No icons**: Social media icons, bullet point icons cause parsing failures
   - **Minimal color**: Black text on white background is safest. Some ATS struggle with colored text.

5. **Section Headings**:
   - Use standard heading names: "Work Experience," "Education," "Skills," "Certifications"
   - Avoid creative headings like "My Journey," "Where I've Been," "Toolkit"
   - ATS looks for specific section names to categorize content

### Content Requirements (Critical)

1. **Keyword Matching**:
   - Use **exact terminology** from job description. Don't use synonyms.
   - If job says "Project Management," don't say "Project Coordination"
   - If job says "Python," don't just say "Programming languages"
   - Spell out acronyms with abbreviation in parentheses: "Applicant Tracking System (ATS)"

2. **Keyword Context**:
   - Modern AI-powered ATS (2026) use semantic analysis, not just keyword matching
   - Keywords must appear in context, not just listed
   - Example: "Managed Python development projects" vs "Skills: Python"
   - Keyword stuffing is detected and penalized

3. **Keyword Threshold**:
   - Research suggests **>65% keyword match** is minimum to pass ATS screening
   - Match score includes: hard skills, soft skills, responsibilities, qualifications

4. **Action Verbs & Metrics**:
   - Start bullet points with strong action verbs: "Developed," "Managed," "Led," "Designed," "Implemented"
   - Include quantifiable metrics: "Increased revenue by 20%," "Managed team of 8," "Reduced bugs by 15%"
   - ATS scores higher for measurable achievements vs generic duties

5. **Relevant Experience Prioritization**:
   - Most relevant experience should appear first (reverse chronological within sections)
   - Irrelevant experience can be omitted or condensed
   - ATS gives higher weight to recent experience

### Technical Parsing Requirements

1. **File Size**: Keep under 200KB for PDFs, under 300KB for DOCX
2. **Date Formats**: Use consistent format (MM/YYYY or Month YYYY)
3. **Contact Information**: Place at top. Use standard labels (Email:, Phone:, LinkedIn:)
4. **No Special Characters**: Avoid symbols like ©, ™, €, decorative bullets
5. **Standard Bullet Points**: Use simple dashes or circles, not custom icons

### Testing ATS Compatibility

Users should be able to test by:
1. **Copy-paste test**: Copy CV content and paste into plain text editor. If formatting is scrambled, ATS will struggle.
2. **ATS simulator tools**: Services like Jobscan, Resume Worded that simulate ATS parsing.
3. **Maxed-CV's Real-Time ATS Scoring** (P2 feature): Automatic parsing validation with issue flagging.

### South African ATS Considerations

- SA job boards (Careers24, Pnet, LinkedIn SA) use standard ATS systems (Taleo, Workday, Greenhouse)
- Same formatting rules apply
- SA-specific fields (notice period, driver's license, languages) should be in standard text format, not tables
- Avoid ID numbers (privacy + discrimination concerns), but if required by employer, use standard text format

## Implementation Notes for Developers

### ATS-Safe Template Checklist

When building templates, ensure:
- [ ] Single-column layout
- [ ] Standard fonts (Arial, Calibri, Times New Roman) in 10-12pt
- [ ] No tables, text boxes, or columns
- [ ] No images, graphics, icons, or charts
- [ ] Standard section headings
- [ ] Black text on white background
- [ ] Simple bullet points (dashes or circles)
- [ ] Contact info at top in plain text
- [ ] File export as both DOCX and text-based PDF

### AI Tailoring Algorithm Requirements

1. **Keyword Extraction**: Parse job description to identify required skills, qualifications, responsibilities
2. **Semantic Matching**: Map user's experience to job requirements (not just exact keyword matching)
3. **Content Rewriting**: Rewrite bullet points to naturally incorporate job keywords while maintaining user's voice
4. **Prioritization**: Reorder experience sections to highlight most relevant experience first
5. **Gap Detection**: Identify missing keywords and suggest where to add them
6. **Natural Language**: Avoid robotic, templated phrasing. Maintain conversational professional tone.

### Match Score Calculation

Components:
1. **Skills Coverage**: % of required skills mentioned in CV
2. **Responsibility Alignment**: How well experience matches job responsibilities
3. **Keyword Density**: Presence of critical keywords (but not over-optimization)
4. **Impact Signals**: Presence of metrics, achievements, measurable results
5. **Overall Score**: Weighted average, typically need >65% to pass ATS

Display to user:
- Overall percentage: "Your CV matches 72% of job requirements"
- Breakdown by category: "Skills: 80%, Responsibilities: 70%, Keywords: 65%"
- Missing elements: "Add these keywords: Docker, Agile, Stakeholder Management"
- Improvement suggestions: "Quantify your achievements in bullet point 3"

## Sources

### AI-Powered Resume Features
- [8 Best AI Resume Builders 2026: Tried and Tested Tools](https://www.rezi.ai/posts/best-ai-resume-builders)
- [Rezi - Free AI Resume Builder](https://www.rezi.ai)
- [Teal - AI Resume Builder](https://www.tealhq.com/tools/resume-builder)
- [Enhancv - AI Resume Builder](https://enhancv.com/ai-resume-builder/)

### ATS Optimization Requirements
- [ATS Resume Templates: Recruiter Friendly Format (2026)](https://resume.io/resume-templates/ats)
- [ATS-Friendly Resume in 2026](https://www.jobscan.co/blog/20-ats-friendly-resume-templates/)
- [How to Optimize Resume for ATS in 2026](https://cvanywhere.com/blog/optimize-resume-for-ats)
- [ATS Resume Format (2026): 7 Rules to Pass Any Filter](https://www.resumeadapter.com/blog/optimize-resume-for-ats)
- [ATS Resume Format 2026: The Only Resume Design Guide You Need](https://scale.jobs/blog/ats-resume-format-2026-design-guide)

### Table Stakes Features & User Expectations
- [How to Make a Resume Stand Out in 2026](https://www.tealhq.com/post/how-to-make-a-resume-stand-out)
- [50+ Essential Resume Statistics for 2026](https://resumegenius.com/blog/resume-help/resume-statistics)
- [15 Current Resume Trends for 2026](https://www.resume-now.com/job-resources/resumes/resume-trends)
- [10 Best AI Resume Builders of 2026](https://www.beamjobs.com/resume-help/best-resume-builders)
- [15 Best Resume Builders 2026 | Ranked by ATS & AI Features](https://uppl.ai/best-resume-builders/)

### CV Tailoring & Job Matching
- [TailoredCV - Tailor Resume to Job Description with AI](https://tailoredcv.ai/)
- [Huntr - Resume Tailor](https://huntr.co/product/resume-tailor)
- [Best AI Resume Optimization And Tailoring Tools of 2026](https://www.reztune.com/blog/best-ai-resume-tailoring-2025/)

### Resume Builder Features & Pricing
- [Top 10 Resume Builders of 2026](https://www.kickresume.com/en/help-center/10-best-resume-builders/)
- [Comparing AI Resume Builders: Features and Pricing](https://www.acedit.ai/blog/comparing-ai-resume-builders-features-and-pricing)
- [Best Free AI Resume Builders in 2026](https://pitchmeai.com/blog/best-free-ai-resume-builders)

### Export Formats & Compatibility
- [Can ATS Read PDF Resumes in 2026?](https://smallpdf.com/blog/do-applicant-tracking-systems-prefer-resumes-in-pdf-format)
- [Best Resume Formats for 2026](https://100percentresumes.com/blog/resume-format-2026)
- [3 Ways to Save Your Resume for ATS Systems](https://www.resumesthatshine.com/3-ways-to-save-your-resume-for-ats-systems-to-pdf-or-not-to-pdf-that-is-the-question/)

### Resume Mistakes & Anti-Features
- [11 Resume Mistakes to Avoid in 2026](https://www.tealhq.com/post/biggest-resume-mistakes-to-avoid)
- [Resume Mistakes 2026: What to Avoid and Fix](https://medium.com/@cokesmercado/the-biggest-resume-mistakes-professionals-still-make-in-2026-and-how-to-fix-them-aa70c84c8406)
- [What NOT to Include on Your Resume in 2026](https://resumeshaperai.com/what-not-to-include-on-resume-2026/)
- [Top 15 Resume Mistakes That Can Cost You the Job in 2026](https://neuracv.com/blog/top-resume-mistakes)

### South African CV Format
- [CV format South Africa](https://www.myperfectcv.co.uk/cv/formats/south-africa)
- [How to Write a CV in South Africa: A Guide to Getting Noticed](https://danandatalent.net/how-to-write-a-cv-in-south-africa-a-guide-to-getting-noticed/)
- [Compiling a Curriculum Vitae | South African Government](https://www.gov.za/issues/compiling-curriculum-vitae)

### Template Design & ATS Safety
- [Modern Resume Templates for 2026: Downloadable, ATS-Safe Designs](https://pitchmeai.com/blog/modern-ats-friendly-resume-templates)
- [Professional ATS Resume Templates](https://resumeworded.com/resume-templates)
- [16 ATS-Friendly Resume Templates](https://novoresume.com/career-blog/ats-friendly-resume-templates)

### Version Management & Job Tracking
- [Huntr - Job Application Tracker](https://huntr.co/)
- [9 Best AI Resume Builders of 2026](https://www.tealhq.com/post/best-ai-resume-builders)
- [Jobscan ATS Resume Checker and Job Search Tools](https://www.jobscan.co/)

### Real-Time Preview & Interface
- [Top 10 Resume Builders of 2026: We Tried Them All](https://www.kickresume.com/en/help-center/10-best-resume-builders/)
- [Free Resume Builder for 2026 | CV Maker | Novoresume](https://novoresume.com/)

### Cover Letter Generation
- [Top Free AI Cover Letter Generators in 2026](https://www.interviewpal.com/blog/top-free-ai-cover-letter-generators-in-2025-ranked)
- [10 Best AI Cover Letter Generators 2026](https://www.rezi.ai/posts/best-ai-cover-letter-builders)
- [Jobscan AI Cover Letter](https://www.jobscan.co/cover-letter-generator)

---
*Feature research for: Maxed-CV (AI-Powered CV Tailoring Platform for South African Job Market)*
*Researched: 2026-02-07*
*Confidence: MEDIUM-HIGH (verified with multiple current sources, some SA-specific data limited)*
