# Stories 1.19 - 1.22: Smart Versioning & Audit Trail

## Story 1.19: Auto Version Creation
**Story Points**: 8 | **Priority**: P0 | **Sprint**: Sprint 4

### User Story
**As a** user, **I want** system automatically create new version saat upload file dengan nama yang sama, **so that** version history preserved dan tidak perlu manual versioning.

### Acceptance Criteria
- [ ] Upload file dengan uniqueId yang sama → auto-increment version
- [ ] Version numbering: V1, V2, V3, dst.
- [ ] Each version stored independently di S3
- [ ] File record maintains currentVersion pointer
- [ ] Old versions remain downloadable
- [ ] Version metadata: uploadedBy, timestamp, CDE state, size

### Implementation
```typescript
async uploadFile(file: File) {
  const uniqueId = this.extractUniqueId(file.name);
  
  // Check existing file
  const existingFile = await this.prisma.file.findUnique({
    where: { uniqueId },
    include: { versions: true },
  });
  
  if (existingFile) {
    // Create new version
    const newVersion = existingFile.currentVersion + 1;
    const s3Key = `org-${orgId}/project-${projectId}/files/${fileId}-v${newVersion}`;
    
    await this.s3Upload(s3Key, file);
    
    await this.prisma.file.update({
      where: { id: existingFile.id },
      data: {
        currentVersion: newVersion,
        versions: {
          create: {
            version: newVersion,
            s3Key,
            size: file.size,
            uploadedBy: userId,
            cdeState: CdeState.WIP,
          },
        },
      },
    });
  } else {
    // Create new file with version 1
    // ... (Story 1.13 logic)
  }
}
```

---

## Story 1.20: Version History & Rollback
**Story Points**: 5 | **Priority**: P1 | **Sprint**: Sprint 4

### User Story
**As a** project member, **I want to** view version history dan rollback ke previous version jika diperlukan, **so that** saya dapat recover dari mistakes.

### Acceptance Criteria
- [ ] User dapat view all versions dengan metadata
- [ ] Show diff: file size, uploader, timestamp, CDE state changes
- [ ] INFORMATION_MANAGER dapat rollback ke previous version
- [ ] Rollback creates new version (tidak delete current)
- [ ] Rollback logged di audit trail

### API
```json
GET /api/files/:id/versions

Response:
{
  "fileId": "uuid",
  "currentVersion": 3,
  "versions": [
    {
      "version": 3,
      "uploadedBy": "user-uuid",
      "uploadedAt": "2025-12-01T15:00:00Z",
      "cdeState": "SHARED",
      "size": 5242880,
      "isCurrent": true
    },
    {
      "version": 2,
      "uploadedBy": "user-uuid",
      "uploadedAt": "2025-12-01T12:00:00Z",
      "cdeState": "WIP",
      "size": 5000000,
      "isCurrent": false
    }
  ]
}

POST /api/files/:id/restore/:version
// Creates new version as copy of specified version
```

---

## Story 1.21: File Stacking Display (ACC-Style)
**Story Points**: 3 | **Priority**: P1 | **Sprint**: Sprint 4

### User Story
**As a** user browsing files, **I want** versions ditampilkan stacked under same file entry, **so that** file list tidak cluttered dengan multiple versions.

### Acceptance Criteria
- [ ] File list shows latest version only by default
- [ ] Expand/collapse untuk show all versions
- [ ] Visual indicator untuk version count (e.g., "V3" badge)
- [ ] Quick access ke download specific version
- [ ] Hover shows quick version metadata

### Frontend Component
```tsx
<FileRow file={file}>
  <FileName>{file.name}</FileName>
  <VersionBadge>V{file.currentVersion}</VersionBadge>
  <ExpandIcon onClick={() => toggleVersions(file.id)} />
  
  {expanded && (
    <VersionList>
      {file.versions.map(v => (
        <VersionRow key={v.version}>
          V{v.version} - {v.uploadedAt} - {v.uploadedBy}
          <DownloadButton version={v.version} />
        </VersionRow>
      ))}
    </VersionList>
  )}
</FileRow>
```

---

## Story 1.22: Audit Trail System
**Story Points**: 5 | **Priority**: P0 | **Sprint**: Sprint 5

### User Story
**As a** compliance officer, **I want** complete audit trail untuk all file operations, **so that** saya dapat track who did what and when untuk ISO 19650 compliance.

### Acceptance Criteria
- [ ] Log all file operations: UPLOAD, DOWNLOAD, DELETE, VIEW, STATE_CHANGE, RESTORE
- [ ] Log project operations: CREATE, UPDATE, ARCHIVE
- [ ] Log user operations: LOGIN, LOGOUT, PASSWORD_RESET
- [ ] Audit log immutable (append-only)
- [ ] Search & filter audit logs by: user, action, entity, date range
- [ ] Export audit logs sebagai CSV/Excel
- [ ] Retention policy: keep logs ≥ 7 years

### Database Model (Already in Epic Schema)
```prisma
model AuditLog {
  id         String   @id @default(uuid())
  userId     String
  action     String   // UPLOAD, DOWNLOAD, DELETE, etc.
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

### API
```json
GET /api/audit-logs?userId=uuid&action=UPLOAD&startDate=2025-11-01&endDate=2025-12-01&page=1

Response:
{
  "data": [
    {
      "id": "log-uuid",
      "userId": "user-uuid",
      "userName": "John Doe",
      "action": "FILE_UPLOAD",
      "entityType": "FILE",
      "entityId": "file-uuid",
      "metadata": {
        "fileName": "MRT3-ARC-A-01-DR-A-001.pdf",
        "size": 5242880
      },
      "ipAddress": "192.168.1.1",
      "timestamp": "2025-12-01T10:00:00Z"
    }
  ],
  "meta": { "total": 1500, "page": 1, "totalPages": 30 }
}
```

### Logging Service
```typescript
// audit.service.ts
async log(entry: AuditLogEntry) {
  return this.prisma.auditLog.create({
    data: {
      userId: entry.userId,
      action: entry.action,
      entityType: entry.entityType,
      entityId: entry.entityId,
      metadata: entry.metadata,
      ipAddress: entry.ipAddress,
      userAgent: entry.userAgent,
    },
  });
}

// Usage throughout app
await this.auditService.log({
  userId: user.id,
  action: 'FILE_UPLOAD',
  entityType: 'FILE',
  entityId: file.id,
  metadata: { fileName: file.name, size: file.size },
  ipAddress: req.ip,
  userAgent: req.headers['user-agent'],
});
```

---

**Created**: 2025-12-01  
**Created by**: SM Agent  
**Status**: 📋 Ready for Development  
**Epic 1 Story Sharding**: ✅ COMPLETE (22/22 Stories)
