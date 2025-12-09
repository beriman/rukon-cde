# Story 1.1: User Authentication & Registration

**Epic**: Epic 1 - Core CDE Foundation & Multi-Tenancy  
**Story ID**: `story-1.1`  
**Story Points**: 5  
**Priority**: P0 (Critical)  
**Sprint**: Sprint 1 (Weeks 1-2)

## User Story

**As a** new user  
**I want to** register an account dengan email dan password  
**So that** saya dapat access platform Rukon CDE

## Acceptance Criteria

### Functional
- [x] User dapat mengakses halaman registration
- [x] Form registration meminta: Email, Name, Password, Confirm Password
- [x] Email harus valid format (regex validation)
- [x] Password minimal 8 karakter, mengandung huruf besar, kecil, dan angka
- [x] Confirm password harus match dengan password
- [x] System menolak email yang sudah terdaftar
- [x] Setelah sukses, user redirect ke login page dengan success message
- [ ] Email confirmation dikirim ke user (optional untuk MVP)

### Security
- [x] Password di-hash menggunakan bcrypt (minimum 10 rounds)
- [x] Password tidak pernah disimpan dalam plaintext
- [x] HTTPS enforced untuk registration endpoint (Handled by Infra/Gateway)
- [x] Rate limiting: max 5 registration attempts per IP per hour

### Non-Functional
- [x] API response time < 500ms (p95) (Verified locally)
- [x] Error messages jelas dan user-friendly
- [x] Input validation di frontend dan backend
- [x] Database constraint mencegah duplicate email

## Technical Tasks

### Backend (NestJS)
- [x] Create `AuthModule`, `AuthService`, `AuthController`
- [x] Create `UsersModule`, `UsersService` untuk user management
- [x] Implement `POST /api/auth/register` endpoint
- [x] Setup bcrypt untuk password hashing
- [x] Create Prisma schema untuk User model
- [x] Add email uniqueness constraint di database
- [x] Implement DTO validation dengan class-validator:
  - `RegisterDto` (email, name, password, confirmPassword)
- [x] Write unit tests untuk `AuthService.register()`
- [x] Write integration tests untuk registration flow
- [x] Add rate limiting dengan `@nestjs/throttler`

### Frontend (React/Next.js)
- [x] Create `/register` page
- [x] Build `RegisterForm` component dengan validation
- [x] Implement real-time field validation
- [x] Add password strength indicator
- [x] Handle error states (duplicate email, weak password, etc.)
- [x] Add loading states untuk submission
- [x] Redirect ke login page setelah success

### Database
- [x] Run migration untuk User table
- [x] Add index pada email column untuk performance

## Technical Implementation Notes

### Database Schema (Prisma)
```prisma
model User {
  id           String       @id @default(uuid())
  email        String       @unique
  passwordHash String
  name         String
  role         UserRole     @default(VIEWER)
  organizationId String?
  organization Organization? @relation(fields: [organizationId], references: [id])
  createdAt    DateTime     @default(now())
  updatedAt    DateTime     @updatedAt
  
  @@index([email])
  @@index([organizationId])
}

enum UserRole {
  SYSTEM_ADMIN
  ORG_ADMIN
  APPOINTING_PARTY
  LEAD_APPOINTED_PARTY
  APPOINTED_PARTY
  INFORMATION_MANAGER
  VIEWER
}
```

### API Contract

**Request**:
```json
POST /api/auth/register
{
  "email": "user@example.com",
  "name": "John Doe",
  "password": "SecureP@ss123",
  "confirmPassword": "SecureP@ss123"
}
```

**Response (Success - 201)**:
```json
{
  "message": "Registration successful. Please check your email.",
  "user": {
    "id": "uuid-here",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

**Response (Error - 400)**:
```json
{
  "statusCode": 400,
  "message": ["email must be a valid email", "password is too weak"],
  "error": "Bad Request"
}
```

### Validation Rules
```typescript
// RegisterDto
export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
    { message: 'Password too weak' }
  )
  password: string;

  @IsString()
  @IsNotEmpty()
  confirmPassword: string;
}
```

### Security Implementation
```typescript
// auth.service.ts
async register(dto: RegisterDto): Promise<User> {
  // Validate passwords match
  if (dto.password !== dto.confirmPassword) {
    throw new BadRequestException('Passwords do not match');
  }

  // Check if email exists
  const existingUser = await this.prisma.user.findUnique({
    where: { email: dto.email },
  });
  
  if (existingUser) {
    throw new ConflictException('Email already registered');
  }

  // Hash password
  const passwordHash = await bcrypt.hash(dto.password, 10);

  // Create user
  const user = await this.prisma.user.create({
    data: {
      email: dto.email,
      name: dto.name,
      passwordHash,
    },
  });

  // Remove password from response
  delete user.passwordHash;
  return user;
}
```

## Dependencies

### Technical Dependencies
- Prisma ORM installed and configured
- PostgreSQL database setup
- NestJS project initialized
- bcryptjs package installed
- class-validator and class-transformer packages

### Story Dependencies
- None (This is the foundation story)

### Blocks
- Story 1.2 (Login - depends on User being registered)
- Story 1.4 (User Management - depends on User model)

## Testing Strategy

### Unit Tests
```typescript
describe('AuthService', () => {
  it('should hash password before saving', async () => {
    const result = await authService.register(mockDto);
    expect(bcrypt.hash).toHaveBeenCalledWith(mockDto.password, 10);
  });

  it('should throw error for duplicate email', async () => {
    await expect(authService.register(duplicateDto)).rejects.toThrow(
      ConflictException
    );
  });

  it('should throw error if passwords do not match', async () => {
    const dto = { ...mockDto, confirmPassword: 'different' };
    await expect(authService.register(dto)).rejects.toThrow(
      BadRequestException
    );
  });
});
```

### Integration Tests
```typescript
describe('POST /api/auth/register', () => {
  it('should create new user and return 201', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send(validRegisterDto)
      .expect(201);

    expect(response.body.user.email).toBe(validRegisterDto.email);
    expect(response.body.user.passwordHash).toBeUndefined();
  });

  it('should return 409 for duplicate email', async () => {
    await createUser(validRegisterDto.email);
    
    await request(app.getHttpServer())
      .post('/api/auth/register')
      .send(validRegisterDto)
      .expect(409);
  });
});
```

## Definition of Done

- [x] All acceptance criteria met
- [x] Backend implementation complete dengan validation
- [x] Frontend registration form functional
- [x] Unit tests written dengan coverage ≥ 80%
- [x] Integration tests passed
- [x] Security requirements met (bcrypt, rate limiting)
- [x] Code reviewed dan approved
- [x] API documentation updated (Swagger)
- [x] Manual testing completed
- [x] Deployed to development environment

## Notes

### Known Issues / Tech Debt
- Email verification tidak implemented di MVP (akan ada di Phase 2)
- Social login (Google/Microsoft) belum supported
- CAPTCHA untuk anti-bot protection akan ditambahkan later

### Future Enhancements
- Two-factor authentication (2FA)
- Email verification flow
- Social login integration
- Password complexity meter
- Account activation workflow

---

**Created**: 2025-12-01  
**Created by**: SM Agent  
**Status**: 📋 Ready for Development
