# Epic 1: Core CDE Foundation & Multi-Tenancy

**Epic ID**: `epic-1`  
**Priority**: P0 (Critical - Foundation)  
**Estimated Effort**: Large (8-12 weeks)  
**Target Phase**: MVP (Phase 1)

## Description

Membangun fondasi Common Data Environment (CDE) yang compliant dengan ISO 19650-1, termasuk multi-tenancy architecture, authentication/authorization, project management, dan file management core dengan CDE workflow states.

Ini adalah Epic paling fundamental yang harus selesai terlebih dahulu karena semua Epic lain bergantung pada infrastruktur ini.

## Business Value

- **Single Source of Truth**: Semua stakeholder proyek bekerja dengan data yang sama dan terkini
- **ISO 19650 Compliance**: Memenuhi standar internasional untuk BIM collaboration
- **Multi-Tenancy**: Satu platform dapat melayani banyak organisasi dengan data terisolasi penuh
- **Security & Audit**: Setiap aksi tercatat untuk compliance dan security requirements

## Functional Requirements (From PRD)

### 3.1 Core CDE (ISO 19650-1)
- Unique ID Generation dengan naming convention enforcement
- CDE States workflow: WIP → Shared → Published → Archived
- Smart Versioning (ACC-style file stacking)
- Version History & Rollback capabilities
- Container Management untuk semua file types

### Additional Core Features
- User authentication (JWT-based)
- Organization management (Multi-tenancy)
- Project CRUD operations
- Role-Based Access Control (RBAC) sesuai ISO 19650 roles
- File upload/download dengan chunked upload untuk large files
- Folder/directory structure management

## User Stories (High-Level)

1. **User Authentication & Management**
   - [ ] User dapat register dengan email/password
   - [ ] User dapat login dan menerima JWT token
   - [ ] User dapat reset password
   - [ ] Admin dapat manage users di organizationnya

2. **Organization Management (Multi-Tenancy)**
   - [ ] System admin dapat create organization baru
   - [ ] Organization admin dapat invite users ke organization
   - [ ] Organization data terisolasi 100% dari organization lain

3. **Project Management**
   - [ ] User dapat create project baru
   - [ ] User dapat list semua projects di organizationnya
   - [ ] User dapat view project details
   - [ ] User dapat update project information
   - [ ] User dapat archive project

4. **File Management Core**
   - [ ] User dapat create folder structure di dalam project
   - [ ] User dapat upload file ke folder (single & batch)
   - [ ] System otomatis generate unique file ID dengan naming convention
   - [ ] User dapat download file
   - [ ] User dapat view file metadata

5. **CDE Workflow States**
   - [ ] File default status adalah WIP saat pertama upload
   - [ ] User dapat promote file dari WIP → Shared (dengan approval)
   - [ ] User dapat publish file dari Shared → Published (dengan approval)
   - [ ] Published files otomatis archived saat ada version baru
   - [ ] User dapat view file sesuai permission berdasarkan CDE state

6. **Smart Versioning**
   - [ ] Upload file dengan nama sama otomatis create version baru (V1, V2, V3...)
   - [ ] File stacking: versions ditampilkan sebagai dropdown di file yang sama
   - [ ] User dapat view version history
   - [ ] User dapat restore/rollback ke version sebelumnya
   - [ ] Version lama tetap accessible untuk audit

7. **Naming Convention Enforcement**
   - [ ] System validasi format nama file: `Project-Originator-Volume-Level-Type-Role-Number`
   - [ ] User mendapat error message jelas jika format salah
   - [ ] Auto-suggest naming berdasarkan project context

## Acceptance Criteria

### Functional
- [ ] User dapat login dan access project yang authorized
- [ ] File dapat diupload, versioned, dan di-download kembali tanpa corrupt
- [ ] CDE states workflow berfungsi dengan approval mechanism
- [ ] Multi-tenancy: Organization A tidak bisa access data Organization B
- [ ] Naming convention validator menolak file dengan format salah

### Non-Functional
- [ ] API response time < 200ms (p95) untuk CRUD operations
- [ ] File upload support hingga 500MB dengan chunked upload
- [ ] Database schema supports sharding untuk horizontal scaling
- [ ] All API endpoints memiliki unit tests (>80% coverage)
- [ ] Authentication uses secure JWT with refresh token mechanism

### Security
- [ ] Passwords di-hash dengan bcrypt (minimum 10 rounds)
- [ ] JWT short-lived (15 min), refresh token httpOnly cookie
- [ ] Audit trail mencatat semua file operations (upload, download, delete)
- [ ] RBAC enforced di setiap endpoint via Guards

## Technical Architecture

### Database Schema (Prisma)

```prisma
model Organization {
  id        String    @id @default(uuid())
  name      String
  domain    String?   @unique
  users     User[]
  projects  Project[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}

model User {
  id             String       @id @default(uuid())
  email          String       @unique
  passwordHash   String
  name           String
  role           UserRole
  organizationId String
  organization   Organization @relation(fields: [organizationId], references: [id])
  createdAt      DateTime     @default(now())
  updatedAt      DateTime     @updatedAt
  
  @@index([organizationId])
}

enum UserRole {
  SYSTEM_ADMIN
  ORG_ADMIN
  APPOINTING_PARTY
  LEAD_APPOINTED_PARTY
  APPOINTED_PARTY
  INFORMATION_MANAGER
  VIEWER
}

model Project {
  id             String       @id @default(uuid())
  name           String
  description    String?
  status         ProjectStatus @default(ACTIVE)
  organizationId String
  organization   Organization @relation(fields: [organizationId], references: [id])
  folders        Folder[]
  files          File[]
  createdAt      DateTime     @default(now())
  updatedAt      DateTime     @updatedAt
  
  @@index([organizationId])
}

enum ProjectStatus {
  ACTIVE
  ARCHIVED
}

model Folder {
  id        String   @id @default(uuid())
  name      String
  path      String   // Full path: /root/subfolder
  projectId String
  project   Project  @relation(fields: [projectId], references: [id])
  files     File[]
  createdAt DateTime @default(now())
  
  @@index([projectId])
  @@unique([projectId, path])
}

model File {
  id          String      @id @default(uuid())
  name        String
  uniqueId    String      @unique  // Naming convention format
  projectId   String
  project     Project     @relation(fields: [projectId], references: [id])
  folderId    String?
  folder      Folder?     @relation(fields: [folderId], references: [id])
  cdeState    CdeState    @default(WIP)
  fileType    String      // MIME type
  size        Int         // Bytes
  s3Key       String      // S3 object key
  versions    FileVersion[]
  currentVersion Int      @default(1)
  uploadedBy  String      // User ID
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
  
  @@index([projectId])
  @@index([folderId])
}

enum CdeState {
  WIP
  SHARED
  PUBLISHED
  ARCHIVED
}

model FileVersion {
  id         String   @id @default(uuid())
  fileId     String
  file       File     @relation(fields: [fileId], references: [id], onDelete: Cascade)
  version    Int
  s3Key      String   // S3 object key for this version
  size       Int
  uploadedBy String   // User ID
  cdeState   CdeState
  createdAt  DateTime @default(now())
  
  @@index([fileId])
  @@unique([fileId, version])
}

model AuditLog {
  id         String   @id @default(uuid())
  userId     String
  action     String   // UPLOAD, DOWNLOAD, DELETE, VIEW, etc.
  entityType String   // FILE, PROJECT, USER
  entityId   String
  metadata   Json?    // Additional context
  ipAddress  String?
  userAgent  String?
  createdAt  DateTime @default(now())
  
  @@index([userId])
  @@index([entityType, entityId])
  @@index([createdAt])
}
```

### API Endpoints

```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/refresh
POST   /api/auth/logout

GET    /api/organizations
POST   /api/organizations
GET    /api/organizations/:id

GET    /api/projects
POST   /api/projects
GET    /api/projects/:id
PATCH  /api/projects/:id
DELETE /api/projects/:id

GET    /api/projects/:id/folders
POST   /api/projects/:id/folders

GET    /api/projects/:id/files
POST   /api/projects/:id/files        # Upload
GET    /api/files/:id
PATCH  /api/files/:id                 # Update metadata
DELETE /api/files/:id
GET    /api/files/:id/download
POST   /api/files/:id/promote         # CDE state transition
GET    /api/files/:id/versions
POST   /api/files/:id/restore/:version
```

## Dependencies

### Technical
- PostgreSQL database setup
- AWS S3 bucket configuration
- Redis untuk caching dan sessions
- NestJS modules: Auth, Users, Organizations, Projects, Files

### External
- None (Pure backend + database)

## Risks & Mitigation

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| File upload performance untuk large files | High | Medium | Implement chunked upload, use multipart upload ke S3 |
| Database performance dengan file versioning | Medium | High | Index optimization, consider partitioning FileVersion table |
| Multi-tenancy data leakage | Critical | Low | Comprehensive testing, use tenant-aware middleware |
| S3 storage costs | Medium | High | Lifecycle policies untuk archival, compression untuk large files |
| Naming convention terlalu strict | Medium | Medium | Provide clear documentation, auto-suggest features |

## Testing Strategy

### Unit Tests (60%)
- Service layer logic (ProjectsService, FilesService, etc.)
- Utility functions (naming validator, path builder)
- Guards dan decorators

### Integration Tests (30%)
- API endpoints dengan database
- File upload/download flow
- CDE state transitions
- Multi-tenancy isolation

### E2E Tests (10%)
- Complete user journey: Register → Create Project → Upload File → Promote to Shared

## Definition of Done

- [ ] All user stories completed dan tested
- [ ] API documentation up-to-date (Swagger/OpenAPI)
- [ ] Database migrations written dan tested
- [ ] Unit test coverage ≥ 80%
- [ ] Integration tests untuk critical paths
- [ ] Security audit passed (OWASP Top 10)
- [ ] Performance benchmarks met
- [ ] Code reviewed dan merged to main branch

---

**Related Epics**: 
- Epic 2 (depends on this)
- Epic 3 (depends on this)
- Epic 4 (depends on this)

**Updated**: 2025-12-01
