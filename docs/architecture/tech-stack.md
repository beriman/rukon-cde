# Tech Stack - Rukon CDE Platform

## Overview

Rukon menggunakan **modern JavaScript/TypeScript stack** dengan fokus pada **enterprise-grade quality**, **developer experience**, dan **scalability**.

## Frontend Stack

### Core Framework

#### Next.js 14+ (App Router)
**Version**: 14.x atau lebih baru  
**Why**: 
- Full-stack React framework dengan server-side rendering
- App Router untuk modern routing dengan React Server Components
- Built-in optimization (image, font, script)
- Edge runtime support untuk global performance

**Key Features Used**:
- Server Components untuk zero-JS components
- Server Actions untuk form handling tanpa API routes
- Streaming dengan Suspense
- Route Handlers untuk API endpoints

### UI/UX Libraries

#### Tailwind CSS v3
**Why**:
- Utility-first approach untuk rapid  development
- Consistency via design tokens
- Small bundle size (only used classes)
- PurgeCSS built-in untuk production

**Configuration**:
```javascript
// tailwind.config.ts
export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Rukon brand colors
        primary: { /* ... */ },
        cde: {
          wip: '#FFA500',
          shared: '#4A90E2',
          published: '#34A853',
          archived: '#9E9E9E',
        }
      }
    }
  }
}
```

#### Shadcn UI
**Why**:
- High-quality, accessible components based on Radix UI
- Copy-paste approach (no package dependency)
- Full customization
- TypeScript-first
- Consistent dengan Autodesk ACC design language

**Components Used**:
- Dialog, Dropdown Menu, Popover
- Data Table (built on TanStack Table)
- Form (with React Hook Form integration)
- Toast, Alert

#### Radix UI Primitives
**Why**:
- Headless components untuk full styling control
- WAI-ARIA compliant (accessibility)
- Keyboard navigation support
- Focus management

### State Management

#### Zustand
**Version**: 4.x  
**Why**:
- Simple, unopinionated API
- No boilerplate (vs Redux)
- TypeScript support excellent
- Small bundle size (~1KB)

**Usage**:
```typescript
// stores/auth.ts
import { create } from 'zustand';

interface AuthState {
  user: User | null;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}));
```

#### TanStack Query v5
**Why**:
- Server state management (vs client state dengan Zustand)
- Automatic caching, refetching, background updates
- Optimistic updates
- Pagination & infinite scroll support

**Usage**: 
- Fetching projects, files, users
- Mutation dengan automatic cache invalidation
- Real-time data synchronization

### Data Tables & Visualization

#### TanStack Table v8
**Why**:
- Headless table library (fully customizable)
- Sorting, filtering, pagination, row selection built-in
- Virtual scrolling untuk large datasets
- TypeScript support

**Use Cases**:
- File explorer table (CDE files)
- Project list
- User management table
- Dashboard data grids

#### Recharts
**Why**:
- Built on D3, tapi easier API
- Responsive by default
- Customizable
- Good TypeScript support

**Use Cases**:
- S-Curve visualization (planned vs actual progress)
- HSE dashboard charts
- 4D/5D simulation charts

### BIM/3D Viewer

#### That Open Platform (IFC.js)
**Version**: Latest  
**Why**:
- Open source & gratis
- Full IFC 2x3 dan IFC4 support
- Runs in browser (WebGL)
- No server-side processing needed untuk viewing
- Active community

**Features**:
- 3D model viewer
- Property extraction
- Floor plan generation
- Clash detection (basic)

**Alternative**: Autodesk Platform Services (APS)
- **Pros**: Enterprise support, advanced features, Revit support
- **Cons**: Cost per user/view, vendor lock-in
- **Decision**: Start dengan IFC.js, evaluate APS untuk enterprise tier

### Form & Validation

#### React Hook Form
**Why**:
- Minimal re-renders (performance)
- Easy integration dengan Zod validation
- Built-in error handling
- TypeScript support

#### Zod
**Why**:
- TypeScript-first schema validation
- Type inference (no duplicate types)
- Composable schemas
- Frontend + Backend validation dengan same schema

```typescript
// schemas/project.ts
import { z } from 'zod';

export const createProjectSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  organizationId: z.string().uuid(),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
```

## Backend Stack

### Runtime & Framework

#### Node.js 20 LTS
**Why**:
- Stable, long-term support
- Native ESM support
- Performance improvements (V8 engine)
- Large ecosystem

#### NestJS
**Version**: 10.x  
**Why**:
- Enterprise-grade architecture
- TypeScript first-class citizen
- Modular structure (maintainable)
- Built-in: DI, Guards, Interceptors, Pipes
- Similar ke Spring Boot/Angular (familiar patterns)

**Architecture Pattern**: 
- Module-based (ProjectsModule, FilesModule, etc.)
- Controller → Service → Repository pattern
- SOLID principles

### ORM & Database

#### Prisma
**Version**: 5.x  
**Why**:
- Type-safe database client
- Auto-generated types dari schema
- Migration system yang powerful
- Excellent DX (Developer Experience)
- Support PostgreSQL, MySQL, SQLite

**Schema Example**:
```prisma
model Project {
  id             String   @id @default(uuid())
  name           String
  organizationId String
  organization   Organization @relation(fields: [organizationId], references: [id])
  files          File[]
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
  
  @@index([organizationId])
}
```

#### PostgreSQL 15+
**Why**:
- Robust, ACID compliant
- JSONB untuk flexible attributes
- Full-text search
- Row-level security untuk multi-tenancy
- Excellent performance

### Authentication & Authorization

#### Passport.js
**Why**:
- De-facto standard untuk Node.js auth
- Many strategies (JWT, OAuth2, SAML)
- NestJS integration built-in

**Strategies Used**:
- `passport-jwt`: API authentication
- `passport-google-oauth20`: Google SSO
- `passport-microsoft`: Microsoft SSO (future)

#### CASL
**Why**:
- Isomorphic (frontend + backend)
- Ability-based permissions (flexible)
- Dynamic rules berdasarkan conditions

```typescript
// abilities/project.ability.ts
export const defineAbilityFor = (user: User) => {
  const { can, cannot, build } = new AbilityBuilder(createMongoAbility);
  
  if (user.role === 'Admin') {
    can('manage', 'all');
  } else {
    can('read', 'Project', { organizationId: user.organizationId });
    can('create', 'Project');
  }
  
  return build();
};
```

### File Storage

#### AWS S3 SDK
**Why**:
- Industry standard untuk object storage
- Versioning support (critical untuk CDE)
- Lifecycle policies
- CDN integration (CloudFront)

**Alternative**: MinIO
- **Pros**: Self-hosted, S3-compatible API
- **Cons**: Need to manage infrastructure
- **Decision**: AWS S3 untuk MVP, MinIO untuk self-hosted tier

### Search

#### Meilisearch
**Why**:
- Fast (Rust-based)
- Easy setup & maintenance
- Typo-tolerance
- Faceted search
- Lightweight vs Elasticsearch

**Use Cases**:
- File search (by name, content, metadata)
- Project search
- User search di admin panel

### Caching

#### Redis
**Version**: 7.x  
**Why**:
- In-memory speed
- Pub/Sub untuk real-time features
- Session storage
- Rate limiting
- API response caching

## Development Tools

### Package Manager

#### pnpm
**Why**:
- Fast (symbolic links, content-addressable storage)
- Disk space efficient
- Stricter than npm/yarn (no phantom dependencies)
- Monorepo support

### Monorepo

#### Turborepo
**Why**:
- Fast incremental builds
- Remote caching
- Parallel task execution
- Perfect untuk Next.js + NestJS monorepo

**Structure**:
```
rukon/
├── apps/
│   ├── web/        # Next.js app
│   └── api/        # NestJS app
├── packages/
│   ├── ui/         # Shared components
│   ├── database/   # Prisma schema
│   └── types/      # Shared types
```

### Code Quality

#### ESLint
**Config**: `@typescript-eslint/recommended` + `eslint-config-next`

#### Prettier
**Why**: Opinionated code formatter, end debates tentang styling

#### Husky + lint-staged
**Why**: Pre-commit hooks untuk enforce quality sebelum push

### Testing

#### Vitest
**Why**:
- Fast (Vite-powered)
- Jest-compatible API
- ESM support native
- TypeScript out of the box

#### React Testing Library
**Why**:
- Test user behavior, bukan implementation
- Accessibility-first approach
- Integrates dengan Vitest

#### Playwright
**Why**:
- Cross-browser E2E testing
- Auto-wait (less flaky)
- Built-in test recorder
- Video/screenshot pada failure

## Infrastructure

### Cloud Provider

#### AWS (Primary)
**Services Used**:
- **EC2/ECS**: Compute untuk API
- **RDS**: PostgreSQL managed database
- **S3**: File storage
- **CloudFront**: CDN
- **Route 53**: DNS
- **Certificate Manager**: SSL/TLS
- **CloudWatch**: Monitoring & logs

### CI/CD

#### GitHub Actions
**Why**:
- Integrated dengan GitHub
- Free untuk public repos, competitive pricing
- YAML configuration
- Large marketplace of actions

**Workflows**:
- Lint & Test pada setiap PR
- Deploy to Staging on merge to `develop`
- Deploy to Production on tag `v*.*.*`

### Monitoring

#### Sentry
**Why**:
- Error tracking & monitoring
- Source map support
- Release tracking
- Performance monitoring

#### Vercel Analytics (for Frontend)
**Why**:
- Free for Next.js apps pada Vercel
- Web Vitals tracking
- Real user monitoring

## Version Requirements

```json
{
  "engines": {
    "node": ">=20.0.0",
    "pnpm": ">=8.0.0"
  },
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "@nestjs/core": "^10.0.0",
    "prisma": "^5.0.0",
    "typescript": "^5.3.0"
  }
}
```

## Decision Log

### Why Not Use...?

**Vue/Nuxt instead of React/Next?**
- React has larger ecosystem untuk enterprise libraries
- Next.js maturity dan Vercel support
- Team familiarity

**GraphQL instead of REST?**
- REST simpler untuk MVP
- GraphQL adds complexity (N+1 problem, caching)
- Can add GraphQL later untuk complex queries (BIM metadata)

**MongoDB instead of PostgreSQL?**
- Relational data model fits CDE better (projects → files → versions)
- JSONB provides flexibility when needed
- PostgreSQL performance sama bagus

**Microservices instead of Monolith?**
- Monolith simpler untuk start
- Easier to debug & deploy
- Can extract microservices later jika needed (e.g., BIM processing service)

---

**Last Updated**: 2025-12-01  
**Review Cycle**: Quarterly (evaluate new tools/versions)
