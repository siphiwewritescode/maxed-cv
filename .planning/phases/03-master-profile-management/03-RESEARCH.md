# Phase 3: Master Profile Management - Research

**Researched:** 2026-02-08
**Domain:** React forms with complex nested data, multi-step wizards, drag-and-drop UI
**Confidence:** HIGH

## Summary

Master Profile Management requires building sophisticated form experiences: multi-step wizard with skippable steps, dynamic nested arrays (work experience with bullet points), drag-and-drop reordering, and tag-based autocomplete for skills. The research confirms the existing stack (Next.js 14, React Hook Form, Zod, Prisma) aligns perfectly with current best practices for this domain.

The standard approach in 2026 uses React Hook Form with Zod validation for type-safe forms, useFieldArray for dynamic nested data, dnd-kit for accessible drag-and-drop, and shadcn/ui components (Dialog, Form, Empty states). The key architectural insight is that each form step should save independently to prevent data loss, with validation scoped per-step rather than globally.

**Primary recommendation:** Use React Hook Form's useFieldArray for work experience/bullet points management, dnd-kit for reordering with keyboard accessibility built-in, and step-based validation with independent saves to prevent progress loss. On the backend, leverage Prisma's nested create/update operations but avoid the common pitfall of mixing create operations with ID references.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Profile Creation Flow:**
- Multi-step wizard with 4 steps: Personal → Experience → Education/Certs → Skills
- Step 1 (Personal Info) requires: name, email, phone, location (notice period and bio optional)
- Users can skip any step (including Experience, Education, Skills) — profiles can be incomplete
- Progress indicator shows which step user is on and which steps have been completed
- Each step saves independently (no "lose all progress" risk)

**Work Experience Editing:**
- Add/Edit job form appears in modal/dialog overlay (not inline or separate page)
- Each bullet point is a separate text field with '+ Add achievement' button to add more
- Drag-and-drop handles (⋮⋮ icon) for reordering jobs and bullet points within jobs
- Display mode: Summary cards showing job title, company, dates, and first 2-3 bullet points with '...more' expansion
- Click 'Edit' to open modal with full job details

**Skills Organization:**
- Tag-based system with autocomplete/auto-suggest from common skills database
- Free-form entry but guided to prevent inconsistent naming (e.g., suggest "JavaScript" when user types "JS")
- Skills displayed as tags/chips (can add, remove, reorder)
- No mandatory proficiency levels or categories (keeps entry fast and flexible)

**Sections & Structure:**
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

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope
</user_constraints>

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React Hook Form | 7.x | Form state management | Industry standard for performance (uncontrolled components, minimal re-renders), native TypeScript support, 1.3M+ weekly downloads |
| Zod | 3.25.x | Runtime validation + TypeScript types | z.infer provides automatic type safety, integrates seamlessly with React Hook Form via @hookform/resolvers, already in project |
| @hookform/resolvers | latest | Bridge between RHF and Zod | Official adapter for validation library integration |
| dnd-kit | latest | Drag-and-drop toolkit | Modern (2026 recommended), accessible (keyboard + screen reader built-in), lightweight (~10kb), zero dependencies, supports touch/mobile |
| Prisma Client | 5.22.x | Database ORM | Already in project, excellent nested create/update operations, type-safe queries |
| class-validator | 0.14.x | Backend DTO validation | NestJS standard for request validation, already in project |
| class-transformer | 0.5.x | DTO transformation | Required for nested object validation with class-validator, already in project |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| shadcn/ui Dialog | latest | Modal overlays | For job edit forms, delete confirmations (built on Radix UI, accessible) |
| shadcn/ui Form | latest | Form components | Wraps React Hook Form with consistent styling and error display |
| shadcn/ui Empty | latest | Empty state components | When sections have no data (e.g., no work experience added yet) |
| react-tag-autocomplete | latest | Tag input with autocomplete | Skills tag input with auto-suggest functionality |
| date-fns or dayjs | latest | Date manipulation | Validating date ranges, formatting dates, handling "Present" |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| dnd-kit | react-beautiful-dnd | react-beautiful-dnd is deprecated (archived on GitHub), migration to Pragmatic Drag and Drop recommended but dnd-kit is more actively maintained |
| dnd-kit | Pragmatic Drag and Drop | Built by Atlassian, framework-agnostic (not React-specific), may be overkill for this use case, dnd-kit more React-idiomatic |
| React Hook Form | Formik | Formik has larger bundle size, more re-renders, React Hook Form is current standard (2026) |
| React Hook Form | TanStack Form | Both supported by shadcn/ui, TanStack Form is newer, React Hook Form has larger ecosystem and more examples |

**Installation:**
```bash
# Frontend
cd frontend
npm install react-hook-form @hookform/resolvers
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
npm install react-tag-autocomplete
npm install date-fns

# Backend (already installed)
# class-validator, class-transformer, @prisma/client already in package.json
```

## Architecture Patterns

### Recommended Project Structure
```
frontend/src/
├── app/
│   └── profile/
│       ├── create/              # Multi-step wizard pages
│       │   ├── page.tsx         # Main wizard container
│       │   └── steps/           # Step components
│       ├── edit/                # Edit profile page
│       │   └── page.tsx
│       └── components/          # Profile-specific components
│           ├── wizard/
│           │   ├── ProfileWizard.tsx
│           │   ├── StepIndicator.tsx
│           │   └── steps/
│           │       ├── PersonalInfoStep.tsx
│           │       ├── ExperienceStep.tsx
│           │       ├── EducationCertsStep.tsx
│           │       └── SkillsStep.tsx
│           ├── experience/
│           │   ├── ExperienceCard.tsx
│           │   ├── ExperienceForm.tsx    # Modal form
│           │   └── BulletPointList.tsx   # Drag-drop list
│           ├── skills/
│           │   └── SkillsTagInput.tsx
│           └── sections/        # Reusable section components
│               ├── ProjectsSection.tsx
│               ├── EducationSection.tsx
│               └── CertificationsSection.tsx
├── components/ui/               # shadcn/ui components
│   ├── dialog.tsx
│   ├── form.tsx
│   ├── empty.tsx
│   └── ...
├── lib/
│   ├── validations/
│   │   └── profile.ts           # Zod schemas
│   └── skills-database.ts       # Common skills list
└── types/
    └── profile.ts               # TypeScript types

backend/src/
├── profile/
│   ├── profile.controller.ts
│   ├── profile.service.ts
│   ├── profile.module.ts
│   ├── dto/
│   │   ├── create-profile.dto.ts
│   │   ├── update-profile.dto.ts
│   │   ├── work-experience.dto.ts
│   │   ├── education.dto.ts
│   │   ├── project.dto.ts
│   │   └── certification.dto.ts
│   └── entities/
│       └── profile.entity.ts
└── prisma/
    └── schema.prisma
```

### Pattern 1: Multi-Step Wizard with Independent Saves
**What:** Each wizard step manages its own form state and saves to backend independently. Navigation is permissive (allows skipping), but progress is preserved.

**When to use:** When building multi-step forms where data loss on navigation is unacceptable, or when users may not complete all steps in one session.

**Example:**
```typescript
// Source: Based on https://medium.com/@wdswy/how-to-build-a-multi-step-form-using-nextjs-typescript-react-context-and-shadcn-ui-ef1b7dcceec3

// Context for wizard state
type WizardContextType = {
  currentStep: number
  completedSteps: Set<number>
  goToStep: (step: number) => void
  markStepComplete: (step: number) => void
}

// Each step component handles its own save
function PersonalInfoStep() {
  const { markStepComplete, goToStep } = useWizardContext()
  const form = useForm<PersonalInfoSchema>({
    resolver: zodResolver(personalInfoSchema),
  })

  const onSubmit = async (data: PersonalInfoSchema) => {
    try {
      await savePersonalInfo(data) // API call
      markStepComplete(1)
      goToStep(2) // Move to next step
    } catch (error) {
      form.setError('root', { message: 'Failed to save' })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* Fields */}
        <Button type="submit">Save & Continue</Button>
        <Button type="button" onClick={() => goToStep(2)}>Skip</Button>
      </form>
    </Form>
  )
}
```

### Pattern 2: Dynamic Nested Arrays with useFieldArray
**What:** Use React Hook Form's useFieldArray for managing dynamic lists (work experience, bullet points). Each item gets a stable ID for proper React keys.

**When to use:** Any time you have "add/remove" item functionality in forms (work experience entries, bullet points, education entries, etc.).

**Example:**
```typescript
// Source: https://react-hook-form.com/docs/usefieldarray

function ExperienceForm() {
  const { control, handleSubmit } = useForm<ExperienceFormData>()
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "bulletPoints",
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {fields.map((field, index) => (
        <div key={field.id}> {/* Use field.id, NOT index */}
          <input {...register(`bulletPoints.${index}.text`)} />
          <button type="button" onClick={() => remove(index)}>
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => append({ text: '' })}
      >
        + Add Achievement
      </button>
    </form>
  )
}
```

### Pattern 3: Drag-and-Drop with dnd-kit
**What:** Use dnd-kit's sortable preset for reorderable lists. Provides keyboard navigation and screen reader support out of the box.

**When to use:** Reordering work experience entries, reordering bullet points within a job, reordering skills tags.

**Example:**
```typescript
// Source: Based on dnd-kit documentation https://dndkit.com/

import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

function SortableItem({ id, children }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style}>
      <div {...attributes} {...listeners} className="drag-handle">
        ⋮⋮
      </div>
      {children}
    </div>
  )
}

function BulletPointList({ items, onReorder }) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (active.id !== over.id) {
      const oldIndex = items.findIndex(item => item.id === active.id)
      const newIndex = items.findIndex(item => item.id === over.id)
      onReorder(oldIndex, newIndex)
    }
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        {items.map(item => (
          <SortableItem key={item.id} id={item.id}>
            {item.text}
          </SortableItem>
        ))}
      </SortableContext>
    </DndContext>
  )
}
```

### Pattern 4: Zod Schema with Date Range Validation
**What:** Use Zod's .refine() for cross-field validation (end date after start date, optional "Present" handling).

**When to use:** Work experience dates, education dates, certification dates.

**Example:**
```typescript
// Source: Based on https://onur1337.medium.com/using-zod-to-validate-date-range-picker-76145ea28e8a

import { z } from 'zod'

const workExperienceSchema = z.object({
  jobTitle: z.string().min(1, 'Job title is required'),
  company: z.string().min(1, 'Company is required'),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional(),
  current: z.boolean().default(false),
  bulletPoints: z.array(z.object({
    text: z.string().min(1, 'Achievement cannot be empty')
  })).min(1, 'Add at least one achievement'),
}).refine((data) => {
  // If current job, end date should be empty
  if (data.current && data.endDate) return false
  // If not current and end date exists, must be after start date
  if (!data.current && data.endDate) {
    return data.endDate > data.startDate
  }
  return true
}, {
  message: "End date must be after start date",
  path: ["endDate"],
})

// Infer TypeScript type from schema
type WorkExperienceFormData = z.infer<typeof workExperienceSchema>
```

### Pattern 5: NestJS Nested DTO Validation
**What:** Use @ValidateNested() with @Type() for validating nested objects and arrays in DTOs.

**When to use:** Backend validation for profile creation/update with nested work experience, education, etc.

**Example:**
```typescript
// Source: Based on https://medium.com/@mohantaankit2002/handling-nested-object-validations-in-nestjs-without-breaking-type-safety-d647d2a2689c

import { IsString, IsBoolean, IsOptional, IsArray, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

class BulletPointDto {
  @IsString()
  text: string
}

class WorkExperienceDto {
  @IsString()
  jobTitle: string

  @IsString()
  company: string

  @IsString()
  startDate: string

  @IsOptional()
  @IsString()
  endDate?: string

  @IsBoolean()
  current: boolean

  @IsArray()
  @ValidateNested({ each: true }) // Validate each item in array
  @Type(() => BulletPointDto)
  bulletPoints: BulletPointDto[]
}

class CreateProfileDto {
  @IsString()
  name: string

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WorkExperienceDto)
  workExperience: WorkExperienceDto[]
}
```

### Pattern 6: Prisma Schema for Nested Profile Data
**What:** One-to-many relations for profile sections. Each section references the profile via foreign key.

**When to use:** Modeling profile data structure in database.

**Example:**
```prisma
// Source: Based on https://www.prisma.io/docs/orm/prisma-schema/data-model/relations/one-to-many-relations

model Profile {
  id                String             @id @default(cuid())
  userId            String             @unique
  user              User               @relation(fields: [userId], references: [id], onDelete: Cascade)

  // Personal info
  name              String
  email             String
  phone             String
  location          String
  noticePeriod      String?
  bio               String?

  // Relations to sections
  workExperience    WorkExperience[]
  education         Education[]
  projects          Project[]
  certifications    Certification[]
  skills            Skill[]

  createdAt         DateTime           @default(now())
  updatedAt         DateTime           @updatedAt
}

model WorkExperience {
  id           String         @id @default(cuid())
  profileId    String
  profile      Profile        @relation(fields: [profileId], references: [id], onDelete: Cascade)

  jobTitle     String
  company      String
  startDate    DateTime
  endDate      DateTime?
  current      Boolean        @default(false)
  order        Int            @default(0) // For drag-drop ordering

  bulletPoints BulletPoint[]

  createdAt    DateTime       @default(now())
  updatedAt    DateTime       @updatedAt
}

model BulletPoint {
  id               String          @id @default(cuid())
  workExperienceId String
  workExperience   WorkExperience  @relation(fields: [workExperienceId], references: [id], onDelete: Cascade)

  text             String
  order            Int             @default(0) // For drag-drop ordering

  createdAt        DateTime        @default(now())
  updatedAt        DateTime        @updatedAt
}

model Skill {
  id        String   @id @default(cuid())
  profileId String
  profile   Profile  @relation(fields: [profileId], references: [id], onDelete: Cascade)

  name      String
  order     Int      @default(0)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Anti-Patterns to Avoid

- **Using array index as React key in useFieldArray:** Always use field.id from useFieldArray, never the index. Index-based keys break when items are reordered or removed.
- **Global form validation in multi-step wizards:** Each step should have its own validation schema. Global validation prevents users from skipping steps and makes error handling complex.
- **Mixing create with ID references in Prisma nested writes:** When using nested create, either provide the full nested object OR provide the ID to link an existing record, but don't mix both in the same operation.
- **Forgetting `each: true` for array validation in NestJS:** When validating arrays of objects with @ValidateNested(), you must include `{ each: true }` or only the array itself is validated, not its contents.
- **Not handling loading/error states in dialogs:** Modal forms should disable submit button and show loading state while saving, and display errors inline without closing the dialog.

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Form state management for complex forms | Custom useState for each field | React Hook Form + useFieldArray | Handles performance (uncontrolled components), validation, error handling, nested arrays, field dependencies. Custom solutions re-render on every keystroke and struggle with dynamic fields. |
| Drag-and-drop with reordering | Custom mouse/touch event handlers | dnd-kit or Pragmatic Drag and Drop | Accessibility (keyboard nav, screen readers), touch device support, collision detection, auto-scrolling, drag previews. Custom solutions miss edge cases and accessibility requirements. |
| Date range validation | Custom date comparison functions | Zod with .refine() or date-fns | Handles timezones, leap years, daylight savings, internationalization, optional end dates ("Present"). Custom solutions have subtle bugs. |
| Tag input with autocomplete | Custom input + dropdown | react-tag-autocomplete or shadcn/ui Combobox | Accessibility (keyboard nav, ARIA), deduplication, fuzzy matching, mobile touch support. Custom solutions miss accessibility and UX polish. |
| Nested object validation (backend) | Manual recursive validation | class-validator with @ValidateNested() | Type safety, automatic error path generation (which field failed), composition of validators. Manual validation loses type safety and produces poor error messages. |
| Multi-step wizard progress tracking | Custom step state in URL/localStorage | React Context + localStorage persistence | State synchronization across components, browser back button handling, progress persistence on refresh. Custom solutions have sync issues. |

**Key insight:** Form complexity explodes with dynamic fields, nested data, and validation. React Hook Form + Zod handle 90% of edge cases (field arrays, conditional validation, async validation, error handling) that custom solutions miss. Drag-and-drop accessibility is extremely difficult to get right—keyboard navigation, screen reader support, touch gestures require libraries like dnd-kit.

## Common Pitfalls

### Pitfall 1: Data Loss on Navigation in Multi-Step Wizards
**What goes wrong:** User fills out a form step, accidentally navigates away (back button, clicks a link, closes browser), and loses all progress.

**Why it happens:** Form state lives in component memory (React state), not persisted. No save until final submission.

**How to avoid:**
- Save each step independently to backend on "Save & Continue"
- Persist to localStorage as backup for network failures
- Add browser "beforeunload" warning if unsaved changes exist
- Show visual confirmation when step is saved ("Saved at 12:05 PM")

**Warning signs:**
- No API call until final step submission
- Form state only in React state, no localStorage or backend persistence
- No unsaved changes warning when navigating away

### Pitfall 2: Using Index as Key in useFieldArray
**What goes wrong:** Items shift or duplicate when reordering or deleting. Inputs lose focus or show wrong data.

**Why it happens:** React reconciliation uses keys to track which elements changed. When index is used as key and items reorder, React mismatches old and new positions.

**How to avoid:**
```typescript
// WRONG
{fields.map((field, index) => (
  <input key={index} {...register(`items.${index}.name`)} />
))}

// CORRECT
const { fields } = useFieldArray({ control, name: 'items' })
{fields.map((field, index) => (
  <input key={field.id} {...register(`items.${index}.name`)} /> // Use field.id
))}
```

**Warning signs:**
- Strange behavior when reordering or deleting items
- Input values appearing in wrong fields
- Form validation errors on wrong fields

### Pitfall 3: Forgetting Cascading Deletes in Prisma Schema
**What goes wrong:** Deleting a profile or work experience entry leaves orphaned records (bullet points, skills) in database. Database grows with garbage data.

**Why it happens:** Default Prisma behavior is to restrict deletes if related records exist. Must explicitly configure cascade.

**How to avoid:**
```prisma
model Profile {
  id             String           @id @default(cuid())
  workExperience WorkExperience[]
}

model WorkExperience {
  id           String        @id @default(cuid())
  profileId    String
  profile      Profile       @relation(fields: [profileId], references: [id], onDelete: Cascade) // Add onDelete: Cascade
  bulletPoints BulletPoint[]
}

model BulletPoint {
  id               String         @id @default(cuid())
  workExperienceId String
  workExperience   WorkExperience @relation(fields: [workExperienceId], references: [id], onDelete: Cascade)
}
```

**Warning signs:**
- Prisma errors when trying to delete records with relations
- Database row counts growing despite deletions
- Orphaned records appearing in queries

### Pitfall 4: Not Validating Nested Objects in NestJS DTOs
**What goes wrong:** Backend accepts invalid nested data (missing required fields, wrong types in work experience bullet points). Database gets corrupt data.

**Why it happens:** Forgot @ValidateNested() and @Type() decorators. class-validator only validates top-level fields by default.

**How to avoid:**
```typescript
class CreateProfileDto {
  @IsArray()
  @ValidateNested({ each: true }) // REQUIRED for array items
  @Type(() => WorkExperienceDto)  // REQUIRED for class transformation
  workExperience: WorkExperienceDto[]
}
```

**Warning signs:**
- Validation errors not caught at API layer
- Database constraints failing instead of DTO validation failing
- Invalid nested data reaching service layer

### Pitfall 5: Race Conditions with Prisma Nested Upsert
**What goes wrong:** Two concurrent upsert operations on the same record both think record doesn't exist. Both try to create. One succeeds, one throws unique constraint error.

**Why it happens:** Upsert performs read (does record exist?) then write (create or update). If two requests check simultaneously, both see "doesn't exist" and both try to create.

**How to avoid:**
- Use transactions for operations that must be atomic
- Handle unique constraint errors gracefully (retry with update)
- Consider row-level locking for high-concurrency scenarios
- Use idempotency keys for profile creation

**Warning signs:**
- Intermittent unique constraint violations in logs
- Errors only appear under load/concurrent requests
- Retry logic helps but doesn't eliminate issue

### Pitfall 6: Poor Mobile Experience with Drag-and-Drop
**What goes wrong:** Drag-and-drop works on desktop but completely broken on mobile/tablet. Users can't reorder items on touch devices.

**Why it happens:** HTML5 drag-and-drop API doesn't support touch events by default. Custom mouse-only implementations miss touch.

**How to avoid:**
- Use library with touch support built-in (dnd-kit, Pragmatic Drag and Drop)
- Test on actual mobile devices, not just Chrome DevTools emulation
- Provide alternative reordering UI for mobile (up/down buttons)
- Use pointer events (not mouse events) for custom implementations

**Warning signs:**
- Drag handles don't respond to touch
- Works in desktop Chrome but not mobile Safari
- No touch event handlers in code

### Pitfall 7: Inconsistent Skill Names Fragmenting Data
**What goes wrong:** Users enter "JavaScript", "javascript", "JS", "ECMAScript" for same skill. Analytics and skill matching become useless.

**Why it happens:** Free-form text input with no normalization or suggestions.

**How to avoid:**
- Autocomplete from curated skills database (suggest "JavaScript" when typing "js")
- Normalize on save (lowercase, trim, canonical mapping)
- Show existing skills as suggestions
- Prevent duplicates in UI (check if skill already exists)

**Warning signs:**
- Skills table has hundreds of variants of same skill
- Autocomplete database is free-form user input (not curated)
- No deduplication logic when adding skills

## Code Examples

Verified patterns from official sources:

### Auto-Save with Debounce (React Hook Form)
```typescript
// Source: Based on https://darius-marlowe.medium.com/smarter-forms-in-react-building-a-useautosave-hook-with-debounce-and-react-query-d4d7f9bb052e

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useDebouncedCallback } from 'use-debounce'

function ProfileForm() {
  const { watch, ...form } = useForm()

  const debouncedSave = useDebouncedCallback(
    async (data) => {
      try {
        await saveProfile(data)
        // Show "Saved" indicator
      } catch (error) {
        // Show error, retry later
      }
    },
    1500 // 1.5 second delay
  )

  // Watch all form values and trigger save on change
  useEffect(() => {
    const subscription = watch((data) => {
      debouncedSave(data)
    })
    return () => subscription.unsubscribe()
  }, [watch, debouncedSave])

  return <form>{/* fields */}</form>
}
```

### Empty State Component (shadcn/ui)
```typescript
// Source: Based on https://ui.shadcn.com/docs/components/radix/empty

import { EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription, EmptyContent } from '@/components/ui/empty'
import { BriefcaseIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

function WorkExperienceSection({ experiences, onAdd }) {
  if (experiences.length === 0) {
    return (
      <div className="empty">
        <EmptyHeader>
          <EmptyMedia>
            <BriefcaseIcon className="w-12 h-12 text-muted-foreground" />
          </EmptyMedia>
          <EmptyTitle>No work experience yet</EmptyTitle>
          <EmptyDescription>
            Add your work history to build your profile. Include job titles, companies, and key achievements.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button onClick={onAdd}>+ Add Work Experience</Button>
        </EmptyContent>
      </div>
    )
  }

  return (
    <div>
      {experiences.map(exp => <ExperienceCard key={exp.id} {...exp} />)}
    </div>
  )
}
```

### Dialog with Form (shadcn/ui)
```typescript
// Source: Based on https://blog.greenroots.info/shadcn-dialog-with-form-three-tips

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

function EditJobDialog({ open, onOpenChange, job, onSave }) {
  const form = useForm({
    resolver: zodResolver(workExperienceSchema),
    defaultValues: job || {
      jobTitle: '',
      company: '',
      // ...
    },
  })

  const onSubmit = async (data) => {
    try {
      await onSave(data)
      form.reset()
      onOpenChange(false)
    } catch (error) {
      form.setError('root', { message: 'Failed to save' })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{job ? 'Edit' : 'Add'} Work Experience</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="jobTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Title</FormLabel>
                  <FormControl>
                    <input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* More fields */}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Saving...' : 'Save'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
```

### Prisma Nested Create Operation
```typescript
// Source: Based on https://www.prisma.io/docs/orm/prisma-client/queries/relation-queries

// In profile.service.ts
async createProfile(userId: string, data: CreateProfileDto) {
  return this.prisma.profile.create({
    data: {
      userId,
      name: data.name,
      email: data.email,
      phone: data.phone,
      location: data.location,
      noticePeriod: data.noticePeriod,
      bio: data.bio,
      workExperience: {
        create: data.workExperience.map((exp, index) => ({
          jobTitle: exp.jobTitle,
          company: exp.company,
          startDate: new Date(exp.startDate),
          endDate: exp.endDate ? new Date(exp.endDate) : null,
          current: exp.current,
          order: index,
          bulletPoints: {
            create: exp.bulletPoints.map((bullet, bIndex) => ({
              text: bullet.text,
              order: bIndex,
            })),
          },
        })),
      },
      skills: {
        create: data.skills.map((skill, index) => ({
          name: skill,
          order: index,
        })),
      },
    },
    include: {
      workExperience: {
        include: {
          bulletPoints: true,
        },
        orderBy: { order: 'asc' },
      },
      skills: {
        orderBy: { order: 'asc' },
      },
    },
  })
}
```

### Skills Database with Normalization
```typescript
// Source: Based on industry common skills lists
// lib/skills-database.ts

export const COMMON_SKILLS = [
  // Programming Languages
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C#', 'Go', 'Rust', 'PHP', 'Ruby', 'Swift', 'Kotlin',

  // Frontend
  'React', 'Vue.js', 'Angular', 'Next.js', 'Svelte', 'HTML', 'CSS', 'Tailwind CSS', 'SASS/SCSS',

  // Backend
  'Node.js', 'Express.js', 'NestJS', 'Django', 'Flask', 'Spring Boot', 'ASP.NET Core', 'Ruby on Rails',

  // Databases
  'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'SQLite', 'SQL Server', 'Oracle', 'DynamoDB',

  // Cloud & DevOps
  'AWS', 'Azure', 'Google Cloud Platform', 'Docker', 'Kubernetes', 'Terraform', 'Ansible', 'Jenkins', 'GitHub Actions',

  // Tools
  'Git', 'Linux', 'REST APIs', 'GraphQL', 'CI/CD', 'Agile', 'Scrum', 'JIRA',

  // AI/ML
  'Machine Learning', 'TensorFlow', 'PyTorch', 'Natural Language Processing', 'Computer Vision',

  // Data
  'Data Analysis', 'SQL', 'Data Visualization', 'ETL', 'Apache Spark', 'Pandas', 'NumPy',

  // Security
  'Cybersecurity', 'Penetration Testing', 'Network Security', 'Application Security',
] as const

// Canonical mapping for common variants
export const SKILL_ALIASES: Record<string, string> = {
  'js': 'JavaScript',
  'javascript': 'JavaScript',
  'ts': 'TypeScript',
  'typescript': 'TypeScript',
  'py': 'Python',
  'python': 'Python',
  'reactjs': 'React',
  'react.js': 'React',
  'vuejs': 'Vue.js',
  'vue': 'Vue.js',
  'nextjs': 'Next.js',
  'next': 'Next.js',
  'nodejs': 'Node.js',
  'node': 'Node.js',
  'postgresql': 'PostgreSQL',
  'postgres': 'PostgreSQL',
  'aws': 'AWS',
  'amazon web services': 'AWS',
  'gcp': 'Google Cloud Platform',
  'google cloud': 'Google Cloud Platform',
}

export function normalizeSkill(input: string): string {
  const trimmed = input.trim().toLowerCase()
  return SKILL_ALIASES[trimmed] || input.trim()
}

export function suggestSkills(input: string): string[] {
  const normalized = input.toLowerCase().trim()
  return COMMON_SKILLS.filter(skill =>
    skill.toLowerCase().includes(normalized)
  ).slice(0, 5)
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| react-beautiful-dnd | dnd-kit or Pragmatic Drag and Drop | 2023 (archived) | react-beautiful-dnd is no longer maintained, active migration to modern alternatives |
| Formik | React Hook Form | ~2021-2022 | Better performance (uncontrolled components), smaller bundle, current standard |
| Manual date validation | Zod + .refine() or date-fns | 2023+ | Type safety, cleaner validation, less boilerplate |
| Yup for validation | Zod for validation | 2022+ | Zod provides TypeScript-first validation with z.infer, better DX |
| Individual @radix-ui/react-* packages | Unified radix-ui package | February 2026 | Cleaner imports, single dependency (shadcn/ui new-york style) |
| class-validator decorators | Zod or TypeBox in NestJS | Emerging 2026 | Some teams prefer runtime type checking over decorators, but class-validator still dominant |

**Deprecated/outdated:**
- **react-beautiful-dnd**: Archived on GitHub in 2023, officially recommends migration to Pragmatic Drag and Drop. Still works but no new features or bug fixes.
- **Formik**: Not deprecated but no longer the recommended standard. React Hook Form has better performance and ecosystem adoption in 2026.

## Open Questions

Things that couldn't be fully resolved:

1. **Skills database source and maintenance**
   - What we know: Need curated list of common skills for autocomplete, with canonical mappings (JS → JavaScript)
   - What's unclear: Should skills DB be static (in code) or dynamic (admin-editable)? How to keep it current as new technologies emerge?
   - Recommendation: Start with static list in code (lib/skills-database.ts) based on current job market trends (Python, JavaScript, AWS, etc.). Plan for admin panel in future phase if fragmentation becomes problem. LOW confidence on long-term approach.

2. **Auto-save vs manual save UX decision**
   - What we know: Auto-save prevents data loss but can feel intrusive if too frequent. Manual save gives control but risks data loss.
   - What's unclear: Best UX for this application's users (South African job seekers). Cultural preference? Device constraints (mobile data costs)?
   - Recommendation: Hybrid approach—manual "Save & Continue" buttons (explicit), plus auto-save to localStorage as backup (invisible). Show "Saved" indicator after manual save. Test with users in UAT. MEDIUM confidence.

3. **Mobile drag-and-drop fallback strategy**
   - What we know: dnd-kit supports touch, but drag-and-drop UX on small screens can be frustrating
   - What's unclear: Should mobile users get different UI (up/down arrow buttons) or same drag handles?
   - Recommendation: Implement drag handles (dnd-kit touch support) for mobile, but also add up/down arrow buttons as alternative for users who struggle with drag gestures. Feature detect screen size to show/hide arrows. MEDIUM confidence.

4. **POPIA compliance for profile data retention**
   - What we know: POPIA requires data not be stored longer than necessary, and CVs are personal information requiring protection
   - What's unclear: Exact retention period for inactive profiles, user consent requirements for AI processing (Phase 5)
   - Recommendation: Implement soft-delete with 30-day retention for user-deleted profiles. Add consent checkbox for AI processing before Phase 5. Consult POPIA compliance expert before production launch. MEDIUM confidence (legal question, not technical).

## Sources

### Primary (HIGH confidence)
- React Hook Form documentation - https://react-hook-form.com/docs/usefieldarray
- Zod documentation - https://zod.dev/
- Prisma documentation - https://www.prisma.io/docs/orm/prisma-schema/data-model/relations/one-to-many-relations
- NestJS Prisma guide - https://docs.nestjs.com/recipes/prisma
- dnd-kit documentation - https://dndkit.com/
- shadcn/ui documentation - https://ui.shadcn.com/docs/forms

### Secondary (MEDIUM confidence)
- [How To Build a Multi-Step Form using NextJS, TypeScript, React Context, And Shadcn UI](https://medium.com/@wdswy/how-to-build-a-multi-step-form-using-nextjs-typescript-react-context-and-shadcn-ui-ef1b7dcceec3)
- [React Hook Form with Zod: Complete Guide for 2026](https://dev.to/marufrahmanlive/react-hook-form-with-zod-complete-guide-for-2026-1em1)
- [Top 5 Drag-and-Drop Libraries for React in 2026](https://puckeditor.com/blog/top-5-drag-and-drop-libraries-for-react)
- [10 Best Autocomplete Components For React And React Native (2026 Update)](https://reactscript.com/best-autocomplete/)
- [Building a REST API with NestJS and Prisma](https://www.prisma.io/blog/nestjs-prisma-rest-api-7D056s1BmOL0)
- [Handling Nested Object Validations in NestJS Without Breaking Type Safety](https://medium.com/@mohantaankit2002/handling-nested-object-validations-in-nestjs-without-breaking-type-safety-d647d2a2689c)
- [Using Zod to validate date range picker](https://onur1337.medium.com/using-zod-to-validate-date-range-picker-76145ea28e8a)
- [Taming the dragon: Accessible drag and drop – React Spectrum Blog](https://react-spectrum.adobe.com/blog/drag-and-drop.html)
- [Smarter Forms in React: Building a useAutoSave Hook with Debounce and React Query](https://darius-marlowe.medium.com/smarter-forms-in-react-building-a-useautosave-hook-with-debounce-and-react-query-d4d7f9bb052e)
- [Understanding South Africa's POPIA](https://secureprivacy.ai/blog/south-africa-popia-compliance)
- [Empty Components for Shadcn UI](https://www.shadcnblocks.com/components/empty)
- [Effective Ways to Manage Shadcn Dialog Box: 3 Tips with Code](https://blog.greenroots.info/shadcn-dialog-with-form-three-tips)
- [Top 10 In-Demand Tech Skills for the 2026 Job Market](https://www.cogentuniversity.com/post/top-10-in-demand-tech-skills-for-the-2026-job-market)

### Tertiary (LOW confidence)
- Various GitHub discussions and issue threads (marked as needing validation in Open Questions)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - React Hook Form, Zod, dnd-kit, Prisma are all verified with official documentation and current in 2026
- Architecture: HIGH - Patterns verified from official docs (React Hook Form useFieldArray, Prisma nested creates, class-validator)
- Pitfalls: MEDIUM - Based on verified GitHub issues and community articles, but some are from discussions rather than official docs
- Skills database approach: LOW - No authoritative source for curation strategy, requires domain expertise and user testing
- POPIA compliance details: MEDIUM - General requirements verified, but legal consultation needed for specifics

**Research date:** 2026-02-08
**Valid until:** 2026-03-10 (30 days for stable technologies; React Hook Form, Zod, and Prisma are mature projects with infrequent breaking changes)
