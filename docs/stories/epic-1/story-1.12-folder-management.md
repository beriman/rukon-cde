# Story 1.12: Folder Structure Management

**Epic**: Epic 1 - Core CDE Foundation & Multi-Tenancy  
**Story ID**: `story-1.12`  
**Story Points**: 5  
**Priority**: P0 (Critical)  
**Sprint**: Sprint 2 (Weeks 3-4)

## User Story

**As a** project member, **I want to** create dan manage folder hierarchy dalam project, **so that** files dapat diorganize dengan struktur yang jelas.

## Acceptance Criteria

- [ ] User dapat create subfolder dalam CDE state folders (e.g., `/WIP/Architecture/`)
- [ ] Support nested folder structure (unlimited depth)
- [ ] Folder path unique per project
- [ ] Folder deletion check: tidak boleh delete jika ada files
- [ ] Folder rename: update all child paths
- [ ] Folder operations logged di audit trail

## Technical Tasks

- [ ] Implement `POST /api/projects/:id/folders`
- [ ] Implement `GET /api/projects/:id/folders` (tree structure)
- [ ] Implement `PATCH /api/folders/:id` (rename)
- [ ] Implement `DELETE /api/folders/:id` (with empty check)
- [ ] Path update logic untuk nested folders
- [ ] Frontend folder tree component

## API Contract

```json
POST /api/projects/:projectId/folders
{
  "name": "Architecture",
  "parentPath": "/WIP"
}

Response:
{
  "id": "uuid",
  "name": "Architecture",
  "path": "/WIP/Architecture",
  "projectId": "project-uuid",
  "createdAt": "2025-12-01T10:00:00Z"
}
```

## Implementation

```typescript
async createFolder(projectId: string, dto: CreateFolderDto) {
  const fullPath = `${dto.parentPath}/${dto.name}`;
  
  // Check uniqueness
  const existing = await this.prisma.folder.findUnique({
    where: {
      projectId_path: { projectId, path: fullPath },
    },
  });
  
  if (existing) {
    throw new ConflictException('Folder already exists at this path');
  }
  
  return this.prisma.folder.create({
    data: {
      name: dto.name,
      path: fullPath,
      projectId,
    },
  });
}
```

## Dependencies
- **Depends on**: Story 1.8 (Project Creation)
- **Blocks**: Story 1.13 (File Upload - need folders)

---

**Created**: 2025-12-01  
**Created by**: SM Agent  
**Status**: 📋 Ready for Development
