---
phase: 03-master-profile-management
plan: 04
subsystem: profile-management-ui
tags: [react, dnd-kit, drag-drop, work-experience, modal-forms, typescript]
requires: [03-01, 03-02, 03-03]
provides:
  - "Complete work experience CRUD UI with drag-drop reordering"
  - "Reusable SortableItem wrapper for all profile sections"
  - "Reusable DeleteConfirmDialog for all profile sections"
  - "Dynamic bullet point management with drag-drop within job entries"
affects: [03-05, 03-06]
tech-stack:
  added:
    - "@radix-ui/react-checkbox: Accessible checkbox component from shadcn/ui"
    - "shadcn/ui Card components: Card, CardContent for experience cards"
  patterns:
    - "render props pattern for SortableItem to expose drag handles"
    - "optimistic updates in SortableExperienceList for immediate UI feedback"
    - "useFieldArray for dynamic form fields (bullet points)"
    - "controlled Dialog state with external open/onOpenChange props"
key-files:
  created:
    - frontend/app/profile/components/experience/ExperienceCard.tsx
    - frontend/app/profile/components/experience/ExperienceFormDialog.tsx
    - frontend/app/profile/components/experience/BulletPointList.tsx
    - frontend/app/profile/components/experience/SortableExperienceList.tsx
    - frontend/app/profile/components/experience/ExperienceSection.tsx
    - frontend/app/profile/components/shared/DeleteConfirmDialog.tsx
    - frontend/app/profile/components/shared/SortableItem.tsx
    - frontend/app/profile/components/wizard/steps/ExperienceStep.tsx
    - frontend/components/ui/checkbox.tsx
    - frontend/components/ui/card.tsx
  modified:
    - frontend/app/profile/components/wizard/WizardContext.tsx
    - frontend/app/profile/components/wizard/ProfileWizard.tsx
decisions:
  - id: D-03-04-01
    choice: "Render props pattern for SortableItem"
    rationale: "Allows flexible placement of drag handles and content without tight coupling"
  - id: D-03-04-02
    choice: "Separate BulletPointList component with nested dnd-kit context"
    rationale: "Isolates bullet point drag-drop from card drag-drop, prevents interference"
  - id: D-03-04-03
    choice: "Optimistic updates in SortableExperienceList"
    rationale: "Immediate visual feedback improves UX, reverts on API failure"
  - id: D-03-04-04
    choice: "type=\"month\" for date inputs"
    rationale: "Native HTML5 month picker provides consistent UX across browsers"
  - id: D-03-04-05
    choice: "Show first 3 bullet points with expand/collapse"
    rationale: "Prevents long cards from dominating screen space, progressive disclosure"
  - id: D-03-04-06
    choice: "Added refreshProfile() to WizardContext"
    rationale: "Needed for sections to sync data after CRUD operations without full page reload"
duration: 7.7min
completed: 2026-02-08
---

# Phase 03 Plan 04: Work Experience Section Summary

**One-liner:** Complete work experience CRUD with modal forms, dynamic bullet points, and two-level drag-drop reordering (cards and bullets)

## What Was Built

### Core Components

**Experience Management:**
- **ExperienceCard**: Summary card showing job title, company, date range, location, and expandable bullet points (first 3 shown by default)
- **ExperienceFormDialog**: Modal form with React Hook Form, Zod validation, date inputs, current position checkbox, and dynamic bullet point management
- **BulletPointList**: Nested drag-drop list for bullet points using useFieldArray, with add/remove controls
- **SortableExperienceList**: Main drag-drop container for experience cards with optimistic updates and backend persistence
- **ExperienceSection**: Top-level section with empty state, CRUD operations, and dialog state management

**Reusable Components:**
- **SortableItem**: Generic drag-drop wrapper using render props pattern for flexible drag handle placement
- **DeleteConfirmDialog**: Reusable confirmation dialog for all profile sections

**Wizard Integration:**
- **ExperienceStep**: Wizard step wrapper with navigation buttons and step completion logic
- **WizardContext enhancement**: Added refreshProfile() method for data synchronization after mutations

### Key Features

1. **Two-Level Drag-and-Drop:**
   - Experience cards can be reordered via drag handles
   - Bullet points within each job can be reordered independently
   - Separate dnd-kit contexts prevent interference

2. **Form Validation:**
   - Zod schema validates required fields (job title, company, start date)
   - Cross-field validation ensures end date is after start date
   - Minimum 1 bullet point enforced
   - Current position checkbox disables end date field

3. **Empty State:**
   - Briefcase icon with friendly message
   - Clear call-to-action button
   - Appears when no experiences exist

4. **Optimistic Updates:**
   - Drag-drop reordering updates UI immediately
   - Reverts on API failure
   - Improves perceived performance

5. **Progressive Disclosure:**
   - Experience cards show first 3 bullet points
   - "Show N more..." link expands full list
   - Prevents UI clutter

## Verification Results

All verification criteria met:
1. ✅ Experience section shows empty state when profile has no experiences
2. ✅ Add Experience opens modal, filling and saving creates a card
3. ✅ Edit opens modal with pre-filled data, saving updates the card
4. ✅ Bullet points can be added/removed in modal form
5. ✅ Experience cards can be reordered via drag-and-drop
6. ✅ Delete shows confirmation dialog, confirms removes the entry
7. ✅ All operations call correct backend API endpoints

TypeScript compilation: ✅ No errors

## Task Commits

| Task | Description | Commit | Files |
|------|-------------|--------|-------|
| 1 | Build ExperienceCard, ExperienceFormDialog, BulletPointList, DeleteConfirmDialog | 1722df0 | ExperienceCard.tsx, ExperienceFormDialog.tsx, BulletPointList.tsx, DeleteConfirmDialog.tsx, card.tsx, checkbox.tsx |
| 2 | Build SortableItem, SortableExperienceList, ExperienceSection, ExperienceStep | bd46a8c | SortableItem.tsx, SortableExperienceList.tsx, ExperienceSection.tsx, ExperienceStep.tsx, WizardContext.tsx, ProfileWizard.tsx |

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] Added refreshProfile() to WizardContext**
- **Found during:** Task 2, integrating ExperienceStep
- **Issue:** WizardContext had no method to refresh profile data after CRUD operations
- **Fix:** Added refreshProfile() async method that calls profileAPI.getProfile() and updates state
- **Files modified:** frontend/app/profile/components/wizard/WizardContext.tsx
- **Commit:** bd46a8c
- **Rationale:** Without this, experience section would need full page reload to see changes, breaking SPA experience

**2. [Rule 1 - Bug] Fixed TypeScript type inference with Zod default values**
- **Found during:** Task 1, implementing ExperienceFormDialog
- **Issue:** Zod schema with `.default(false)` on `current` field caused type inference issues with React Hook Form
- **Fix:** Removed type annotation from useForm, let TypeScript infer from resolver
- **Files modified:** frontend/app/profile/components/experience/ExperienceFormDialog.tsx
- **Commit:** 1722df0
- **Rationale:** Type inference mismatch prevented compilation

**3. [Rule 3 - Missing] Added shadcn/ui Card and Checkbox components**
- **Found during:** Task 1, starting implementation
- **Issue:** Plan referenced Card and Checkbox components but they weren't installed
- **Fix:** Ran `npx shadcn@latest add card checkbox --yes`
- **Files created:** frontend/components/ui/card.tsx, frontend/components/ui/checkbox.tsx
- **Commit:** 1722df0
- **Rationale:** Blocking issue - couldn't implement ExperienceCard without Card component

## Technical Insights

### Drag-and-Drop Architecture

**Nested DndContext Isolation:**
```typescript
// BulletPointList has its own DndContext
<DndContext sensors={sensors} onDragEnd={handleDragEnd}>
  <SortableContext items={fields.map(f => f.id)}>
    {/* Bullet point items */}
  </SortableContext>
</DndContext>

// SortableExperienceList has separate DndContext
<DndContext sensors={sensors} onDragEnd={handleDragEnd}>
  <SortableContext items={experiences.map(e => e.id)}>
    {/* Experience cards */}
  </SortableContext>
</DndContext>
```

Each level has independent sensors and collision detection, preventing interference.

**Render Props for Flexibility:**
```typescript
<SortableItem id={experience.id}>
  {(dragHandleProps) => (
    <ExperienceCard dragHandleProps={dragHandleProps} {...} />
  )}
</SortableItem>
```

This pattern allows each component to decide where to place the drag handle without SortableItem knowing component-specific structure.

### Form State Management

**useFieldArray for Dynamic Fields:**
```typescript
const { fields, append, remove, move } = useFieldArray({
  control: form.control,
  name: 'bulletPoints',
})
```

Critical: Use `field.id` as React key (NOT index) to prevent state loss during reordering.

**Conditional Field Disabling:**
```typescript
const isCurrent = form.watch('current')

useEffect(() => {
  if (isCurrent) {
    form.setValue('endDate', undefined)
  }
}, [isCurrent, form])
```

Watching form values enables reactive field behavior (checkbox disables date picker).

### Optimistic UI Updates

```typescript
const [items, setItems] = useState(experiences)

const handleDragEnd = async (event) => {
  // Update local state immediately
  const newItems = arrayMove(items, oldIndex, newIndex)
  setItems(newItems)

  try {
    // Persist to backend
    await profileAPI.reorderSection('experience', reorderPayload)
  } catch (error) {
    // Revert on failure
    setItems(items)
  }
}
```

Users see instant feedback, and failures gracefully revert without confusing intermediate states.

## Patterns Established

These components establish patterns for remaining sections (Education, Projects, Certifications):

1. **Section Structure:**
   - Section component manages CRUD state and dialogs
   - Sortable list handles drag-drop
   - Card component displays summary
   - Form dialog handles add/edit
   - Wizard step wraps section with navigation

2. **Reusable Components:**
   - SortableItem works for any draggable content
   - DeleteConfirmDialog works for any entity type
   - Pattern scales to all remaining sections

3. **State Management:**
   - WizardContext owns profile data
   - Sections receive data as props
   - Sections call refreshProfile() after mutations
   - No local state duplication

## Next Phase Readiness

**Ready for Phase 3 continuation:**
- ✅ Experience section fully functional
- ✅ Drag-drop patterns established
- ✅ Reusable components available
- ✅ Form validation patterns proven
- ✅ Empty states handled

**Remaining sections can follow this template:**
- Education: Similar card + form, no bullet points
- Projects: Card + form with technologies array
- Certifications: Simple card + form
- Skills: Different pattern (tag selection), addressed in 03-05

**No blockers or concerns.**

## Self-Check: PASSED

All created files exist:
- ✅ frontend/app/profile/components/experience/ExperienceCard.tsx
- ✅ frontend/app/profile/components/experience/ExperienceFormDialog.tsx
- ✅ frontend/app/profile/components/experience/BulletPointList.tsx
- ✅ frontend/app/profile/components/experience/SortableExperienceList.tsx
- ✅ frontend/app/profile/components/experience/ExperienceSection.tsx
- ✅ frontend/app/profile/components/shared/DeleteConfirmDialog.tsx
- ✅ frontend/app/profile/components/shared/SortableItem.tsx
- ✅ frontend/app/profile/components/wizard/steps/ExperienceStep.tsx
- ✅ frontend/components/ui/checkbox.tsx
- ✅ frontend/components/ui/card.tsx

All commits exist:
- ✅ 1722df0
- ✅ bd46a8c
