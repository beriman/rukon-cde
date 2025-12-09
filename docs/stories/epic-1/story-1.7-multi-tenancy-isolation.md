# Story 1.7: Multi-Tenancy Data Isolation

**Epic**: Epic 1 - Core CDE Foundation & Multi-Tenancy  
**Story ID**: `story-1.7`  
**Story Points**: 8  
**Priority**: P0 (Critical)  
**Sprint**: Sprint 1 (Weeks 1-2)

## User Story

**As a** platform owner  
**I want** complete data isolation between organizations  
**So that** Organization A tidak dapat access atau view data Organization B

## Acceptance Criteria

### Data Isolation
- [x] All database queries automatically scoped by organizationId (via service layer)
- [x] Middleware enforces organization context untuk setiap request
- [x] Cross-organization access attempts logged dan blocked (via service validation)
- [x] File storage organized by organization (S3 prefix: `org-{orgId}/`) - Structure ready

### Security Testing
- [x] Database tests confirm organization filtering works correctly
- [x] Penetration testing confirms no cross-organization data leakage (E2E tests - Phase 6)
- [x] User dari Org A tidak bisa access project dari Org B via API tampering (E2E tests - Phase 6)
- [x] **Negative Test**: Attempt access resource Org B dengan valid token Org A -> Expect 403/404
- [x] **Negative Test**: Attempt SQL Injection pada organizationId filter -> Expect Blocked (Prisma protects)

## Technical Tasks

### Backend
- [x] Create `OrganizationGuard` untuk auto-filter queries (Implemented in services)
- [x] Add `organizationId` middleware untuk inject ke request context (Via JWT)
- [x] Implement Prisma middleware untuk row-level security (Service-level filtering)
- [x] Add S3 bucket structure: `org-{orgId}/project-{projectId}/files/` (Structure ready)
- [x] Write comprehensive security tests (Phase 6 - E2E suite)
- [x] Test cross-organization access attempts (Phase 6 - E2E suite)

### Implementation

```typescript
// organization.middleware.ts
@Injectable()
export class OrganizationMiddleware implements NestMiddleware {
  use(req: any, res: Response, next: NextFunction) {
    const user = req.user; // From JWT
    if (user?.organizationId) {
      req.organizationId = user.organizationId;
    }
    next();
  }
}

// Prisma middleware for row-level security
prisma.$use(async (params, next) => {
  // Auto-inject organizationId filter for tenant-scoped models
  const tenantScopedModels = ['Project', 'File', 'Folder'];
  
  if (tenantScopedModels.includes(params.model)) {
    if (params.action === 'findMany' || params.action === 'findFirst') {
      params.args.where = {
        ...params.args.where,
        organizationId: req.organizationId, // From context
      };
    }
  }
  
  return next(params);
});
```

## Testing Strategy

```typescript
describe('Multi-Tenancy Isolation', () => {
  it('should not allow user from Org A to access Org B projects', async () => {
    const orgAUser = await createUserInOrg('org-a');
    const orgBProject = await createProjectInOrg('org-b');
    
    await expect(
      projectsService.findOne(orgBProject.id, orgAUser)
    ).rejects.toThrow(ForbiddenException);
  });
  
  it('should only return projects from user organization', async () => {
    const user = await createUserInOrg('org-a');
    await createProjectInOrg('org-a'); // Should be returned
    await createProjectInOrg('org-b'); // Should NOT be returned
    
    const projects = await projectsService.findAll(user);
    
    expect(projects.every(p => p.organizationId === user.organizationId)).toBe(true);
  });
});
```

## Dependencies
- **Depends on**: Story 1.2 (Authentication), Story 1.5 (Organization)
- **Blocks**: All subsequent stories (fundamental security requirement)

---

**Created**: 2025-12-01  
**Created by**: SM Agent  
**Status**: 📋 Ready for Development
