# Project Structure - Rukon CDE Platform

## Monorepo Overview

Rukon menggunakan **Turborepo** monorepo structure untuk mengelola multiple applications dan shared packages.

```
rukon/
├── apps/                          # Applications
│   ├── web/                       # Next.js frontend
│   └── api/                       # NestJS backend
├── packages/                      # Shared packages
│   ├── ui/                        # Shared UI components
│   ├── database/                  # Prisma schema & client
│   ├── types/                     # Shared TypeScript types
│   ├── config/                    # Shared configs
│   └── utils/                     # Shared utilities
├── docs/                          # Documentation (BMad compliant)
├── .bmad-core/                    # BMad Method files
├── turbo.json                     # Turborepo configuration
├── pnpm-workspace.yaml            # pnpm workspace config
└── package.json                   # Root package.json
```

## apps/web (Next.js Frontend)

### Directory Structure

```
apps/web/
├── public/                        # Static assets
│   ├── images/
│   ├── fonts/
│   └── icons/
├── src/
│   ├── app/                       # App Router (Next.js 14+)
│   │   ├── (auth)/               # Auth route group
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── register/
│   │   │       └── page.tsx
│   │   ├── (dashboard)/          # Dashboard route group
│   │   │   ├── layout.tsx        # Shared layout (sidebar, header)
│   │   │   ├── page.tsx          # Dashboard home
│   │   │   ├── projects/
│   │   │   │   ├── page.tsx      # Projects list
│   │   │   │   ├── [id]/
│   │   │   │   │   ├── page.tsx  # Project detail
│   │   │   │   │   └── files/
│   │   │   │   │       └── page.tsx
│   │   │   ├── files/            # File explorer
│   │   │   ├── workflows/        # Approval workflows
│   │   │   ├── hse/              # HSE management
│   │   │   └── settings/         # User settings
│   │   ├── api/                  # API route handlers
│   │   │   └── auth/
│   │   │       └── [...nextauth]/
│   │   │           └── route.ts
│   │   ├── layout.tsx            # Root layout
│   │   ├── globals.css           # Global styles
│   │   └── error.tsx             # Root error boundary
│   ├── components/
│   │   ├── ui/                   # Shadcn UI components
│   │   │   ├── button.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── table.tsx
│   │   │   └── ...
│   │   ├── features/             # Feature-specific components
│   │   │   ├── projects/
│   │   │   │   ├── ProjectCard.tsx
│   │   │   │   └── ProjectList.tsx
│   │   │   ├── files/
│   │   │   │   ├── FileExplorer.tsx
│   │   │   │   ├── FileUpload.tsx
│   │   │   │   └── FileViewer.tsx
│   │   │   └── bim/
│   │   │       └── IFCViewer.tsx
│   │   └── layouts/              # Layout components
│   │       ├── Header.tsx
│   │       ├── Sidebar.tsx
│   │       └── Footer.tsx
│   ├── lib/
│   │   ├── api/                  # API client functions
│   │   │   ├── projects.ts
│   │   │   ├── files.ts
│   │   │   └── users.ts
│   │   ├── hooks/                # Custom React hooks
│   │   │   ├── useProject.ts
│   │   │   ├── useFiles.ts
│   │   │   └── useAuth.ts
│   │   └── utils/                # Utilities
│   │       ├── cn.ts             # Class name utility
│   │       ├── date.ts           # Date formatting
│   │       └── file.ts           # File utilities
│   └── stores/                   # Zustand stores
│       ├── authStore.ts
│       └── uiStore.ts
├── .env.local                    # Environment variables
├── next.config.ts                # Next.js configuration
├── tailwind.config.ts            # Tailwind configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json
```

### Key Patterns

#### Route Groups
```
(auth)/       # No path segment, just grouping
(dashboard)/  # Shared layout for dashboard routes
```

#### Server vs Client Components
```typescript
// app/projects/page.tsx (Server Component - default)
export default async function ProjectsPage() {
  const projects = await getProjects(); // Direct DB/API call
  return <ProjectList projects={projects} />;
}

// components/features/projects/ProjectCard.tsx (Client Component)
'use client';

import { useState } from 'react';

export function ProjectCard({ project }) {
  const [expanded, setExpanded] = useState(false);
  // Interactive logic
}
```

## apps/api (NestJS Backend)

### Directory Structure

```
apps/api/
├── src/
│   ├── modules/                  # Feature modules
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.module.ts
│   │   │   ├── strategies/
│   │   │   │   ├── jwt.strategy.ts
│   │   │   │   └── local.strategy.ts
│   │   │   └── dto/
│   │   │       ├── login.dto.ts
│   │   │       └── register.dto.ts
│   │   ├── users/
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   ├── users.module.ts
│   │   │   └── entities/
│   │   │       └── user.entity.ts
│   │   ├── organizations/        # Multi-tenancy
│   │   ├── projects/
│   │   ├── files/                # File management & CDE
│   │   ├── workflows/            # Approval workflows
│   │   ├── bim/                  # BIM processing
│   │   │   ├── ifc-parser.service.ts
│   │   │   ├── clash-detection.service.ts
│   │   │   └── bcf.service.ts
│   │   ├── iso19650/             # ISO compliance
│   │   │   ├── naming-convention.service.ts
│   │   │   └── loin-validator.service.ts
│   │   └── hse/                  # HSE management
│   ├── common/                   # Shared utilities
│   │   ├── guards/
│   │   │   ├── jwt-auth.guard.ts
│   │   │   └── roles.guard.ts
│   │   ├── decorators/
│   │   │   ├── current-user.decorator.ts
│   │   │   └── roles.decorator.ts
│   │   ├── interceptors/
│   │   │   └── transform.interceptor.ts
│   │   ├── filters/
│   │   │   └── http-exception.filter.ts
│   │   ├── pipes/
│   │   │   └── validation.pipe.ts
│   │   └── dto/
│   │       └── pagination.dto.ts
│   ├── config/                   # Configuration
│   │   ├── database.config.ts
│   │   ├── jwt.config.ts
│   │   └── s3.config.ts
│   ├── database/                 # Database setup
│   │   ├── migrations/
│   │   └── seeds/
│   ├── app.module.ts             # Root module
│   └── main.ts                   # Application entry point
├── test/                         # E2E tests
│   └── app.e2e-spec.ts
├── .env                          # Environment variables
├── nest-cli.json                 # NestJS CLI configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json
```

### Module Pattern Example

```typescript
// projects/projects.module.ts
@Module({
  imports: [
    TypeOrmModule.forFeature([Project]),
    FilesModule,  // Import related modules
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService],
  exports: [ProjectsService],  // Export for other modules
})
export class ProjectsModule {}
```

## packages/ (Shared Packages)

### packages/ui

```
packages/ui/
├── src/
│   ├── components/               # Reusable components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── DataTable/
│   │       └── DataTable.tsx
│   └── index.ts                  # Barrel export
├── tsconfig.json
└── package.json
```

### packages/database

```
packages/database/
├── prisma/
│   ├── schema.prisma             # Prisma schema
│   ├── migrations/               # Migration files
│   └── seed.ts                   # Seed data
├── src/
│   ├── client.ts                 # Prisma client singleton
│   └── index.ts
├── tsconfig.json
└── package.json
```

**schema.prisma Structure**:
```prisma
// Multi-tenancy
model Organization {
  id       String    @id @default(uuid())
  name     String
  projects Project[]
  users    User[]
}

// Projects
model Project {
  id             String       @id @default(uuid())
  name           String
  organizationId String
  organization   Organization @relation(fields: [organizationId], references: [id])
  files          File[]
  
  @@index([organizationId])
}

// Files (CDE Containers)
model File {
  id          String      @id @default(uuid())
  name        String
  projectId   String
  project     Project     @relation(fields: [projectId], references: [id])
  cdeState    CdeState    @default(WIP)
  versions    FileVersion[]
  
  @@index([projectId])
}

enum CdeState {
  WIP
  SHARED
  PUBLISHED
  ARCHIVED
}
```

### packages/types

```
packages/types/
├── src/
│   ├── api/                      # API types
│   │   ├── project.types.ts
│   │   └── file.types.ts
│   ├── iso19650/                 # ISO types
│   │   ├── cde-states.ts
│   │   └── roles.ts
│   └── index.ts
└── package.json
```

### packages/config

```
packages/config/
├── eslint/
│   └── base.js                   # Shared ESLint config
├── tailwind/
│   └── base.js                   # Shared Tailwind config
└── package.json
```

## docs/ (BMad Documentation)

```
docs/
├── prd.md                        # Product Requirements Document
├── architecture.md               # Architecture Document
├── architecture/                 # Sharded architecture
│   ├── coding-standards.md
│   ├── tech-stack.md
│   └── source-tree.md
├── epics/                        # Sharded epics
│   ├── epic-1-core-cde.md
│   ├── epic-2-iso19650-compliance.md
│   └── ...
├── stories/                      # User stories
│   ├── epic-1/
│   │   ├── story-1.1-user-auth.md
│   │   └── story-1.2-file-upload.md
│   └── ...
└── qa/                           # QA documents
    ├── assessments/
    └── gates/
```

## Environment Variables

### Frontend (.env.local)

```bash
# API
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# Auth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# Feature Flags
NEXT_PUBLIC_ENABLE_BIM_VIEWER=true
```

### Backend (.env)

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/rukon"

# JWT
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d

# AWS S3
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_S3_BUCKET=rukon-files
AWS_REGION=ap-southeast-1

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Meilisearch
MEILISEARCH_HOST=http://localhost:7700
MEILISEARCH_API_KEY=your-key
```

## Build & Development

### Development Commands

```bash
# Install dependencies
pnpm install

# Start all apps in development
pnpm dev

# Start specific app
pnpm --filter web dev
pnpm --filter api dev

# Build all
pnpm build

# Run tests
pnpm test

# Lint
pnpm lint
```

### Turborepo tasks (turbo.json)

```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "test": {
      "dependsOn": ["build"]
    },
    "lint": {
      "outputs": []
    }
  }
}
```

---

**Last Updated**: 2025-12-01  
**Maintained By**: Development Team
