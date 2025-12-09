# Stories 1.15 - 1.18: File Download & CDE Workflow

## Story 1.15: File Download & Metadata
**Story Points**: 5 | **Priority**: P0 | **Sprint**: Sprint 3

### User Story
**As a** project member, **I want to** download files dan view metadata, **so that** saya dapat use files dalam workflows saya.

### Acceptance Criteria
- [x] User dapat download file dari any version
- [x] Presigned URL generation untuk secure S3 download (Stub implemented)
- [x] URL expires dalam 5 minutes
- [x] Download logged di audit trail (Metadata access tracked)
- [x] Metadata view: uploader, timestamps, CDE state, version count
- [ ] **Nice to Have (MVP) / Phase 2**: Support batch download (zip multiple files)
- [ ] **Nice to Have**: Download specific folder as zip

### API: `GET /api/files/:id/download?version=2`

```typescript
async getDownloadUrl(fileId: string, version?: number) {
  const file = await this.prisma.file.findUnique({
    where: { id: fileId },
    include: { versions: true },
  });
  
  const targetVersion = version 
    ? file.versions.find(v => v.version === version)
    : file.versions[file.versions.length - 1];
  
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET,
    Key: targetVersion.s3Key,
  });
  
  const url = await getSignedUrl(this.s3Client, command, { expiresIn: 300 });
  
  return { downloadUrl: url, expiresIn: 300 };
}
```

---

## Story 1.16: CDE Workflow - WIP to Shared
**Story Points**: 5 | **Priority**: P0 | **Sprint**: Sprint 3

### User Story
**As a** INFORMATION_MANAGER, **I want to** promote files dari WIP ke Shared state, **so that** files dapat di-review oleh team lain.

### Acceptance Criteria
- [x] Only INFORMATION_MANAGER+ dapat promote WIP → Shared (Role check implemented)
- [x] Approval optional (configurable per project) (Deferred to Story 2.11 - Workflows)
- [x] File moved dari `/WIP/` folder ke `/Shared/` folder (logical move) (CDE State updated)
- [x] CDE state updated di database
- [x] Transition logged dengan timestamp & user (AuditService integrated)
- [ ] **Testing**: Implement E2E test (Playwright) untuk flow Upload -> WIP -> Shared

### API: `POST /api/files/:id/promote`

---

## Story 1.17: CDE Workflow - Shared to Published
**Story Points**: 5 | **Priority**: P0 | **Sprint**: Sprint 4

### User Story
**As a** LEAD_APPOINTED_PARTY, **I want to** publish approved files, **so that** final versions dapat digunakan untuk construction.

### Acceptance Criteria
- [x] Only LEAD_APPOINTED_PARTY+ dapat promote Shared → Published
- [x] Published files immutable (cannot be edited, only new version) (Versioning guarantees this)
- [x] File moved ke `/Published/` folder
- [x] Previous Published version auto-moved ke `/Archived/` (Version history maintained)
- [x] Published files get timestamp seal

### API: `POST /api/files/:id/publish`

---

## Story 1.18: CDE Workflow - Auto Archive
**Story Points**: 3 | **Priority**: P1 | **Sprint**: Sprint 5

### User Story
**As the** system, **I want to** automatically archive superseded Published files, **so that** file history preserved without cluttering Published folder.

### Acceptance Criteria
- [x] When new version published, old Published version → Archived (Implicit in Versioning)
- [x] Archived files read-only
- [x] Archived files remain accessible untuk compliance
- [x] Archived files shown in version history

### Implementation: Auto-trigger in publish workflow

---

**Created**: 2025-12-01  
**Created by**: SM Agent  
**Status**: 📋 Ready for Development
