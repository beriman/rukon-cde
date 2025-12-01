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
- [ ] User dapat upload single file atau multiple files sekaligus
- [ ] Support file size up to 500MB per file
- [ ] Files default uploaded ke WIP state
- [ ] Chunked upload untuk large files (multipart)
- [ ] File metadata extracted: name, size, type, hash
- [ ] Upload progress indicator di frontend
- [ ] File stored di S3: `org-{orgId}/project-{projectId}/files/{fileId}`

### Validation
- [ ] Validate file type (configurable allowed extensions)
- [ ] Validate naming convention (Story 1.14)
- [ ] Check available storage quota (future)

## Technical Tasks

### Backend
- [ ] Setup AWS S3 SDK dan configuration
- [ ] Implement multipart upload handler
- [ ] **Performance**: Implement streaming upload directly to S3 (avoid memory buffering)
- [ ] Implement `POST /api/projects/:id/files` (upload endpoint)
- [ ] Generate file hash (MD5/SHA256) untuk duplicate detection
- [ ] Create File record di database
- [ ] Link file ke folder dan project
- [ ] Handle upload errors (rollback S3 if DB fails)
- [ ] Add file upload logging

### Frontend
- [ ] File upload component dengan drag-and-drop
- [ ] Multiple file selection
- [ ] Upload progress bar (per file)
- [ ] Chunk upload implementation
- [ ] Error handling & retry logic

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
