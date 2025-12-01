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
- [ ] System Admin dapat create organization baru
- [ ] Organization memiliki unique name dan optional domain
- [ ] System dapat auto-assign first user sebagai ORG_ADMIN
- [ ] Organization dapat memiliki multiple projects dan users
- [ ] Organization slug/identifier generated otomatis dari name

### Data Isolation
- [ ] Setiap organization memiliki isolated data space
- [ ] Organization A tidak bisa access data Organization B
- [ ] Database queries automatically scoped by organizationId

### Non-Functional
- [ ] Organization name validation (3-100 characters, alphanumeric + spaces)
- [ ] Domain uniqueness enforced di database level

## Technical Tasks

### Backend
- [ ] Create `OrganizationsModule`, `OrganizationsService`, `OrganizationsController`
- [ ] Implement `POST /api/organizations`
- [ ] Implement `GET /api/organizations` (SYSTEM_ADMIN only)
- [ ] Implement `GET /api/organizations/:id`
- [ ] Add validation untuk organization creation
- [ ] Auto-generate organization slug
- [ ] Write unit tests
- [ ] Write integration tests

### Frontend
- [ ] Create `/admin/organizations` page (SYSTEM_ADMIN only)
- [ ] Build `CreateOrganizationModal`
- [ ] Show list of organizations dengan stats
- [ ] Handle permissions (hide from non-SYSTEM_ADMIN)

### Database
- [ ] Organization model already exists from Epic schema
- [ ] Add unique index pada domain field
- [ ] Add migration

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

- [ ] All acceptance criteria met
- [ ] SYSTEM_ADMIN can create organizations
- [ ] Slug generation working
- [ ] Tests passed
- [ ] Code reviewed

---

**Created**: 2025-12-01  
**Created by**: SM Agent  
**Status**: 📋 Ready for Development
