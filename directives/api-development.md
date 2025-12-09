# Directive: API Development with NestJS

**ID**: DIR-006  
**Layer**: Directive (What to do)  
**Trigger**: User requests new API endpoints atau backend functionality

## 1. Objective
Create RESTful API endpoints dalam NestJS dengan proper RBAC, validation, error handling, dan multi-tenancy support.

## 2. Input
- API contract dari story file (endpoints, methods, request/response schemas)
- Business logic requirements
- Authorization requirements (which roles can access)
- Validation rules

## 3. Tools & Scripts
- **NestJS CLI**: Generate controllers, services, modules
- **Class Validator**: DTO validation
- **Jest**: Unit testing
- **Prisma**: Database access
- **API Tester**: `execution/api_endpoint_tester.py`

## 4. Workflow

### 4.1 Planning
1. Review story API contract
2. Identify required endpoints (GET, POST, PATCH, DELETE)
3. Define DTOs (Data Transfer Objects)
4. Plan service layer logic
5. Identify authentication/authorization needs
6. Plan error scenarios

### 4.2 Generate Structure
Using NestJS CLI:

```bash
# Generate module (if new feature)
nest g module features/user-management

# Generate controller
nest g controller features/user-management --no-spec

# Generate service
nest g service features/user-management --no-spec

# We'll create tests manually untuk better control
```

File structure generated:
```
apps/api/src/features/user-management/
├── user-management.controller.ts
├── user-management.service.ts
├── user-management.module.ts
└── dto/
    ├── create-user.dto.ts
    ├── update-user.dto.ts
    └── query-user.dto.ts
```

### 4.3 Create DTOs
DTOs provide validation dan type safety.

**Example: Create DTO**
```typescript
// dto/create-user.dto.ts
import { IsEmail, IsString, MinLength, IsEnum, IsOptional } from 'class-validator';
import { UserRole } from '@prisma/client';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  @MinLength(2)
  name: string;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
}
```

**Example: Update DTO**
```typescript
// dto/update-user.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}
```

**Example: Query DTO**
```typescript
// dto/query-user.dto.ts
import { IsOptional, IsInt, Min, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryUserDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  limit?: number = 50;

  @IsOptional()
  @IsString()
  search?: string;
}
```

### 4.4 Implement Controller
Controller handles HTTP requests dan routing.

```typescript
// user-management.controller.ts
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/auth/guards/roles.guard';
import { Roles } from '@/auth/decorators/roles.decorator';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';
import { UserManagementService } from './user-management.service';
import { CreateUserDto, UpdateUserDto, QueryUserDto } from './dto';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserManagementController {
  constructor(private readonly userService: UserManagementService) {}

  @Get()
  @Roles(UserRole.ORG_ADMIN, UserRole.SYSTEM_ADMIN)
  async findAll(
    @CurrentUser() user: UserFromJwt,
    @Query() query: QueryUserDto,
  ) {
    return this.userService.findAll(user, query);
  }

  @Get(':id')
  @Roles(UserRole.ORG_ADMIN, UserRole.SYSTEM_ADMIN)
  async findOne(
    @CurrentUser() user: UserFromJwt,
    @Param('id') id: string,
  ) {
    return this.userService.findOne(user, id);
  }

  @Post()
  @Roles(UserRole.ORG_ADMIN, UserRole.SYSTEM_ADMIN)
  async create(
    @CurrentUser() user: UserFromJwt,
    @Body() dto: CreateUserDto,
  ) {
    return this.userService.create(user, dto);
  }

  @Patch(':id')
  @Roles(UserRole.ORG_ADMIN, UserRole.SYSTEM_ADMIN)
  async update(
    @CurrentUser() user: UserFromJwt,
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
  ) {
    return this.userService.update(user, id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.SYSTEM_ADMIN)
  async remove(
    @CurrentUser() user: UserFromJwt,
    @Param('id') id: string,
  ) {
    return this.userService.remove(user, id);
  }
}
```

### 4.5 Implement Service
Service contains business logic.

```typescript
// user-management.service.ts
import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { UserRole } from '@prisma/client';
import { CreateUserDto, UpdateUserDto, QueryUserDto } from './dto';

@Injectable()
export class UserManagementService {
  constructor(private prisma: PrismaService) {}

  async findAll(currentUser: UserFromJwt, query: QueryUserDto) {
    const where: Prisma.UserWhereInput = {};

    // Multi-tenancy: ORG_ADMIN can only see their org users
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

  async findOne(currentUser: UserFromJwt, id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { organization: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Multi-tenancy check
    if (
      currentUser.role !== UserRole.SYSTEM_ADMIN &&
      user.organizationId !== currentUser.organizationId
    ) {
      throw new ForbiddenException('Cannot access user from different organization');
    }

    return user;
  }

  async create(currentUser: UserFromJwt, dto: CreateUserDto) {
    // Business logic here
    // Hash password, assign organization, etc.
  }

  async update(currentUser: UserFromJwt, id: string, dto: UpdateUserDto) {
    // Verify access first
    await this.findOne(currentUser, id);
    
    // Update logic
    return this.prisma.user.update({
      where: { id },
      data: dto,
    });
  }

  async remove(currentUser: UserFromJwt, id: string) {
    // Verify access
    await this.findOne(currentUser, id);
    
    // Soft delete preferred
    return this.prisma.user.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
```

### 4.6 Error Handling
Use NestJS built-in exceptions:

```typescript
import {
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';

// Example usage
if (!user) {
  throw new NotFoundException('User not found');
}

if (email already exists) {
  throw new ConflictException('Email already in use');
}

if (no permission) {
  throw new ForbiddenException('Insufficient permissions');
}
```

### 4.7 Testing
Write comprehensive tests:

```typescript
// user-management.service.spec.ts
describe('UserManagementService', () => {
  let service: UserManagementService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserManagementService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get(UserManagementService);
    prisma = module.get(PrismaService);
  });

  describe('findAll', () => {
    it('should return users for ORG_ADMIN from same org only', async () => {
      const orgAdmin = { id: '1', role: UserRole.ORG_ADMIN, organizationId: 'org1' };
      
      await service.findAll(orgAdmin, { page: 1, limit: 50 });
      
      expect(prisma.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            organizationId: 'org1',
          }),
        }),
      );
    });

    it('should return users from all orgs for SYSTEM_ADMIN', async () => {
      const sysAdmin = { id: '1', role: UserRole.SYSTEM_ADMIN };
      
      await service.findAll(sysAdmin, { page: 1, limit: 50 });
      
      expect(prisma.user.findMany).toHaveBeenCalledWith(
        expect.not.objectContaining({
          where: expect.objectContaining({
            organizationId: expect.anything(),
          }),
        }),
      );
    });
  });

  describe('findOne', () => {
    it('should throw NotFoundException if user not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      
      await expect(
        service.findOne(mockUser, 'invalid-id')
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException for cross-org access', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: '2',
        organizationId: 'org2',
      });
      
      const orgAdmin = { id: '1', role: UserRole.ORG_ADMIN, organizationId: 'org1' };
      
      await expect(
        service.findOne(orgAdmin, '2')
      ).rejects.toThrow(ForbiddenException);
    });
  });
});
```

## 5. Output
- Controller file dengan all endpoints
- Service file dengan business logic
- DTO files dengan validation
- Test files dengan ≥80% coverage
- Updated module file

## 6. Edge Cases

### 6.1 Multi-Tenancy Violations
**Scenario**: User trying to access resource dari different organization

**Solution**:
- Always check `organizationId` in service layer
- Throw `ForbiddenException` jika cross-org access detected
- Except for SYSTEM_ADMIN role

### 6.2 Concurrent Updates
**Scenario**: Two users updating same resource simultaneously

**Solution**:
```typescript
// Use optimistic locking dengan version field
await prisma.user.update({
  where: {
    id: id,
    version: currentVersion, // Will fail if version changed
  },
  data: {
    ...dto,
    version: { increment: 1 },
  },
});
```

### 6.3 Pagination Edge Cases
**Scenario**: Page number exceeds total pages

**Solution**:
```typescript
const totalPages = Math.ceil(total / limit);
if (page > totalPages && total > 0) {
  // Return last page instead of empty result
  page = totalPages;
}
```

### 6.4 Search Performance
**Scenario**: Search query too slow on large datasets

**Solution**:
- Ensure database indexes exist on search fields
- Limit search results
- Consider full-text search untuk better performance
- Add minimum character requirement untuk search

## 7. Best Practices

✅ **DO**:
- Use DTOs untuk all request/response validation
- Implement RBAC dengan guards
- Enforce multi-tenancy in service layer
- Write comprehensive tests
- Use proper HTTP status codes
- Log errors dengan context
- Return consistent response formats
- Use transactions untuk multi-step operations
- Sanitize user input
- Document endpoints dengan Swagger decorators

❌ **DON'T**:
- Put business logic in controllers
- Skip input validation
- Return sensitive data (passwords, etc.)
- Use raw database queries (use Prisma)
- Ignore error handling
- Skip authorization checks
- Expose internal error details to clients
- Use synchronous operations for I/O

## 8. Security Checklist

Before deploying API endpoints:

- [ ] All endpoints have authentication (JwtAuthGuard)
- [ ] Proper authorization (RolesGuard) implemented
- [ ] Input validation on all DTOs
- [ ] Multi-tenancy isolation enforced
- [ ] No sensitive data in responses
- [ ] SQL injection prevented (using Prisma)
- [ ] Rate limiting considered (if needed)
- [ ] CORS configured properly
- [ ] Error messages don't leak system info

## 9. Performance Optimization

1. **Database Queries**:
   - Use `select` to fetch only needed fields
   - Avoid N+1 queries dengan `include`
   - Use pagination for large datasets
   - Implement caching untuk frequently accessed data

2. **Response Size**:
   - Don't return entire objects jika tidak perlu
   - Use DTOs untuk response shaping
   - Implement field selection jika needed

3. **Async Operations**:
   - Use `Promise.all()` untuk parallel operations
   - Avoid blocking operations in request handlers
