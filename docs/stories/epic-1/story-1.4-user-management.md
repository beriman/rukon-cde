# Story 1.4: User Management by Admin

**Epic**: Epic 1 - Core CDE Foundation & Multi-Tenancy  
**Story ID**: `story-1.4`  
**Story Points**: 5  
**Priority**: P1 (High)  
**Sprint**: Sprint 5 (Weeks 9-10)

## User Story

**As an** Organization Admin  
**I want to** manage users dalam organization saya (view, edit, deactivate)  
**So that** saya dapat control access dan maintain user data

## Acceptance Criteria

### Functional
- [ ] Org Admin dapat view list semua users di organizationnya
- [ ] Admin dapat search users by name atau email
- [ ] Admin dapat view user details (name, email, role, last login, status)
- [ ] Admin dapat edit user information (name, role)
- [ ] Admin dapat deactivate/reactivate user account
- [ ] Admin dapat resend invitation email
- [ ] Deactivated users tidak bisa login
- [ ] Admin tidak bisa deactivate diri sendiri
- [ ] System Admin dapat manage users across all organizations

### RBAC
- [ ] Only ORG_ADMIN dan SYSTEM_ADMIN dapat access user management
- [ ] ORG_ADMIN hanya dapat manage users dalam organizationnya sendiri
- [ ] SYSTEM_ADMIN dapat manage users di semua organizations

### Non-Functional
- [ ] User list pagination (max 50 users per page)
- [ ] Efficient search dengan database indexing
- [ ] Audit log untuk semua user management actions

## Technical Tasks

### Backend (NestJS)
- [ ] Create `UsersController` dengan RBAC guards
- [ ] Implement `GET /api/users` (list dengan pagination & search)
- [ ] Implement `GET /api/users/:id` (get user details)
- [ ] Implement `PATCH /api/users/:id` (update user)
- [ ] Implement `PATCH /api/users/:id/deactivate` (deactivate)
- [ ] Implement `PATCH /api/users/:id/reactivate` (reactivate)
- [ ] Add `RoleGuard` untuk enforce RBAC
- [ ] Add `OrganizationGuard` untuk multi-tenancy isolation
- [ ] Add pagination utility
- [ ] Write unit tests
- [ ] Write integration tests untuk RBAC

### Frontend
- [ ] Create `/users` page (Admin only)
- [ ] Build `UserList` component dengan table
- [ ] Add pagination component
- [ ] Add search bar
- [ ] Create `UserDetailModal` untuk view/edit
- [ ] Add confirmation dialog untuk deactivate action
- [ ] Handle loading & error states
- [ ] Add role-based UI rendering

### Database
- [ ] Add `isActive` field ke User model
- [ ] Add `lastLoginAt` field ke User model
- [ ] Migration untuk existing users

## Technical Implementation Notes

### Updated User Model
```prisma
model User {
  id             String        @id @default(uuid())
  email          String        @unique
  passwordHash   String
  name           String
  role           UserRole      @default(VIEWER)
  isActive       Boolean       @default(true)
  lastLoginAt    DateTime?
  organizationId String
  organization   Organization  @relation(fields: [organizationId], references: [id])
  createdAt      DateTime      @default(now())
  updatedAt      DateTime      @updatedAt
  
  @@index([email])
  @@index([organizationId])
  @@index([isActive])
}
```

### API Contract

**List Users**:
```json
GET /api/users?page=1&limit=50&search=john

Response:
{
  "data": [
    {
      "id": "uuid",
      "email": "john@example.com",
      "name": "John Doe",
      "role": "VIEWER",
      "isActive": true,
      "lastLoginAt": "2025-12-01T10:00:00Z",
      "createdAt": "2025-11-01T09:00:00Z"
    }
  ],
  "meta": {
    "total": 120,
    "page": 1,
    "limit": 50,
    "totalPages": 3
  }
}
```

**Update User**:
```json
PATCH /api/users/:id
{
  "name": "John Smith",
  "role": "INFORMATION_MANAGER"
}

Response:
{
  "id": "uuid",
  "name": "John Smith",
  "role": "INFORMATION_MANAGER",
  "updatedAt": "2025-12-01T11:00:00Z"
}
```

**Deactivate User**:
```json
PATCH /api/users/:id/deactivate

Response:
{
  "message": "User deactivated successfully",
  "user": {
    "id": "uuid",
    "isActive": false
  }
}
```

### RBAC Implementation
```typescript
// roles.guard.ts
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => user.role === role);
  }
}

// Usage in controller
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  @Roles(UserRole.ORG_ADMIN, UserRole.SYSTEM_ADMIN)
  @Get()
  async listUsers(@CurrentUser() user: UserFromJwt, @Query() query: ListUsersDto) {
    return this.usersService.findAll(user, query);
  }
}
```

### Organization Isolation
```typescript
// users.service.ts
async findAll(currentUser: UserFromJwt, query: ListUsersDto) {
  const where: Prisma.UserWhereInput = {};

  // Organization isolation (except SYSTEM_ADMIN)
  if (currentUser.role !== UserRole.SYSTEM_ADMIN) {
    where.organizationId = currentUser.organizationId;
  }

  // Search filter
  if (query.search) {
    where.OR = [
      { name: { contains: query.search, mode: 'insensitive' } },
      { email: { contains: query.search, mode: 'insensitive' } },
    ];
  }

  const [users, total] = await Promise.all([
    this.prisma.user.findMany({
      where,
      skip: (query.page - 1) * query.limit,
      take: query.limit,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    }),
    this.prisma.user.count({ where }),
  ]);

  return {
    data: users,
    meta: {
      total,
      page: query.page,
      limit: query.limit,
      totalPages: Math.ceil(total / query.limit),
    },
  };
}
```

## Dependencies

### Story Dependencies
- **Depends on**: Story 1.1, 1.2 (User & Auth system)
- **Depends on**: Story 1.5 (Organization exists)

## Testing Strategy

### Unit Tests
```typescript
describe('UsersService', () => {
  it('should only return users from same organization for ORG_ADMIN', async () => {
    const result = await usersService.findAll(orgAdminUser, { page: 1, limit: 50 });
    
    expect(result.data.every(u => u.organizationId === orgAdminUser.organizationId)).toBe(true);
  });

  it('should return users from all organizations for SYSTEM_ADMIN', async () => {
    const result = await usersService.findAll(systemAdminUser, { page: 1, limit: 50 });
    
    const uniqueOrgs = new Set(result.data.map(u => u.organizationId));
    expect(uniqueOrgs.size).toBeGreaterThan(1);
  });
});
```

## Definition of Done

- [ ] All acceptance criteria met
- [ ] RBAC working correctly
- [ ] Multi-tenancy isolation enforced
- [ ] Tests ≥ 80% coverage
- [ ] Code reviewed
- [ ] Documentation updated

---

**Created**: 2025-12-01  
**Created by**: SM Agent  
**Status**: 📋 Ready for Development
