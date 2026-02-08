---
phase: 03-master-profile-management
plan: 05
subsystem: profile-ui
tags: [react, form-ui, drag-drop, autocomplete, validation]
completed: 2026-02-08

requires:
  - 03-01-profile-api
  - 03-02-personal-info-ui
  - 03-04-work-experience-ui

provides:
  - skills-tag-input
  - education-crud-ui
  - projects-crud-ui
  - certifications-crud-ui

affects:
  - 03-06-wizard-integration

tech-stack:
  added: []
  patterns:
    - tag-input-with-autocomplete
    - debounced-autosave
    - keyboard-navigation
    - technology-badge-input

key-files:
  created:
    - frontend/app/profile/components/skills/SkillsSection.tsx
    - frontend/app/profile/components/skills/SkillsTagInput.tsx
    - frontend/app/profile/components/sections/EducationSection.tsx
    - frontend/app/profile/components/sections/EducationFormDialog.tsx
    - frontend/app/profile/components/sections/ProjectsSection.tsx
    - frontend/app/profile/components/sections/ProjectFormDialog.tsx
    - frontend/app/profile/components/sections/CertificationsSection.tsx
    - frontend/app/profile/components/sections/CertificationFormDialog.tsx
  modified: []

decisions:
  - id: skills-horizontal-sorting
    choice: Skills tags use horizontal sorting strategy for natural layout
    reasoning: Tags flow horizontally like chips in most UIs
    alternatives: [vertical-sorting, grid-sorting]
  - id: skills-debounced-save
    choice: 500ms debounce on skills save to avoid rapid API calls
    reasoning: User may add multiple skills quickly, wait for pause before saving
  - id: project-tech-simple-input
    choice: Simple input field with Enter/Add button for technologies (not tag autocomplete)
    reasoning: Users may enter custom tech stacks not in predefined list
  - id: description-truncation
    choice: Truncate project descriptions at 150 characters in card view
    reasoning: Prevents cards from becoming too tall, full text in edit mode

duration: 4.5 min
---

# Phase 3 Plan 5: Skills and Additional Sections Summary

Skills tag input with autocomplete from 90+ skills database, alias normalization, drag-and-drop reordering, and debounced autosave. Education/Projects/Certifications sections with consistent card+modal CRUD pattern, date validation, and reordering.

## What Was Built

### Skills Section
- **SkillsTagInput**: Autocomplete tag input component
  - Suggests from 90+ skills database (suggestSkills)
  - Alias normalization (JS→JavaScript, k8s→Kubernetes)
  - Duplicate prevention (case-insensitive)
  - Tag display with remove buttons (Badge + X icon)
  - Drag-and-drop reordering (horizontal strategy)
  - Keyboard navigation (arrows, Enter, Escape)
  - Debounced suggestions (150ms)
- **SkillsSection**: Auto-saving wrapper
  - Debounced save (500ms after last change)
  - Save indicator (Saving.../Saved with icons)
  - Integrates with profileAPI.updateSkills

### Education Section
- **EducationFormDialog**: Modal form with validation
  - Fields: institution, degree, fieldOfStudy, startDate, endDate
  - Month picker (type="month") for dates
  - Date range validation (end > start)
  - React Hook Form + Zod validation
- **EducationSection**: CRUD and ordering
  - Card display: institution (bold), degree + field, date range
  - Empty state: graduation cap icon
  - Drag-and-drop vertical reordering
  - Delete confirmation dialog

### Projects Section
- **ProjectFormDialog**: Modal form with tech tags
  - Fields: name, description (textarea), technologies, url
  - Tech input: simple text field with Enter/Add button
  - URL validation (Zod URL schema)
  - Character counter for description (1000 max)
- **ProjectsSection**: CRUD with rich display
  - Card display: name, description (truncated 150 chars), tech badges, URL link
  - External link icon for URLs
  - Empty state: rocket icon
  - Drag-and-drop vertical reordering

### Certifications Section
- **CertificationFormDialog**: Modal form
  - Fields: name, issuer, issueDate, credentialId
  - All fields except name/issuer are optional
  - Month picker for issueDate
- **CertificationsSection**: CRUD
  - Card display: name, issuer, issue date, credential ID
  - Empty state: award icon
  - Drag-and-drop vertical reordering

## Architecture

### Component Structure
```
profile/components/
├── skills/
│   ├── SkillsSection.tsx        (wrapper with auto-save)
│   └── SkillsTagInput.tsx       (tag input + autocomplete)
├── sections/
│   ├── EducationSection.tsx     (list + CRUD)
│   ├── EducationFormDialog.tsx  (modal form)
│   ├── ProjectsSection.tsx      (list + CRUD)
│   ├── ProjectFormDialog.tsx    (modal form)
│   ├── CertificationsSection.tsx (list + CRUD)
│   └── CertificationFormDialog.tsx (modal form)
└── shared/
    ├── DeleteConfirmDialog.tsx  (reused across sections)
    └── SortableItem.tsx         (render props for drag handle)
```

### Key Patterns

**1. Tag Input with Autocomplete**
- Debounced search (150ms) to avoid excessive filtering
- Keyboard navigation with arrow keys, Enter, Escape
- Alias normalization on add (converts abbreviations to canonical names)
- Case-insensitive duplicate prevention

**2. Debounced Auto-Save**
- Skills save after 500ms of inactivity
- Visual feedback: "Saving..." → "Saved" (800ms display)
- Prevents rapid API calls during quick edits

**3. Modal Form Pattern**
- React Hook Form + Zod validation
- useEffect to reset form when dialog opens/closes
- Loading state on submit button
- Cancel and Save buttons in footer

**4. Drag-and-Drop Reordering**
- Skills: horizontal sorting (chips flow left-to-right)
- Education/Projects/Certifications: vertical sorting (cards stack)
- SortableItem render props pattern for flexible drag handle placement
- Optimistic reordering via arrayMove
- API call to persist new order

### Data Flow

**Skills:**
1. User types → debounced suggestions (150ms)
2. User adds skill → normalizeSkill() → check duplicates → append
3. User reorders → arrayMove() → onSkillsChange
4. onSkillsChange → debounce (500ms) → profileAPI.updateSkills
5. onRefresh() to reload profile data

**Education/Projects/Certifications:**
1. User clicks Add → setSelectedItem(null) → open form dialog
2. User submits → profileAPI.add* or update* → onSave()
3. onSave() → onRefresh() → parent reloads profile
4. User drags to reorder → arrayMove() → profileAPI.reorderSection → onRefresh()
5. User deletes → DeleteConfirmDialog → profileAPI.delete* → onRefresh()

## Integration Points

**Dependencies:**
- `lib/skills-database.ts`: suggestSkills(), normalizeSkill()
- `lib/profile-api.ts`: updateSkills, add/update/delete for each section, reorderSection
- `lib/validations/profile.ts`: educationSchema, projectSchema, certificationSchema
- `components/ui/*`: Dialog, Form, Input, Textarea, Badge, Button
- `components/shared/*`: DeleteConfirmDialog, SortableItem
- `@dnd-kit/*`: DndContext, SortableContext, useSortable

**Provides to:**
- Phase 3 Plan 6 (Wizard Integration): All four section components ready to integrate into wizard steps

## User Experience

### Skills
1. User starts typing "java" → sees "Java", "JavaScript" in dropdown
2. Clicks "JavaScript" → appears as tag chip
3. Tries to add "js" → normalized to "JavaScript" → duplicate prevented
4. Drags tags to reorder → new order saved automatically (500ms debounce)
5. Sees "Saving..." → "Saved" confirmation

### Education
1. User clicks "Add Education" → modal opens
2. Fills: UCT, Bachelor of Science, Computer Science, 2018-01 to 2021-12
3. Saves → card appears with formatted info
4. Drags card to reorder → API persists order
5. Edits card → modal pre-fills data

### Projects
1. User clicks "Add Project" → modal opens
2. Enters name, description, types "React" + Enter, "Node.js" + Enter
3. Tech tags appear below input
4. Enters GitHub URL → URL validated
5. Saves → card shows name, truncated description, tech badges, link icon

### Certifications
1. User clicks "Add Certification" → modal opens
2. Enters "AWS Solutions Architect", "Amazon Web Services"
3. Optionally adds issue date and credential ID
4. Saves → card shows all info
5. Drags to reorder priority certifications

## Decisions Made

### 1. Skills Horizontal Sorting
**Decision:** Use horizontalListSortingStrategy for skills tags
**Reasoning:** Tags naturally flow left-to-right like chips in modern UIs (Gmail labels, GitHub topics). Vertical would waste space and look unnatural.
**Alternatives:** vertical (too much height), grid (complex collision detection)

### 2. Skills Debounced Save (500ms)
**Decision:** Wait 500ms after last change before saving skills
**Reasoning:** Users often add multiple skills in quick succession (e.g., "React" + "Node.js" + "PostgreSQL"). Debouncing avoids 3 API calls, batches into 1.
**Tradeoff:** User must wait 500ms after last tag before navigating away (or changes lost)

### 3. Project Tech Simple Input
**Decision:** Use simple text input + Enter/Add button for project technologies (no autocomplete)
**Reasoning:** Projects may use niche/custom tech stacks not in predefined skills database. Allowing freeform input gives flexibility.
**Alternatives:** Autocomplete from skills database (too restrictive), separate tech database (maintenance burden)

### 4. Description Truncation (150 chars)
**Decision:** Truncate project descriptions at 150 characters in card view
**Reasoning:** Prevents cards with long descriptions from dominating the screen. User can click Edit to see/edit full text.
**Alternatives:** Expand/collapse button (adds complexity), no truncation (cards vary wildly in height)

## Deviations from Plan

None - plan executed exactly as written.

## Testing Approach

### Manual Testing Checklist
- [ ] Skills: Typing "js" suggests "JavaScript" (alias normalization)
- [ ] Skills: Adding "JavaScript" twice prevented (duplicate check)
- [ ] Skills: Dragging tags reorders them
- [ ] Skills: Save indicator shows "Saving..." → "Saved"
- [ ] Education: Modal form validates required fields
- [ ] Education: End date must be after start date
- [ ] Education: Card displays institution, degree, field, dates
- [ ] Education: Drag-and-drop reordering works
- [ ] Projects: Tech input adds tags on Enter
- [ ] Projects: URL field validates format
- [ ] Projects: Description truncates at 150 chars
- [ ] Projects: External link icon appears for URLs
- [ ] Certifications: Issue date and credential ID are optional
- [ ] Certifications: Card displays all fields when present
- [ ] All sections: Delete confirmation dialog prevents accidental deletes
- [ ] All sections: Empty state shows appropriate icon and message

### Edge Cases Handled
1. **Empty skills database query**: Returns empty array, no suggestions shown
2. **Skills with special characters**: Handled by normalizeSkill trimming
3. **Date validation**: Zod refine ensures end date > start date
4. **Optional fields**: Handled via Zod .optional() and nullable types
5. **Long project descriptions**: Truncated with "..." indicator
6. **Missing project URL**: Link icon not shown
7. **Drag-and-drop failure**: User sees no change (optimistic update reverted)

## Next Phase Readiness

**Blockers:** None

**Concerns:** None

**Ready for Phase 3 Plan 6:**
- All four section components (Skills, Education, Projects, Certifications) implemented
- Components follow consistent patterns with ExperienceSection
- All integrate with profileAPI (CRUD + reordering)
- All handle empty states, loading states, error states
- Ready to add to wizard steps in Plan 6

## Task Commits

| Task | Commit  | Summary                                      |
| ---- | ------- | -------------------------------------------- |
| 1    | f25b8b4 | Add Skills section with tag input and autocomplete |
| 2    | 7812fe3 | Add Education, Projects, and Certifications sections |

## Performance Notes

- Skills autocomplete debounced at 150ms (smooth typing)
- Skills save debounced at 500ms (batches rapid changes)
- Drag-and-drop uses CSS transforms (60fps animations)
- Form validation synchronous (Zod fast for small schemas)

## Lessons Learned

1. **Horizontal drag-and-drop for tags**: Works well with horizontalListSortingStrategy, avoids line-wrap issues during drag
2. **Debounced autosave**: Provides good UX for small edits without Save button, but requires visual feedback
3. **Render props for drag handles**: SortableItem pattern allows flexible handle placement in different layouts
4. **Tech tag input**: Simple input + Enter is more flexible than autocomplete for project-specific technologies

## Self-Check: PASSED
