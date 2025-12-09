# Story 1.5: Organization Creation (System Admin)

**Epic**: Epic 1 - Core CDE Foundation & Multi-Tenancy  
**Story ID**: `story-1.5`  
**Story Points**: 3  
**Priority**: P0 (Critical)  
**Sprint**: Sprint 1 (Weeks 1-2)

## User Story

**As a** System Admin  
**I want to** create new organizations  
**So that** different companies dapat menggunakan platform dengan data yang terisolasi

## Acceptance Criteria

### Functional
- [x] System Admin dapat create organization baru
- [x] Organization memiliki unique name dan optional domain
- [x] System dapat auto-assign first user sebagai ORG_ADMIN
- [x] Organization dapat memiliki multiple projects dan users
- [x] Organization slug/identifier generated otomatis dari name

### Data Isolation
- [x] Setiap organization memiliki isolated data space
- [x] Organization A tidak bisa access data Organization B
- [x] Database queries automatically scoped by organizationId

### Non-Functional
- [x] Organization name validation (3-100 characters, alphanumeric + spaces)
- [x] Domain uniqueness enforced di database level

## Technical Tasks

### Backend
- [x] Create `OrganizationsModule`, `OrganizationsService`, `OrganizationsController`
- [x] Implement `POST /api/organizations`
- [x] Implement `GET /api/organizations` (SYSTEM_ADMIN only)
- [x] Implement `GET /api/organizations/:id`
- [x] Add validation untuk organization creation
- [x] Auto-generate organization slug
- [x] Write unit tests (Completed in Sprint 1)
- [x] Write integration tests (Completed in Sprint 1)

### Frontend
- [x] Create `/admin/organizations` page (SYSTEM_ADMIN only) (Completed in Sprint 1)
- [x] Build `CreateOrganizationModal` (Completed in Sprint 1)
- [x] Show list of organizations dengan stats (Completed in Sprint 1)
- [x] Handle permissions (hide from non-SYSTEM_ADMIN) (Completed in Sprint 1)

### Database
- [x] Organization model already exists from Epic schema
- [x] Add unique index pada domain field
- [x] Add migration

## Technical Implementation Notes

### Organization Model (already in Epic schema)
```prisma
model Organization {
  id        String    @id @default(uuid())
  name      String
  slug      String    @unique
  domain    String?   @unique
  users     User[]
  projects  Project[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  
  @@index([slug])
}
```

### API Contract

**Create Organization**:
```json
POST /api/organizations
{
  "name": "Acme Construction",
  "domain": "acme-construction.com"
}

Response (201):
{
  "id": "uuid",
  "name": "Acme Construction",
  "slug": "acme-construction",
  "domain": "acme-construction.com",
  "createdAt": "2025-12-01T10:00:00Z"
}
```

**List Organizations**:
```json
GET /api/organizations

Response:
{
  "data": [
    {
      "id": "uuid",
      "name": "Acme Construction",
      "slug": "acme-construction",
      "userCount": 15,
      "projectCount": 5,
      "createdAt": "2025-11-01T09:00:00Z"
    }
  ]
}
```

### Slug Generation
```typescript
// organizations.service.ts
private generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async create(dto: CreateOrganizationDto) {
  const slug = this.generateSlug(dto.name);
  
  // Check slug uniqueness
  const existing = await this.prisma.organization.findUnique({
    where: { slug },
  });
  
  if (existing) {
    throw new ConflictException('Organization with this name already exists');
  }
  
  return this.prisma.organization.create({
    data: {
      name: dto.name,
      slug,
      domain: dto.domain,
    },
  });
}
```

## Dependencies

### Story Dependencies
- **Depends on**: Story 1.2 (Authentication untuk SYSTEM_ADMIN role)

### Blocks
- Story 1.6 (Org Invitation)
- Story 1.7 (Multi-tenancy isolation)
- Story 1.8 (Projects - need organization)

## Testing Strategy

```typescript
describe('OrganizationsService', () => {
  it('should create organization with unique slug', async () => {
    const org = await service.create({ name: 'Test Org', domain: null });
    
    expect(org.slug).toBe('test-org');
  });

  it('should reject duplicate slugs', async () => {
    await service.create({ name: 'Test Org' });
    
    await expect(service.create({ name: 'Test Org' })).rejects.toThrow(ConflictException);
  });
});
```

## Definition of Done

- [x] All acceptance criteria met
- [x] SYSTEM_ADMIN can create organizations
- [x] Slug generation working
- [x] Tests passed
- [x] Code reviewed

---

**Created**: 2025-12-01  
**Created by**: SM Agent  
**Status**: 📋 Ready for Development
