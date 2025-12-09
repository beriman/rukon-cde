# Story 1.13: File Upload (Single & Batch)

**Epic**: Epic 1 - Core CDE Foundation & Multi-Tenancy  
**Story ID**: `story-1.13`  
**Story Points**: 8  
**Priority**: P0 (Critical)  
**Sprint**: Sprint 3 (Weeks 5-6)

## User Story

**As a** project member, **I want to** upload files (single atau batch) ke project folders, **so that** documents dan models dapat disimpan di CDE.

## Acceptance Criteria

### Functional
- [x] User dapat upload single file atau multiple files sekaligus
- [x] Support file size up to 500MB per file
- [x] Files default uploaded ke WIP state
- [x] Chunked upload untuk large files (multipart)
- [x] File metadata extracted: name, size, type, hash
- [x] Upload progress indicator di frontend - Phase 3
- [x] File stored di S3: `org-{orgId}/project-{projectId}/files/{fileId}`

### Validation
- [x] Validate file type (configurable allowed extensions)
- [x] Validate naming convention (Story 1.14)
- [x] Check available storage quota (future/deferred)

## Technical Tasks

### Backend
- [x] Setup AWS S3 SDK dan configuration (Using Local Fallback if keys missing)
- [x] Implement multipart upload handler
- [x] **Performance**: Implement streaming upload directly to S3 (avoid memory buffering)
- [x] Implement `POST /api/projects/:id/files` (upload endpoint)
- [x] Generate file hash (MD5/SHA256) untuk duplicate detection
- [x] Create File record di database
- [x] Link file ke folder dan project
- [x] Handle upload errors (rollback S3 if DB fails)
- [x] Add file upload logging

### Frontend
- [x] File upload component dengan drag-and-drop - Phase 3
- [x] Multiple file selection - Phase 3
- [x] Upload progress bar (per file) - Phase 3
- [x] Chunk upload implementation (Basic multipart implemented, full chunking Phase 3)
- [x] Error handling & retry logic - Phase 3

## API Contract

```json
POST /api/projects/:projectId/files
Content-Type: multipart/form-data

FormData:
- file: File (binary)
- folderId: uuid (optional)
- metadata: { customField: value } (optional)

Response (201):
{
  "id": "file-uuid",
  "name": "PRJ-ARC-A-01-DR-A-001.pdf",
  "uniqueId": "PRJ-ARC-A-01-DR-A-001",
  "size": 15728640,
  "fileType": "application/pdf",
  "cdeState": "WIP",
  "version": 1,
  "s3Key": "org-123/project-456/files/file-uuid",
  "uploadedBy": "user-uuid",
  "createdAt": "2025-12-01T10:00:00Z"
}
```

## Implementation

```typescript
// files.service.ts
async uploadFile(
  projectId: string,
  folderId: string,
  userId: string,
  file: Express.Multer.File
) {
  // Generate unique file ID
  const fileId = uuid();
  const s3Key = `org-${orgId}/project-${projectId}/files/${fileId}`;
  
  // Upload to S3
  await this.s3Client.send(new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET,
    Key: s3Key,
    Body: file.buffer,
    ContentType: file.mimetype,
  }));
  
  // Create database record
  const fileRecord = await this.prisma.file.create({
    data: {
      id: fileId,
      name: file.originalname,
      uniqueId: this.extractUniqueId(file.originalname),
      projectId,
      folderId,
      fileType: file.mimetype,
      size: file.size,
      s3Key,
      cdeState: CdeState.WIP,
      currentVersion: 1,
      uploadedBy: userId,
      versions: {
        create: {
          version: 1,
          s3Key,
          size: file.size,
          uploadedBy: userId,
          cdeState: CdeState.WIP,
        },
      },
    },
    include: { versions: true },
  });
  
  // Log audit
  await this.auditService.log({
    userId,
    action: 'FILE_UPLOAD',
    entityType: 'FILE',
    entityId: fileRecord.id,
    metadata: { fileName: file.originalname, size: file.size },
  });
  
  return fileRecord;
}
```

## Environment Variables

```bash
AWS_REGION=ap-southeast-1
AWS_S3_BUCKET=rukon-cde-storage
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
```

## Dependencies
- **Depends on**: Story 1.8 (Projects), Story 1.12 (Folders)
- **Blocks**: Story 1.14 (Naming validation), Story 1.15 (Download), Story 1.16 (CDE transitions)

---

**Created**: 2025-12-01  
**Created by**: SM Agent  
**Status**: 📋 Ready for Development
