# Architecture Research

**Domain:** AI-Powered CV/Resume Builder Platform
**Researched:** 2026-02-07
**Confidence:** HIGH

## Standard Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Frontend Layer (Next.js)                     │
├─────────────────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐            │
│  │ Profile  │  │  Job     │  │   CV     │  │ Preview  │            │
│  │   UI     │  │  Input   │  │ Generate │  │   & DL   │            │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘            │
│       │             │             │             │                   │
│       └─────────────┴─────────────┴─────────────┘                   │
│                          │                                           │
│                     API Routes / tRPC                                │
└──────────────────────────┼──────────────────────────────────────────┘
                           │ HTTP/REST
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      Backend API Layer (NestJS)                      │
├─────────────────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐            │
│  │ Profile  │  │ Scraper  │  │   AI     │  │   PDF    │            │
│  │  Module  │  │  Module  │  │  Module  │  │  Module  │            │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘            │
│       │             │             │             │                   │
├───────┴─────────────┴─────────────┴─────────────┴──────────────────┤
│                      Services & Business Logic                       │
│  ┌────────────────────────────────────────────────────────────┐     │
│  │                    BullMQ Queue Layer                       │     │
│  │  [Job Scraping Queue] → [AI Processing Queue] → [PDF Queue]│     │
│  └────────────────────────────────────────────────────────────┘     │
├─────────────────────────────────────────────────────────────────────┤
│                         Data Access Layer                            │
│  ┌───────────────────────────────────────────────────────────┐      │
│  │              Prisma Service (Database ORM)                 │      │
│  └───────────────────────────────────────────────────────────┘      │
└──────────────────────────┼──────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       Infrastructure Layer                           │
├─────────────────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐            │
│  │PostgreSQL│  │  Redis   │  │  Gemini  │  │  Docker  │            │
│  │ Database │  │  Queue   │  │    AI    │  │Container │            │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘            │
└─────────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| **Next.js Frontend** | User interface, form handling, CV preview | App Router with Server Components, Client components for interactivity |
| **NestJS API** | Business logic orchestration, request validation | Module-based architecture with controllers, services, DTOs |
| **Profile Module** | CRUD operations for user master profiles | Controller → Service → Prisma (Repository pattern) |
| **Scraper Module** | Extract job descriptions from URLs | Service with Puppeteer/Cheerio, validation, caching |
| **AI Module** | Generate tailored CV content via Gemini | Service with async processing, prompt engineering, rate limiting |
| **PDF Module** | Convert CV data to ATS-optimized PDF | Queue-based generation with Puppeteer/PDFKit |
| **BullMQ Queues** | Background job processing, retry logic | Redis-backed queues for async operations |
| **Prisma Service** | Database access, migrations, type safety | PrismaClient wrapper with connection pooling |
| **PostgreSQL** | Persistent data storage | User profiles, job data, generated CVs, audit logs |
| **Redis** | Queue storage, caching | BullMQ job queues, optional caching layer |
| **Gemini AI** | AI content generation | External API integration with error handling |

## Recommended Project Structure

### Backend (NestJS)

```
backend/
├── src/
│   ├── modules/
│   │   ├── profile/              # Master profile management
│   │   │   ├── profile.controller.ts
│   │   │   ├── profile.service.ts
│   │   │   ├── profile.module.ts
│   │   │   └── dto/
│   │   │       ├── create-profile.dto.ts
│   │   │       └── update-profile.dto.ts
│   │   │
│   │   ├── scraper/              # Job URL scraping
│   │   │   ├── scraper.controller.ts
│   │   │   ├── scraper.service.ts
│   │   │   ├── scraper.processor.ts    # Queue worker
│   │   │   ├── scraper.module.ts
│   │   │   └── dto/
│   │   │       └── scrape-job.dto.ts
│   │   │
│   │   ├── ai/                   # AI content generation
│   │   │   ├── ai.controller.ts
│   │   │   ├── ai.service.ts
│   │   │   ├── ai.processor.ts         # Queue worker
│   │   │   ├── ai.module.ts
│   │   │   └── dto/
│   │   │       └── generate-cv.dto.ts
│   │   │
│   │   ├── pdf/                  # PDF generation
│   │   │   ├── pdf.controller.ts
│   │   │   ├── pdf.service.ts
│   │   │   ├── pdf.processor.ts        # Queue worker
│   │   │   ├── pdf.module.ts
│   │   │   └── templates/
│   │   │       └── ats-optimized.ts
│   │   │
│   │   └── auth/                 # Authentication (future)
│   │       ├── auth.controller.ts
│   │       ├── auth.service.ts
│   │       └── auth.module.ts
│   │
│   ├── common/
│   │   ├── prisma/
│   │   │   ├── prisma.service.ts       # Prisma client wrapper
│   │   │   └── prisma.module.ts
│   │   │
│   │   ├── guards/
│   │   ├── interceptors/
│   │   ├── pipes/
│   │   └── filters/
│   │
│   ├── config/
│   │   └── configuration.ts            # Environment configuration
│   │
│   ├── app.module.ts
│   └── main.ts
│
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
│
├── test/
├── Dockerfile
└── package.json
```

### Frontend (Next.js)

```
frontend/
├── src/
│   ├── app/
│   │   ├── (dashboard)/          # Authenticated routes
│   │   │   ├── profile/
│   │   │   │   ├── page.tsx      # Profile management
│   │   │   │   └── edit/page.tsx
│   │   │   │
│   │   │   ├── generate/
│   │   │   │   ├── page.tsx      # CV generation wizard
│   │   │   │   └── [jobId]/
│   │   │   │       └── page.tsx  # Preview & download
│   │   │   │
│   │   │   └── layout.tsx
│   │   │
│   │   ├── api/                  # API routes (optional)
│   │   │   └── trpc/[trpc]/route.ts
│   │   │
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   ├── components/
│   │   ├── profile/
│   │   │   ├── ProfileForm.tsx
│   │   │   └── ProfileDisplay.tsx
│   │   │
│   │   ├── cv/
│   │   │   ├── CVPreview.tsx
│   │   │   ├── CVGenerator.tsx
│   │   │   └── JobInputForm.tsx
│   │   │
│   │   └── ui/                   # Shadcn/ui components
│   │
│   ├── lib/
│   │   ├── api/
│   │   │   └── client.ts         # API client (Axios/Fetch)
│   │   │
│   │   └── utils.ts
│   │
│   └── types/
│       └── cv.types.ts
│
├── public/
├── Dockerfile
└── package.json
```

### Structure Rationale

**Module-per-Feature (NestJS):** Each business capability (Profile, Scraper, AI, PDF) is a self-contained module with its own controller, service, DTOs, and tests. This follows NestJS's recommended modular architecture and makes the codebase easier to navigate and test.

**Queue Processors Collocated:** Queue processors (`*.processor.ts`) live within their feature module rather than in a separate "jobs" folder. This keeps related code together and makes dependencies explicit.

**Shared Prisma Service:** The Prisma service is in `common/` and exported as a global module, allowing all feature modules to inject it without circular dependencies.

**Next.js App Router:** The frontend uses Next.js 14+ App Router with route groups for authenticated sections. Server Components handle data fetching, while Client Components manage interactivity.

**Separation of Concerns:** Frontend focuses on UI/UX, backend handles business logic and data persistence, and infrastructure layer (Redis, PostgreSQL, Gemini) is abstracted behind service interfaces.

## Architectural Patterns

### Pattern 1: Module-Based Domain Isolation

**What:** Each feature domain (Profile, Scraper, AI, PDF) is encapsulated in a NestJS module with clear boundaries. Modules export only what other modules need, hiding implementation details.

**When to use:** Always. This is the foundational pattern for NestJS applications and prevents the spaghetti code that plagues Express apps.

**Trade-offs:**
- **Pros:** Clear boundaries, easier testing, parallel development, prevents tight coupling
- **Cons:** More boilerplate initially, requires discipline to maintain boundaries

**Example:**
```typescript
// profile/profile.module.ts
@Module({
  imports: [PrismaModule], // Import shared services
  controllers: [ProfileController],
  providers: [ProfileService],
  exports: [ProfileService], // Export for other modules
})
export class ProfileModule {}

// ai/ai.module.ts
@Module({
  imports: [
    ProfileModule, // Import to access ProfileService
    BullModule.registerQueue({ name: 'ai-generation' }),
  ],
  controllers: [AiController],
  providers: [AiService, AiProcessor],
})
export class AiModule {}
```

### Pattern 2: Queue-Based Async Processing

**What:** Long-running operations (job scraping, AI generation, PDF creation) are processed asynchronously using BullMQ queues backed by Redis. This prevents request timeouts and allows horizontal scaling of workers.

**When to use:** Any operation that takes >2 seconds or depends on external APIs (Gemini, web scraping). Essential for AI generation and PDF rendering.

**Trade-offs:**
- **Pros:** Scalable, handles spikes, prevents timeouts, allows retries, can rate-limit
- **Cons:** Adds complexity, requires Redis, eventual consistency, polling for status

**Example:**
```typescript
// ai/ai.service.ts
@Injectable()
export class AiService {
  constructor(@InjectQueue('ai-generation') private aiQueue: Queue) {}

  async queueCvGeneration(profileId: string, jobDescription: string) {
    // Add job to queue, return immediately
    const job = await this.aiQueue.add('generate-cv', {
      profileId,
      jobDescription,
      timestamp: Date.now(),
    }, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 2000 },
    });

    return { jobId: job.id, status: 'queued' };
  }
}

// ai/ai.processor.ts
@Processor('ai-generation')
export class AiProcessor extends WorkerHost {
  async process(job: Job<{ profileId: string; jobDescription: string }>) {
    const { profileId, jobDescription } = job.data;

    // Long-running AI call happens here
    const cvContent = await this.geminiService.generateCv(profileId, jobDescription);

    // Store result in database
    await this.prisma.generatedCv.create({ data: cvContent });

    return cvContent;
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    console.log(`CV generation completed: ${job.id}`);
  }
}
```

### Pattern 3: Thin Controller, Fat Service

**What:** Controllers handle HTTP concerns (validation, response formatting) while services contain business logic. Controllers should be 5-10 lines that delegate to services.

**When to use:** Always. This is the standard NestJS pattern and makes testing business logic easier.

**Trade-offs:**
- **Pros:** Testable business logic, reusable services, clear separation of concerns
- **Cons:** More files, requires discipline to not leak business logic into controllers

**Example:**
```typescript
// profile/profile.controller.ts
@Controller('profile')
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @Post()
  async create(@Body() dto: CreateProfileDto) {
    return this.profileService.create(dto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.profileService.findOne(id);
  }
}

// profile/profile.service.ts
@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateProfileDto) {
    // Business logic: validation, transformation, persistence
    const profile = await this.prisma.profile.create({
      data: {
        ...dto,
        createdAt: new Date(),
      },
    });

    return profile;
  }

  async findOne(id: string) {
    const profile = await this.prisma.profile.findUnique({ where: { id } });
    if (!profile) {
      throw new NotFoundException(`Profile ${id} not found`);
    }
    return profile;
  }
}
```

### Pattern 4: Prisma as Data Access Layer

**What:** Prisma acts as the database abstraction layer. Don't add a repository pattern on top unless you need to switch ORMs (you won't). Inject PrismaService directly into services.

**When to use:** Always with Prisma. The repository pattern adds unnecessary abstraction since Prisma is already type-safe and testable.

**Trade-offs:**
- **Pros:** Less boilerplate, Prisma's query builder is excellent, type safety, easier mocking in tests
- **Cons:** Tight coupling to Prisma (acceptable trade-off for this project)

**Example:**
```typescript
// common/prisma/prisma.service.ts
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}

// common/prisma/prisma.module.ts
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}

// profile/profile.service.ts
@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {} // Direct injection

  async create(dto: CreateProfileDto) {
    return this.prisma.profile.create({ data: dto });
  }
}
```

### Pattern 5: Sequential Job Pipeline

**What:** For the CV generation workflow, jobs flow through a pipeline: Scrape Job → Generate AI Content → Create PDF. Each stage is a separate queue, and completion of one stage triggers the next.

**When to use:** When you have multi-step workflows where each step can fail independently and needs retries.

**Trade-offs:**
- **Pros:** Each stage can scale independently, granular retry logic, clear audit trail
- **Cons:** More complex than single queue, requires coordination, eventual consistency

**Example:**
```typescript
// Workflow coordination
class CvGenerationOrchestrator {
  constructor(
    @InjectQueue('scraper') private scraperQueue: Queue,
    @InjectQueue('ai') private aiQueue: Queue,
    @InjectQueue('pdf') private pdfQueue: Queue,
  ) {}

  async startCvGeneration(profileId: string, jobUrl: string) {
    // Step 1: Scrape job
    const scrapeJob = await this.scraperQueue.add('scrape', {
      profileId,
      jobUrl,
    });

    return { workflowId: scrapeJob.id };
  }
}

// Scraper processor triggers AI generation on completion
@Processor('scraper')
class ScraperProcessor extends WorkerHost {
  constructor(@InjectQueue('ai') private aiQueue: Queue) {}

  async process(job: Job) {
    const jobDescription = await this.scrapeJob(job.data.jobUrl);

    // Trigger next stage
    await this.aiQueue.add('generate', {
      profileId: job.data.profileId,
      jobDescription,
    });

    return jobDescription;
  }
}

// AI processor triggers PDF generation on completion
@Processor('ai')
class AiProcessor extends WorkerHost {
  constructor(@InjectQueue('pdf') private pdfQueue: Queue) {}

  async process(job: Job) {
    const cvContent = await this.generateCvContent(job.data);

    // Trigger final stage
    await this.pdfQueue.add('generate', {
      cvContent,
    });

    return cvContent;
  }
}
```

### Pattern 6: Next.js Server Actions for Mutations

**What:** Use Next.js Server Actions for form submissions and mutations instead of API routes. This reduces client-side JavaScript and provides better progressive enhancement.

**When to use:** For CRUD operations on profiles and triggering CV generation. Use API routes only for webhook endpoints or external integrations.

**Trade-offs:**
- **Pros:** Less code, better performance, type-safe, progressive enhancement
- **Cons:** Requires Next.js 14+, learning curve if team is used to REST APIs

**Example:**
```typescript
// app/profile/actions.ts
'use server'

import { revalidatePath } from 'next/cache'

export async function createProfile(formData: FormData) {
  const response = await fetch(`${process.env.BACKEND_URL}/profile`, {
    method: 'POST',
    body: JSON.stringify({
      name: formData.get('name'),
      email: formData.get('email'),
      // ...
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to create profile')
  }

  revalidatePath('/profile')
  return response.json()
}

// app/profile/page.tsx
import { createProfile } from './actions'

export default function ProfileForm() {
  return (
    <form action={createProfile}>
      <input name="name" required />
      <input name="email" type="email" required />
      <button type="submit">Create Profile</button>
    </form>
  )
}
```

## Data Flow

### Request Flow: CV Generation

```
User submits job URL + selects profile
    ↓
Next.js Server Action / API Route
    ↓
NestJS API Controller (validates request)
    ↓
Scraper Service → Adds job to 'scraper' queue
    ↓ (returns jobId immediately)
User sees "Processing..." state
    ↓
[Async] Scraper Worker
    ├─ Fetches job page with Puppeteer
    ├─ Extracts job description
    ├─ Stores in database
    └─ Adds job to 'ai' queue
        ↓
[Async] AI Worker
    ├─ Fetches profile from database
    ├─ Calls Gemini API with profile + job
    ├─ Generates tailored CV content
    ├─ Stores in database
    └─ Adds job to 'pdf' queue
        ↓
[Async] PDF Worker
    ├─ Fetches CV content from database
    ├─ Generates ATS-optimized PDF
    ├─ Stores PDF in database/file storage
    └─ Updates job status to 'completed'
            ↓
User polls for status or receives webhook
    ↓
User downloads PDF
```

### State Management

For the frontend, state management depends on complexity:

**Option A: Server State (Recommended for MVP)**
```
User action → Server Action → Database → Revalidate cache
    ↓
Next.js re-fetches data → UI updates automatically
```

**Option B: Client State (If needed for complex UX)**
```
[Zustand/Jotai Store]
    ↓ (optimistic updates)
User action → Update local state → API call
    ↓ (on success)
Update store → Components re-render
```

For Maxed-CV, **Option A** is recommended. Next.js Server Components with React Server Actions handle state naturally without client-side state management libraries.

### Key Data Flows

1. **Profile CRUD Flow:** User form → Server Action → NestJS API → Prisma → PostgreSQL → Response → Revalidate → UI update

2. **Job Scraping Flow:** URL submission → Queue job → Worker fetches page → Extract text → Cache result → Return to AI queue

3. **AI Generation Flow:** Profile + Job data → Queue job → Worker calls Gemini → Parse response → Store CV content → Trigger PDF queue

4. **PDF Download Flow:** User request → Check if PDF exists → If not, queue generation → Poll status → Return download URL

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| **0-1k users** | Single Docker container with all services. PostgreSQL and Redis on same host. No caching needed. Direct Gemini API calls with basic rate limiting. |
| **1k-10k users** | Separate containers for frontend, backend, database, Redis. Add BullMQ queues for AI and PDF. Implement connection pooling for PostgreSQL (PgBouncer). Cache job descriptions (Redis TTL). Add basic observability (logs, metrics). |
| **10k-100k users** | Horizontal scaling: multiple backend workers. Separate read replicas for PostgreSQL. CDN for static assets and PDFs. Implement API rate limiting. Add monitoring (Prometheus, Grafana). Consider object storage (S3) for PDFs. |
| **100k+ users** | Microservices split (if justified): Auth, Profile, Scraper, AI, PDF as separate services. Message bus instead of HTTP between services. Multi-region deployment. Advanced caching (CDN + Redis). Queue-based architecture with SQS/RabbitMQ. Database sharding by user ID. |

### Scaling Priorities

1. **First bottleneck: AI API rate limits**
   - **What breaks:** Gemini API has rate limits (e.g., 60 requests/minute). High concurrent usage causes failures.
   - **How to fix:** Implement queue-based processing with BullMQ rate limiting. Add `limiter` option to queue:
     ```typescript
     BullModule.registerQueue({
       name: 'ai-generation',
       limiter: {
         max: 50, // Max 50 jobs processed
         duration: 60000, // per minute
       },
     })
     ```
   - **When:** Implement from day 1 if expecting >50 users/hour.

2. **Second bottleneck: PDF generation CPU usage**
   - **What breaks:** PDF generation (Puppeteer) is CPU-intensive. Single worker can't keep up.
   - **How to fix:** Add more worker processes. BullMQ allows horizontal scaling of workers:
     ```typescript
     // Run multiple worker containers
     docker-compose scale backend-worker=4
     ```
   - **When:** When PDF queue length consistently >100 jobs.

3. **Third bottleneck: Database connections**
   - **What breaks:** PostgreSQL has connection limits (default 100). High traffic exhausts connections.
   - **How to fix:** Add PgBouncer for connection pooling. Configure Prisma to use pooled connections:
     ```prisma
     datasource db {
       provider = "postgresql"
       url      = env("DATABASE_URL")
       directUrl = env("DIRECT_DATABASE_URL") // For migrations
     }
     ```
   - **When:** When seeing "too many connections" errors. Usually around 5k-10k active users.

4. **Fourth bottleneck: Job scraping reliability**
   - **What breaks:** Job sites block scrapers, rate limit, or change HTML structure.
   - **How to fix:**
     - Use rotating proxies (BrightData, ScraperAPI)
     - Implement retry logic with exponential backoff
     - Add job site-specific scrapers
     - Cache scraped job descriptions (TTL 24 hours)
   - **When:** Scraping failure rate >10%.

## Anti-Patterns

### Anti-Pattern 1: Synchronous AI Generation

**What people do:** Call Gemini API directly from API endpoint and wait for response:
```typescript
@Post('generate')
async generateCv(@Body() dto: GenerateCvDto) {
  const cv = await this.geminiService.generate(dto); // Wait 5-15 seconds
  return cv;
}
```

**Why it's wrong:**
- Request timeout (most servers timeout at 30s)
- No retry logic if Gemini API fails
- Blocks server thread
- Poor UX (user stares at loading spinner)
- Can't scale (server runs out of threads)

**Do this instead:** Queue-based async processing:
```typescript
@Post('generate')
async generateCv(@Body() dto: GenerateCvDto) {
  const job = await this.aiQueue.add('generate', dto);
  return { jobId: job.id, status: 'queued' };
}

@Get('status/:jobId')
async getStatus(@Param('jobId') jobId: string) {
  const job = await this.aiQueue.getJob(jobId);
  return {
    status: await job.getState(),
    progress: job.progress,
    result: job.returnvalue,
  };
}
```

### Anti-Pattern 2: Repository Pattern Over Prisma

**What people do:** Wrap Prisma in repository interfaces:
```typescript
interface ProfileRepository {
  create(data: CreateProfileDto): Promise<Profile>;
  findOne(id: string): Promise<Profile>;
}

@Injectable()
class PrismaProfileRepository implements ProfileRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateProfileDto) {
    return this.prisma.profile.create({ data });
  }
}
```

**Why it's wrong:**
- Prisma is already a repository pattern (it abstracts SQL)
- Adds boilerplate without benefits
- Harder to use Prisma's advanced features (relations, aggregations)
- Testing is harder (now you mock the repository instead of Prisma)

**Do this instead:** Inject PrismaService directly:
```typescript
@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateProfileDto) {
    return this.prisma.profile.create({ data });
  }
}
```

For testing, mock PrismaService or use Prisma's test helpers.

### Anti-Pattern 3: Monolithic Module Structure

**What people do:** Put all code in `src/` without modules:
```
src/
├── controllers/
│   ├── profile.controller.ts
│   ├── scraper.controller.ts
│   └── ai.controller.ts
├── services/
│   ├── profile.service.ts
│   ├── scraper.service.ts
│   └── ai.service.ts
└── app.module.ts
```

**Why it's wrong:**
- No domain boundaries (everything imports everything)
- Circular dependency nightmares
- Hard to find related code
- Can't incrementally extract to microservices later

**Do this instead:** Module-per-feature:
```
src/
├── modules/
│   ├── profile/
│   │   ├── profile.module.ts
│   │   ├── profile.controller.ts
│   │   └── profile.service.ts
│   ├── scraper/
│   │   └── ...
│   └── ai/
│       └── ...
└── app.module.ts
```

### Anti-Pattern 4: Storing PDFs in Database

**What people do:** Store PDF binary data in PostgreSQL `BYTEA` column:
```typescript
await prisma.cv.create({
  data: {
    content: pdfBuffer, // 1-5MB per CV
  },
});
```

**Why it's wrong:**
- Database bloat (CVs are 1-5MB each)
- Slow queries (must transfer binary data)
- Expensive backups
- Can't use CDN for serving

**Do this instead:** Store PDFs in object storage (S3, MinIO, or local filesystem for self-hosted):
```typescript
const filename = `cv-${cvId}.pdf`;
await fs.writeFile(`/storage/pdfs/${filename}`, pdfBuffer);

await prisma.cv.create({
  data: {
    pdfPath: `/pdfs/${filename}`, // Store path, not binary
  },
});
```

For self-hosted, mount a Docker volume for `/storage/pdfs/`. For cloud, use S3 with signed URLs.

### Anti-Pattern 5: No Request Validation

**What people do:** Accept raw request bodies without validation:
```typescript
@Post('generate')
async generateCv(@Body() body: any) {
  // body.profileId might be undefined, wrong type, etc.
  return this.aiService.generate(body.profileId, body.jobUrl);
}
```

**Why it's wrong:**
- Runtime errors in production
- Security vulnerabilities (injection attacks)
- Hard to debug invalid requests

**Do this instead:** Use DTOs with class-validator:
```typescript
// dto/generate-cv.dto.ts
export class GenerateCvDto {
  @IsUUID()
  profileId: string;

  @IsUrl()
  jobUrl: string;
}

// controller
@Post('generate')
async generateCv(@Body() dto: GenerateCvDto) {
  return this.aiService.generate(dto.profileId, dto.jobUrl);
}

// Enable validation globally in main.ts
app.useGlobalPipes(new ValidationPipe());
```

### Anti-Pattern 6: Frontend Directly Calling External APIs

**What people do:** Call Gemini API directly from Next.js frontend:
```typescript
// app/generate/page.tsx
const response = await fetch('https://api.gemini.ai/generate', {
  headers: { 'Authorization': `Bearer ${process.env.GEMINI_API_KEY}` },
});
```

**Why it's wrong:**
- Exposes API keys to client (security risk)
- No rate limiting
- No retry logic
- Can't audit usage
- Tight coupling to Gemini (hard to switch providers)

**Do this instead:** Proxy all external API calls through backend:
```typescript
// Frontend calls backend
const response = await fetch('/api/generate', {
  method: 'POST',
  body: JSON.stringify({ profileId, jobUrl }),
});

// Backend handles Gemini API
@Post('generate')
async generate(@Body() dto: GenerateCvDto) {
  return this.aiService.generate(dto); // aiService calls Gemini
}
```

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| **Gemini AI** | REST API via SDK | Use `@google/generative-ai` npm package. Implement retry logic (3 attempts with exponential backoff). Cache responses when possible. Rate limit: ~60 req/min on free tier. |
| **Job Sites (Scraping)** | Puppeteer/Cheerio | Use Puppeteer for JavaScript-heavy sites, Cheerio for static HTML. Implement site-specific selectors. Cache job descriptions (24h TTL). Use rotating user agents. |
| **Authentication (Future)** | Passport.js / NextAuth | For MVP, skip auth. Post-MVP: Use NextAuth.js on frontend + JWT validation on backend. Store sessions in Redis. |
| **Email (Future)** | SendGrid / Resend | For sending generated CVs. Use queue-based delivery. Template with React Email. |
| **Object Storage (Future)** | MinIO (self-hosted) / S3 | For storing PDFs at scale. Use signed URLs for downloads. Set expiry on URLs (24h). |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| **Frontend ↔ Backend API** | HTTP/REST | Frontend makes API calls to NestJS. Use Axios with retry logic. Consider tRPC for type safety. |
| **Backend ↔ Database** | Prisma ORM | Type-safe queries. Use connection pooling. Migrations tracked in Git. |
| **Backend ↔ Redis** | BullMQ library | Queue jobs, not direct Redis commands. BullMQ handles serialization. |
| **Module ↔ Module (within NestJS)** | Dependency Injection | Import modules, inject services. Avoid circular dependencies. |
| **Queue ↔ Worker** | Redis streams | BullMQ handles this. Workers can be separate processes. |

### Cross-Cutting Concerns

**Logging:**
- Use NestJS built-in Logger
- Log to stdout/stderr (Docker captures)
- Structured JSON logs for production
- Include request IDs for tracing

**Error Handling:**
- Use NestJS exception filters
- Map errors to HTTP status codes
- Return consistent error format: `{ statusCode, message, timestamp }`
- Log errors with stack traces

**Configuration:**
- Use `@nestjs/config` for environment variables
- Validate config on startup with Joi schema
- Support `.env` files for local development
- Never commit secrets (use `.env.example` template)

**Security:**
- Helmet for HTTP headers
- CORS configured for frontend domain
- Rate limiting with `@nestjs/throttler`
- Input validation with DTOs
- Sanitize HTML in job descriptions (prevent XSS)

## Build Order Recommendations

Based on dependencies between components, the suggested build order is:

### Phase 1: Foundation (Week 1-2)
1. **Database schema** - Define Prisma models (Profile, Job, CV, PDFDocument)
2. **NestJS boilerplate** - Set up modules, Prisma service, basic config
3. **Profile module** - CRUD operations for master profiles
4. **Next.js boilerplate** - App Router setup, API client, basic UI

**Deliverable:** Can create/edit profiles via UI

### Phase 2: Job Scraping (Week 3)
5. **Scraper module** - Service to extract job descriptions from URLs
6. **Job input UI** - Form to submit job URL
7. **Caching layer** - Store scraped jobs to avoid re-scraping

**Deliverable:** Can paste job URL and extract description

### Phase 3: AI Integration (Week 4)
8. **AI module** - Integrate Gemini API, prompt engineering
9. **BullMQ setup** - Install Redis, configure queues
10. **AI worker** - Background processor for CV generation

**Deliverable:** Can generate tailored CV content (JSON format)

### Phase 4: PDF Generation (Week 5)
11. **PDF module** - Convert CV JSON to ATS-optimized PDF
12. **PDF worker** - Queue-based PDF generation
13. **Download endpoint** - Serve PDFs to users

**Deliverable:** Can download generated CV as PDF

### Phase 5: Polish (Week 6)
14. **CV preview UI** - Show CV before downloading
15. **Status polling** - Show generation progress
16. **Error handling** - User-friendly error messages
17. **Docker compose** - Self-hosted deployment setup

**Deliverable:** Complete MVP ready for user testing

### Why This Order?

- **Foundation first:** Can't build features without database and basic infrastructure
- **Profile before scraping:** Scraping needs somewhere to associate job data
- **Scraping before AI:** AI needs job description data
- **AI before PDF:** PDF needs CV content to render
- **Queue setup with AI:** AI is the first async operation that justifies queues
- **Polish last:** UI/UX improvements after core features work

**Parallel work opportunities:**
- Frontend and backend can be built in parallel after Phase 1
- PDF module development can start while AI module is being refined
- Scraper module is independent and can be built by a separate developer

## Sources

### Architecture Patterns & NestJS
- [Nest.js and Modular Architecture: Principles and Best Practices | Level Up Coding](https://levelup.gitconnected.com/nest-js-and-modular-architecture-principles-and-best-practices-806c2cb008d5)
- [Building a Scalable Web Crawler with NestJS: A Step-by-Step Guide | Medium](https://ga1.medium.com/building-a-scalable-web-crawler-with-nestjs-a-step-by-step-guide-9d6861ef5340)
- [NestJS in 2026: Why It's Still the Gold Standard for Scalable Backends - Ty's Web Development Training Blog](https://tyronneratcliff.com/nestjs-for-scaling-backend-systems/)

### Next.js & NestJS Integration
- [Integrating Next.js and NestJS | simonknott.de](https://simonknott.de/articles/integrating-nextjs-with-nestjs)
- [Node.js Paradigm Shift: Architecting Custom APIs with NestJS on AWS (2026)](https://www.bitcot.com/node-js-paradigm-shift/)

### AI System Architecture
- [AI System Design Patterns for 2026: Architecture That Scales](https://zenvanriel.nl/ai-engineer-blog/ai-system-design-patterns-2026/)
- [Generate Documents from Your Data - Azure Architecture Center | Microsoft Learn](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/idea/generate-documents-from-your-data)
- [Creating asynchronous AI agents with Amazon Bedrock | AWS](https://aws.amazon.com/blogs/machine-learning/creating-asynchronous-ai-agents-with-amazon-bedrock/)

### Queue & Background Jobs
- [Using BullMQ with NestJS for Background Job Processing | Medium](https://mahabub-r.medium.com/using-bullmq-with-nestjs-for-background-job-processing-320ab938048a)
- [Scaling NestJS Applications with BullMQ and Redis | Medium](https://medium.com/@kumarasinghe.it/scaling-nestjs-applications-with-bullmq-and-redis-a-deep-dive-into-background-job-processing-ce6b6fb5017f)
- [BullMQ NestJS Integration Documentation](https://docs.bullmq.io/guide/nestjs)

### PDF Generation
- [Scalable PDF Generation Architecture: High-Level Design for Enterprise-Grade Solutions | Medium](https://medium.com/@jarsaniatirth/scalable-pdf-generation-architecture-high-level-design-for-enterprise-grade-solutions-f4d99be60d1b)
- [High-Volume PDF Generation with Docker, Pyppeteer, and Asyncio | Medium](https://medium.com/@ypangam/high-volume-pdf-generation-with-docker-pyppeteer-and-asyncio-a-scalable-architecture-ef17690c078c)

### Prisma & Database
- [Prisma | NestJS - A progressive Node.js framework](https://docs.nestjs.com/recipes/prisma)
- [Repository pattern with prisma · prisma/prisma · Discussion #10584](https://github.com/prisma/prisma/discussions/10584)
- [Architecting Scalability: Leveraging Prisma's New Runtime Configuration with PostgreSQL Pooling in NestJS | Medium](https://medium.com/@elohimcode/architecting-scalability-leveraging-prismas-new-runtime-configuration-with-postgresql-pooling-in-92cb4d4cdf9f)

### ATS Resume Optimization
- [ATS-Friendly Resume in 2026 | Jobscan](https://www.jobscan.co/blog/20-ats-friendly-resume-templates/)
- [How To Write an ATS Resume | Indeed.com](https://www.indeed.com/career-advice/resumes-cover-letters/ats-resume-template)
- [Make Your Resume AI-Friendly: Expert ATS Optimization Tips (2026)](https://www.nationalsearchgroup.com/optimize-resume-for-ats-ai-screening/)

### Docker & Deployment
- [Guides: Self-Hosting | Next.js](https://nextjs.org/docs/app/guides/self-hosting)
- [Efficient Deployment of Next.js and Nest.js Mono Repo Applications using Docker-Compose | Medium](https://medium.com/@wwdhfernando/efficient-deployment-of-next-js-24fd2825d6b4)
- [Deploy NextJs and NestJs as a single application - DEV Community](https://dev.to/xvandev/deploy-nextjs-and-nestjs-as-a-single-application-15mj)

---
*Architecture research for: AI-Powered CV/Resume Builder Platform (Maxed-CV)*
*Researched: 2026-02-07*
*Confidence: HIGH - Based on official documentation, current best practices, and 2026 industry patterns*
