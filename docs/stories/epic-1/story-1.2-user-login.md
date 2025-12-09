# Story 1.2: User Login & Token Management

**Epic**: Epic 1 - Core CDE Foundation & Multi-Tenancy  
**Story ID**: `story-1.2`  
**Story Points**: 5  
**Priority**: P0 (Critical)  
**Sprint**: Sprint 1 (Weeks 1-2)

## User Story

**As a** registered user  
**I want to** login dengan email dan password  
**So that** saya dapat mengakses platform dan melakukan operations sesuai dengan permissions saya

## Acceptance Criteria

### Functional
- [x] User dapat mengakses halaman login
- [x] Login form meminta Email dan Password
- [x] System validasi credentials terhadap database
- [x] Jika credentials benar, system mengembalikan JWT access token dan refresh token
- [x] Access token expired dalam 15 menit
- [x] Refresh token stored sebagai httpOnly cookie
- [x] User redirect ke dashboard setelah successful login
- [x] Invalid credentials menampilkan error message yang jelas
- [x] Login attempts logged untuk security audit

### Security
- [x] Password comparison menggunakan bcrypt.compare()
- [x] JWT signed dengan secret key (environment variable)
- [x] Refresh token httpOnly cookie dengan SameSite=Strict (Implementation ready)
- [x] Rate limiting: max 5 failed attempts per IP per 15 minutes
- [ ] Account lockout setelah 5 failed attempts dalam 10 minutes (Optional - not MVP)
- [x] No sensitive data dalam JWT payload (hanya userId, email, role)

### Non-Functional
- [x] API response time < 300ms (p95) (Verified locally)
- [x] Token validation middleware efficient (< 20ms overhead)
- [x] Concurrent logins dari device berbeda supported
- [x] Graceful handling untuk expired tokens

## Technical Tasks

### Backend (NestJS)
- [x] Implement `POST /api/auth/login` endpoint
- [x] Create JWT strategy dengan Passport.js
- [x] Setup JWT module dengan ConfigService
- [x] Implement `AuthGuard` untuk protected routes
- [x] Create `RefreshToken` strategy
- [x] Implement `POST /api/auth/refresh` endpoint
- [x] Implement `POST /api/auth/logout` endpoint
- [x] Add rate limiting untuk login endpoint
- [x] Create `@CurrentUser()` decorator untuk extract user dari request
- [x] Write unit tests untuk login flow (Completed in Sprint 1)
- [x] Write integration tests untuk token validation (Completed in Sprint 1)

### Frontend (React/Next.js)
- [x] Create `/login` page (Completed in Sprint 1)
- [x] Build `LoginForm` component dengan validation (Completed in Sprint 1)
- [x] Implement axios interceptor untuk auto token refresh (Phase 3)
- [x] Store access token di memory (context/zustand) (Phase 3 - Zustand)
- [x] Handle 401 errors dengan auto redirect ke login (Phase 3)
- [ ] Add "Remember Me" feature (optional)
- [x] Show loading state during authentication (Phase 3)
- [x] Redirect authenticated users dari login page ke dashboard (Phase 3)

### Database
- [x] Create `RefreshToken` table untuk tracking active sessions
- [x] Add index untuk efficient token lookup

## Technical Implementation Notes

### Database Schema (Prisma)
```prisma
model RefreshToken {
  id        String   @id @default(uuid())
  token     String   @unique
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  expiresAt DateTime
  createdAt DateTime @default(now())
  ipAddress String?
  userAgent String?
  
  @@index([userId])
  @@index([token])
}
```

### API Contract

**Login Request**:
```json
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "SecureP@ss123"
}
```

**Login Response (Success - 200)**:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-here",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "VIEWER",
    "organizationId": "org-uuid"
  }
}
```
*Note: Refresh token sent as httpOnly cookie*

**Refresh Token Request**:
```json
POST /api/auth/refresh
// No body needed, refresh token in cookie
```

**Refresh Token Response**:
```json
{
  "accessToken": "new-access-token-here"
}
```

**Logout Request**:
```json
POST /api/auth/logout
// No body needed
```

### JWT Payload Structure
```typescript
interface JwtPayload {
  sub: string;        // User ID
  email: string;
  role: UserRole;
  organizationId?: string;
  iat: number;        // Issued at
  exp: number;        // Expiration
}
```

### Login Service Implementation
```typescript
// auth.service.ts
async login(dto: LoginDto) {
  // Find user by email
  const user = await this.prisma.user.findUnique({
    where: { email: dto.email },
    include: { organization: true },
  });

  if (!user) {
    throw new UnauthorizedException('Invalid credentials');
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(
    dto.password,
    user.passwordHash
  );

  if (!isPasswordValid) {
    await this.logFailedAttempt(dto.email);
    throw new UnauthorizedException('Invalid credentials');
  }

  // Generate tokens
  const accessToken = this.generateAccessToken(user);
  const refreshToken = await this.generateRefreshToken(user);

  // Log successful login
  await this.auditService.log({
    userId: user.id,
    action: 'LOGIN',
    entityType: 'USER',
    entityId: user.id,
  });

  return {
    accessToken,
    refreshToken,
    user: this.sanitizeUser(user),
  };
}

private generateAccessToken(user: User): string {
  const payload: JwtPayload = {
    sub: user.id,
    email: user.email,
    role: user.role,
    organizationId: user.organizationId,
  };

  return this.jwtService.sign(payload, {
    expiresIn: '15m',
  });
}

private async generateRefreshToken(user: User): Promise<string> {
  const token = randomBytes(64).toString('hex');
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

  await this.prisma.refreshToken.create({
    data: {
      token,
      userId: user.id,
      expiresAt,
    },
  });

  return token;
}
```

### JWT Strategy Implementation
```typescript
// jwt.strategy.ts
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload) {
    // Optional: additional validation
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
      organizationId: payload.organizationId,
    };
  }
}
```

### Auth Guard Usage
```typescript
// Example protected controller
@Controller('projects')
export class ProjectsController {
  @UseGuards(JwtAuthGuard)  // Protected route
  @Get()
  async listProjects(@CurrentUser() user: UserFromJwt) {
    return this.projectsService.findByOrganization(user.organizationId);
  }
}
```

### Frontend Axios Interceptor
```typescript
// api/axios-instance.ts
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // Include cookies
});

// Request interceptor to add token
api.interceptors.request.use((config) => {
  const token = authStore.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and not already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh token
        const { data } = await axios.post('/api/auth/refresh');
        authStore.setAccessToken(data.accessToken);

        // Retry original request
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, redirect to login
        authStore.logout();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
```

## Dependencies

### Technical Dependencies
- @nestjs/jwt package installed
- @nestjs/passport package installed
- passport-jwt installed
- bcryptjs installed

### Story Dependencies
- **Depends on**: Story 1.1 (User Registration - User model must exist)

### Blocks
- Story 1.4 (User Management)
- Story 1.5 (Organization Creation)
- Story 1.8 (Project Creation - needs authentication)

## Testing Strategy

### Unit Tests
```typescript
describe('AuthService.login', () => {
  it('should return access token for valid credentials', async () => {
    const result = await authService.login(validLoginDto);
    
    expect(result.accessToken).toBeDefined();
    expect(result.user.id).toBe(mockUser.id);
    expect(result.user.passwordHash).toBeUndefined();
  });

  it('should throw UnauthorizedException for invalid password', async () => {
    const dto = { email: 'user@test.com', password: 'wrong' };
    
    await expect(authService.login(dto)).rejects.toThrow(
      UnauthorizedException
    );
  });

  it('should create refresh token in database', async () => {
    await authService.login(validLoginDto);
    
    const tokens = await prisma.refreshToken.findMany({
      where: { userId: mockUser.id },
    });
    
    expect(tokens.length).toBeGreaterThan(0);
  });
});
```

### Integration Tests
```typescript
describe('POST /api/auth/login', () => {
  it('should login successfully with valid credentials', async () => {
    const user = await createTestUser();
    
    const response = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: user.email, password: 'Test123!' })
      .expect(200);

    expect(response.body.accessToken).toBeDefined();
    expect(response.headers['set-cookie']).toBeDefined();
  });

  it('should enforce rate limiting after 5 failed attempts', async () => {
    for (let i = 0; i < 5; i++) {
      await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email: 'any@test.com', password: 'wrong' });
    }

    await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: 'any@test.com', password: 'wrong' })
      .expect(429); // Too Many Requests
  });
});
```

## Definition of Done

- [x] All acceptance criteria met
- [x] JWT authentication working dengan access + refresh token
- [x] Protected routes only accessible dengan valid token
- [x] Rate limiting implemented dan tested
- [ ] Frontend axios interceptor handles token refresh (Future Sprint)
- [x] Unit tests written dengan coverage ≥ 80%
- [x] Integration tests passed
- [x] Manual testing completed
- [x] Code reviewed dan approved
- [x] Swagger documentation updated

## Notes

### Security Considerations
- JWT secret harus strong dan stored di environment variables
- Consider rotating refresh tokens untuk additional security
- Implement device fingerprinting untuk suspicious login detection
- Log all login attempts untuk security monitoring

### Environment Variables Required
```bash
JWT_SECRET=your-super-secret-key-min-32-chars
JWT_EXPIRATION=15m
REFRESH_TOKEN_EXPIRATION=7d
```

---

**Created**: 2025-12-01  
**Created by**: SM Agent  
**Status**: 📋 Ready for Development
