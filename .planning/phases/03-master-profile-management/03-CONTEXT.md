# Phase 3: Master Profile Management - Context

**Gathered:** 2026-02-08
**Status:** Ready for planning

<domain>
## Phase Boundary

Users create and manage comprehensive master profiles containing all CV data (personal details, work experience, skills, education, projects, certifications). This phase focuses on data collection and management — getting user information into the system and making it editable. AI-powered CV generation happens in Phase 5, and PDF export happens in Phase 6.

</domain>

<decisions>
## Implementation Decisions

### Profile Creation Flow
- Multi-step wizard with 4 steps: Personal → Experience → Education/Certs → Skills
- Step 1 (Personal Info) requires: name, email, phone, location (notice period and bio optional)
- Users can skip any step (including Experience, Education, Skills) — profiles can be incomplete
- Progress indicator shows which step user is on and which steps have been completed
- Each step saves independently (no "lose all progress" risk)

### Work Experience Editing
- Add/Edit job form appears in modal/dialog overlay (not inline or separate page)
- Each bullet point is a separate text field with '+ Add achievement' button to add more
- Drag-and-drop handles (⋮⋮ icon) for reordering jobs and bullet points within jobs
- Display mode: Summary cards showing job title, company, dates, and first 2-3 bullet points with '...more' expansion
- Click 'Edit' to open modal with full job details

### Skills Organization
- Tag-based system with autocomplete/auto-suggest from common skills database
- Free-form entry but guided to prevent inconsistent naming (e.g., suggest "JavaScript" when user types "JS")
- Skills displayed as tags/chips (can add, remove, reorder)
- No mandatory proficiency levels or categories (keeps entry fast and flexible)

### Sections & Structure
- Separate sections: Projects (distinct from Work Experience), Education, Certifications
- Projects section includes: name, description, technologies used, URL (optional)
- Education: institution, degree, field of study, dates
- Certifications: name, issuer, issue date, credential ID (optional)
- Overall section order when viewing/editing profile:
  1. Personal Info
  2. Skills
  3. Work Experience
  4. Education
  5. Projects
  6. Certifications

### Claude's Discretion
- Exact validation rules for dates (e.g., end date after start date, "Present" handling)
- Delete confirmation dialog design and copy
- Auto-save vs manual save behavior
- Error handling and validation messaging
- Empty state illustrations and messaging for sections with no entries
- Mobile responsive behavior for drag-and-drop

</decisions>

<specifics>
## Specific Ideas

- Skills section leads (appears before Experience) to emphasize capabilities upfront — less conventional than chronological CVs but user prefers this approach
- Wizard allows skipping to support users without formal education or with sparse profiles early on
- Auto-suggest for skills prevents fragmentation (JavaScript vs JS vs ECMAScript) while keeping entry fast

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 03-master-profile-management*
*Context gathered: 2026-02-08*
