# Story 1.8: Project Creation & Management

**Epic**: Epic 1 - Core CDE Foundation & Multi-Tenancy  
**Story ID**: `story-1.8`  
**Story Points**: 5  
**Priority**: P0 (Critical)  
**Sprint**: Sprint 2 (Weeks 3-4)

## User Story

**As a** user dengan appropriate permissions  
**I want to** create dan manage projects  
**So that** saya dapat organize files dan collaboration dalam project context

## Acceptance Criteria

- [x] User dapat create project baru dengan name dan description
- [x] Project auto-associated dengan user's organization
- [x] Project memiliki default folder structure (WIP, Shared, Published, Archived)
- [x] Project metadata: name, description, status, createdBy, timestamps
- [x] Only users dengan role ≥ APPOINTED_PARTY dapat create projects
- [x] Project creation logged di audit trail (Via transaction)

## Technical Tasks

- [x] Create `ProjectsModule`, `ProjectsService`, `ProjectsController`
- [x] Implement `POST /api/projects`
- [x] Auto-create default CDE folder structure on project creation
- [x] Add RBAC permissions
- [x] Write unit & integration tests

## API Contract

```json
POST /api/projects
{
  "name": "Jakarta MRT Phase 3",
  "description": "BIM coordination untuk MRT Phase 3"
}

Response (201):
{
  "id": "uuid",
  "name": "Jakarta MRT Phase 3",
  "description": "BIM coordination untuk MRT Phase 3",
  "status": "ACTIVE",
  "organizationId": "org-uuid",
  "createdBy": "user-uuid",
  "folders": [
    { "path": "/WIP", "state": "WIP" },
    { "path": "/Shared", "state": "SHARED" },
    { "path": "/Published", "state": "PUBLISHED" },
    { "path": "/Archived", "state": "ARCHIVED" }
  ],
  "createdAt": "2025-12-01T10:00:00Z"
}
```

## Implementation

```typescript
async create(userId: string, organizationId: string, dto: CreateProjectDto) {
  const project = await this.prisma.project.create({
    data: {
      name: dto.name,
      description: dto.description,
      organizationId,
      createdBy: userId,
      folders: {
        create: [
          { name: 'WIP', path: '/WIP' },
          { name: 'Shared', path: '/Shared' },
          { name: 'Published', path: '/Published' },
          { name: 'Archived', path: '/Archived' },
        ],
      },
    },
    include: { folders: true },
  });

  await this.auditService.log({
    userId,
    action: 'CREATE_PROJECT',
    entityType: 'PROJECT',
    entityId: project.id,
  });

  return project;
}
```

## Dependencies
- **Depends on**: Story 1.2 (Auth), Story 1.5 (Organization), Story 1.7 (Multi-tenancy)
- **Blocks**: Story 1.9-1.11 (Project operations), Story 1.12 (Folders), Story 1.13 (Files)

---

**Created**: 2025-12-01  
**Created by**: SM Agent  
**Status**: 📋 Ready for Development
