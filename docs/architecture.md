> **Status: historical / superseded.** This document describes an earlier target
> architecture and is retained for traceability. It is not an implementation
> contract. Use [`docs/strategy/architecture-current.md`](./strategy/architecture-current.md)
> and the accepted ADRs in [`docs/architecture/adr/`](./architecture/adr/) for
> current decisions. In particular, database-per-tenant, AWS-first deployment,
> S3/MinIO as the initial store, and the native mobile application described
> below are not current MVP decisions.

# Architecture Document: ISO 19650 Compliant SaaS CDE

## 1. System Overview

### 1.1 Platform Vision
Rukon adalah platform **Common Data Environment (CDE)** berbasis SaaS yang sepenuhnya compliant dengan standar ISO 19650 Parts 1-7. Platform ini dirancang untuk mendemokratisasi akses ke BIM dan ISO 19650 untuk industri AEC (Architecture, Engineering, Construction) di Indonesia dengan fokus pada:

- **Compliance-First**: Implementasi penuh ISO 19650 workflows
- **Enterprise-Grade Quality**: UI/UX setara dengan Autodesk Construction Cloud  
- **Local Context**: Template bahasa Indonesia dan workflow sesuai praktik lokal
- **Open Standards**: Dukungan penuh Open BIM (IFC, BCF)

### 1.2 Core Principles

1. **Single Source of Truth**: CDE sebagai sumber data tunggal untuk seluruh proyek
2. **Information Container Model**: Setiap file/data adalah container dengan metadata lengkap
3. **Workflow-Driven**: Status CDE (WIP → Shared → Published → Archived) mengatur lifecycle
4. **Role-Based Governance**: ISO 19650 roles menentukan akses dan tanggung jawab
5. **Audit & Security**: Setiap aksi tercatat untuk compliance dan security

## 2. Technology Stack

### 2.1 Frontend (Web Application)

#### Core Framework
- **Next.js 14+** (App Router)
  - Server Components untuk performance optimal
  - Server-Side Rendering (SSR) untuk SEO
  - Incremental Static Regeneration (ISR) untuk konten statis
  
#### UI/UX Layer
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn UI** - Component library untuk enterprise-grade UI
- **Radix UI** - Headless primitives untuk accessibility
- **Lucide Icons** - Consistent iconography

#### State Management
- **Zustand** - Lightweight state management untuk global state
- **TanStack Query v5** - Server state management, caching, dan synchronization
- **React Hook Form** - Form state dan validation

#### Data Tables & Visualization
- **TanStack Table v8** - Powerful headless table untuk data-dense layouts
- **Recharts** - Chart library untuk S-Curve, dashboards
- **React Flow** - Flow diagrams untuk workflows

#### 3D/BIM Viewer
- **That Open Platform (IFC.js)** - Primary choice
  - Open source, gratis, performant
  - Web-based IFC viewer tanpa plugin
  - Mendukung IFC2x3 dan IFC4
- **Alternative**: Autodesk Platform Services (APS) - Enterprise fallback

### 2.2 Backend (API Server)

#### Runtime & Framework
- **Node.js 20 LTS**
- **NestJS** - TypeScript framework untuk scalable architecture
  - Module-based structure
  - Dependency Injection pattern
  - Built-in support untuk validation, guards, interceptors

#### API Paradigm
- **REST API** - Primary untuk CRUD operations
- **GraphQL** (Optional/Future) - Untuk complex queries pada model metadata
- **WebSocket** - Real-time notifications dan collaborative editing

#### Authentication & Authorization
- **Passport.js** dengan strategies:
  - JWT untuk API authentication
  - OAuth2 untuk SSO (Google, Microsoft)
- **CASL** - Permission management library untuk complex RBAC

### 2.3 Database Architecture

#### Primary Database (Metadata)
- **PostgreSQL 15+**
  - Users, Organizations (Multi-tenancy)
  - Projects, Files metadata
  - Workflows, Approvals
  - JSONB columns untuk flexible attributes
  
#### Document/NoSQL (Audit & Logs)
- **MongoDB** atau **PostgreSQL JSONB**
  - Audit trails (immutable logs)
  - IFC property sets (flexible schema)
  - Activity streams

#### Object Storage (Files)
- **AWS S3** atau **MinIO** (self-hosted alternative)
  - Actual file storage (IFC, PDF, RVT, DWG)
  - Versioning enabled
  - Lifecycle policies untuk archival

#### Search Engine
- **Meilisearch** - Primary choice (fast, easy to setup)
- **Alternative**: Elasticsearch - For complex full-text search

#### Caching Layer
- **Redis**
  - Session storage
  - API response caching
  - Rate limiting
  - Real-time features (pub/sub)

### 2.4 Infrastructure & DevOps

#### Cloud Provider
- **AWS** (Primary)
  - EC2/ECS untuk compute
  - RDS untuk PostgreSQL
  - S3 untuk file storage
  - CloudFront untuk CDN
- **Alternative**: Google Cloud Platform atau DigitalOcean

#### Container Orchestration
- **Docker** - Containerization
- **Docker Compose** - Local development
- **Kubernetes** (Future) - Production orchestration at scale

#### CI/CD
- **GitHub Actions**
  - Automated testing
  - Lint & Format checks
  - Build & Deploy pipelines

#### Monitoring & Observability
- **Sentry** - Error tracking
- **Vercel Analytics** - Frontend performance
- **Prometheus + Grafana** - Infrastructure monitoring

## 3. System Architecture

### 3.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Client Layer                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   Web App    │  │  Mobile App  │  │  Desktop App │ │
│  │  (Next.js)   │  │  (Future)    │  │   (Future)   │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                      API Gateway                        │
│              (NestJS + GraphQL Optional)                │
└─────────────────────────────────────────────────────────┘
                           │
          ┌────────────────┼────────────────┐
          ▼                ▼                ▼
┌─────────────────┐ ┌──────────────┐ ┌──────────────────┐
│  Auth Service   │ │ Core Services│ │  BIM Services    │
│  - JWT          │ │ - Projects   │ │  - IFC Parser    │
│  - RBAC         │ │ - Files      │ │  - Clash Detect  │
│  - Permissions  │ │ - Workflows  │ │  - BCF Manager   │
└─────────────────┘ └──────────────┘ └──────────────────┘
                           │
          ┌────────────────┼────────────────┐
          ▼                ▼                ▼
┌─────────────────┐ ┌──────────────┐ ┌──────────────────┐
│   PostgreSQL    │ │   MongoDB    │ │    S3/MinIO      │
│   (Metadata)    │ │  (Audit Log) │ │    (Files)       │
└─────────────────┘ └──────────────┘ └──────────────────┘
```

### 3.2 Multi-Tenancy Strategy

**Database-per-Tenant Approach** (Recommended for ISO 19650 security requirements):
- Setiap Organization memiliki schema PostgreSQL sendiri
- Isolasi data 100% untuk security & compliance
- Mudah untuk backup/restore per organization
- Scaling: Connection pooling dengan tenant-aware routing

### 3.3 File Processing Pipeline

```
Upload File → Virus Scan → Naming Validation → Extract Metadata
    ↓
Store to S3 (versioned) → Generate Thumbnail/Preview → Index to Search
    ↓
Trigger Workflow (optional approval) → Notify subscribers
```

## 4. Project Structure

### 4.1 Monorepo Layout

```
rukon/
├── apps/
│   ├── web/                 # Next.js web application
│   ├── api/                 # NestJS backend
│   └── worker/              # Background jobs (future)
├── packages/
│   ├── ui/                  # Shared UI components (Shadcn)
│   ├── database/            # Prisma schema & migrations
│   ├── types/               # Shared TypeScript types
│   ├── config/              # Shared configs (ESLint, Tailwind)
│   └── utils/               # Shared utilities
├── docs/                    # Documentation (BMad compliant)
│   ├── prd.md
│   ├── architecture/
│   ├── epics/
│   ├── stories/
│   └── qa/
└── package.json
```

### 4.2 Frontend Structure (Next.js)

```
apps/web/
├── src/
│   ├── app/                    # App Router pages
│   │   ├── (auth)/            # Auth group
│   │   ├── (dashboard)/       # Dashboard group
│   │   └── api/               # Route handlers
│   ├── components/
│   │   ├── ui/                # Shadcn components
│   │   ├── features/          # Feature-specific components
│   │   └── layouts/           # Layout components
│   ├── lib/
│   │   ├── api/               # API client functions
│   │   ├── hooks/             # Custom React hooks
│   │   └── utils/             # Utilities
│   └── stores/                # Zustand stores
├── public/                    # Static assets
└── tailwind.config.ts
```

### 4.3 Backend Structure (NestJS)

```
apps/api/
├── src/
│   ├── modules/
│   │   ├── auth/              # Authentication module
│   │   ├── users/             # User management
│   │   ├── organizations/     # Multi-tenancy
│   │   ├── projects/          # Project management
│   │   ├── files/             # File management & CDE states
│   │   ├── workflows/         # Approval workflows
│   │   ├── bim/               # BIM-specific features
│   │   └── iso19650/          # ISO compliance features
│   ├── common/
│   │   ├── guards/            # Auth guards
│   │   ├── interceptors/      # Response interceptors
│   │   ├── decorators/        # Custom decorators
│   │   └── filters/           # Exception filters
│   ├── config/                # Configuration
│   └── database/              # Database setup
└── test/                      # E2E tests
```

## 5. Security Architecture

### 5.1 Authentication Flow
1. User login → JWT issued (short-lived: 15min)
2. Refresh token stored (httpOnly cookie, 7 days)
3. Each request → JWT validation via Guard
4. Token refresh → Silent token renewal

### 5.2 Authorization (ISO 19650 Roles)

**Role Hierarchy**:
```
System Admin (Platform Owner)
  └─ Organization Admin
       ├─ Appointing Party (Client/Owner)
       ├─ Lead Appointed Party (Main Contractor)
       │    └─ Appointed Party (Sub-contractors)
       ├─ Information Manager
       └─ Viewer (Read-only)
```

**Permission Model** (CASL):
- Ability-based: `can('create', 'Project')`
- Resource-based: `can('approve', file)` with conditions
- Dynamic permissions based on CDE state

### 5.3 Data Security (ISO 19650-5 Compliance)

- **At Rest**: AES-256 encryption untuk sensitive files
- **In Transit**: TLS 1.3 untuk all connections
- **Sensitivity Triage**: Mandatory classification untuk uploads
- **Redaction Tools**: Obscure sensitive elements di viewer
- **Watermarking**: Dynamic watermark pada document viewer
- **Audit Trail**: Immutable logs untuk compliance

## 6. Coding Standards

### 6.1 TypeScript Best Practices

- **Strict Mode**: `tsconfig.json` dengan `strict: true`
- **No `any`**: Use proper typing atau `unknown`
- **Type Safety**: Prefer interfaces over types untuk object shapes
- **Enums**: Use const enums untuk compile-time constants

### 6.2 React/Next.js Patterns

- **Server Components First**: Default ke Server Components, opt-in ke Client
- **Component Composition**: Small, focused, reusable components
- **Custom Hooks**: Extract logic ke hooks untuk reusability
- **Error Boundaries**: Wrap features dengan error boundaries
- **Loading States**: Skeleton loaders untuk better UX

### 6.3 API Design

- **RESTful Resources**: Noun-based endpoints `/projects/:id/files`
- **HTTP Verbs**: GET, POST, PUT, PATCH, DELETE semantically
- **Status Codes**: Proper HTTP status codes (200, 201, 400, 401, 403, 404, 500)
- **Pagination**: Offset-based atau cursor-based untuk large datasets
- **Filtering**: Query parameters untuk filtering & sorting

### 6.4 Database Conventions

- **Table Names**: `snake_case`, plural (`projects`, `file_versions`)
- **Column Names**: `snake_case` (`created_at`, `file_name`)
- **Foreign Keys**: `referenced_table_id` (`project_id`)
- **Indexes**: On foreign keys dan frequently queried columns
- **Migrations**: Never modify existing, always create new

## 7. Deployment Strategy

### 7.1 Environment Setup

- **Development**: Docker Compose local stack
- **Staging**: AWS infrastructure (mirror production)
- **Production**: AWS with auto-scaling, load balancers

### 7.2 Deployment Pipeline

```
Git Push → GitHub Actions
  ├─ Run Tests (Unit + Integration)
  ├─ Lint & Type Check
  ├─ Build Docker Images
  ├─ Push to Container Registry
  └─ Deploy to Environment
       ├─ Staging (auto)
       └─ Production (manual approval)
```

### 7.3 Database Migrations

- **Prisma Migrate** untuk schema changes
- **Zero-downtime**: Backwards-compatible migrations
- **Rollback Plan**: Always test rollback sebelum production

## 8. Testing Strategy

### 8.1 Testing Pyramid

```
       /\
      /E2E\        ← 10%  (Playwright)
     /─────\
    /Integration\  ← 30%  (Vitest + Supertest)
   /──────────────\
  /    Unit Tests  \ ← 60%  (Vitest + React Testing Library)
 /──────────────────\
```

### 8.2 Test Coverage Goals

- **Unit Tests**: 80% coverage untuk business logic
- **Integration Tests**: All API endpoints
- **E2E Tests**: Critical user journeys (login, upload, approve workflow)

## 9. Performance Requirements

### 9.1 Frontend Performance

- **First Contentful Paint (FCP)**: < 1.5s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **Time to Interactive (TTI)**: < 3.5s
- **Cumulative Layout Shift (CLS)**: < 0.1

### 9.2 Backend Performance

- **API Response Time**: < 200ms (p95)
- **Database Queries**: < 100ms (optimized indexes)
- **File Upload**: Chunked upload untuk large files (>100MB)
- **3D Model Loading**: Streaming/Progressive loading

## 10. Scalability Considerations

### 10.1 Horizontal Scaling

- **Stateless API**: Load balancer can distribute to multiple instances
- **Database Read Replicas**: For heavy read operations
- **CDN**: CloudFront untuk static assets dan cached responses

### 10.2 Vertical Scaling

- **Database**: PostgreSQL can scale vertically significantly
- **Redis**: In-memory caching mengurangi database load

## 11. Future Roadmap Considerations

### 11.1 Mobile Applications
- React Native atau Flutter untuk iOS/Android
- Offline-first architecture dengan local SQLite
- Sync ketika koneksi kembali

### 11.2 AI/ML Features
- RAG (Retrieval-Augmented Generation) untuk project assistant
- Predictive analytics untuk risk management
- Automated clash detection enhancement

### 11.3 Advanced BIM Features
- 4D/5D simulation (Time + Cost)
- COBie data validation
- Digital Twin untuk Operational Phase (ISO 19650-3)

---

**Document Version**: 1.0  
**Last Updated**: 2025-12-01  
**Status**: Draft - Awaiting Review
