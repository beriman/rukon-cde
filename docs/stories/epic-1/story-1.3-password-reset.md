# Story 1.3: Password Reset & Recovery

**Epic**: Epic 1 - Core CDE Foundation & Multi-Tenancy  
**Story ID**: `story-1.3`  
**Story Points**: 3  
**Priority**: P1 (High)  
**Sprint**: Sprint 2 (Weeks 3-4)

## User Story

**As a** user yang lupa password  
**I want to** reset password saya melalui email  
**So that** saya dapat kembali mengakses akun tanpa harus contact admin

## Acceptance Criteria

### Functional
- [ ] User dapat request password reset dari login page
- [ ] System mengirim email berisi reset link ke email terdaftar
- [ ] Reset link valid selama 1 jam
- [ ] User klik link dan diarahkan ke halaman reset password
- [ ] Halaman reset password meminta password baru dan confirmation
- [ ] Password baru harus meet security requirements (sama seperti registration)
- [ ] Setelah reset sukses, user redirect ke login dengan success message
- [ ] Old password tidak boleh sama dengan new password
- [ ] Reset token becomes invalid setelah digunakan
- [ ] Reset token becomes invalid jika user request reset baru

### Security
- [ ] Reset token cryptographically secure (crypto.randomBytes)
- [ ] Token stored hashed di database
- [ ] Rate limiting: max 3 reset requests per email per hour
- [ ] Email tidak reveal apakah email exists (privacy protection)
- [ ] New password hashed dengan bcrypt sebelum disimpan

### Non-Functional
- [ ] Email delivery < 30 seconds
- [ ] Reset page loads dengan valid token
- [ ] Clear error messages untuk expired/invalid tokens

## Technical Tasks

### Backend (NestJS)
- [ ] Create `PasswordReset` model di Prisma schema
- [ ] Implement `POST /api/auth/forgot-password` endpoint
- [ ] Implement `POST /api/auth/reset-password` endpoint
- [ ] Implement `GET /api/auth/verify-reset-token/:token` endpoint
- [ ] Integrate email service (NodeMailer / SendGrid)
- [ ] Create email templates untuk reset password
- [ ] Generate secure reset tokens
- [ ] Add token expiration logic
- [ ] Invalidate old tokens when new request made
- [ ] Add rate limiting untuk forgot password endpoint
- [ ] Write unit tests
- [ ] Write integration tests

### Frontend
- [ ] Create `/forgot-password` page
- [ ] Create `/reset-password/[token]` page
- [ ] Build `ForgotPasswordForm` component
- [ ] Build `ResetPasswordForm` component
- [ ] Handle token validation on page load
- [ ] Show friendly errors untuk expired/invalid tokens
- [ ] Add password strength indicator
- [ ] Redirect ke login after successful reset

### Database
- [ ] Add `PasswordReset` table dengan migrations
- [ ] Add indexes untuk efficient token lookup
- [ ] Add cleanup job untuk expired tokens (optional)

## Technical Implementation Notes

### Database Schema (Prisma)
```prisma
model PasswordReset {
  id        String   @id @default(uuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  token     String   @unique
  expiresAt DateTime
  used      Boolean  @default(false)
  createdAt DateTime @default(now())
  
  @@index([userId])
  @@index([token])
}
```

### API Contract

**Forgot Password Request**:
```json
POST /api/auth/forgot-password
{
  "email": "user@example.com"
}
```

**Response (Always 200 for security)**:
```json
{
  "message": "If the email exists, you will receive a reset link shortly."
}
```

**Reset Password Request**:
```json
POST /api/auth/reset-password
{
  "token": "secure-token-here",
  "newPassword": "NewSecureP@ss123",
  "confirmPassword": "NewSecureP@ss123"
}
```

**Response (Success)**:
```json
{
  "message": "Password has been reset successfully."
}
```

### Implementation
```typescript
// auth.service.ts
async requestPasswordReset(email: string) {
  const user = await this.prisma.user.findUnique({
    where: { email },
  });

  // Always return success untuk security (don't reveal if email exists)
  if (!user) {
    return { message: 'If the email exists, you will receive a reset link.' };
  }

  // Invalidate previous tokens
  await this.prisma.passwordReset.updateMany({
    where: {
      userId: user.id,
      used: false,
      expiresAt: { gt: new Date() },
    },
    data: { used: true },
  });

  // Generate secure token
  const token = randomBytes(32).toString('hex');
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 1); // 1 hour

  await this.prisma.passwordReset.create({
    data: {
      userId: user.id,
      token,
      expiresAt,
    },
  });

  // Send email
  const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;
  await this.emailService.sendPasswordReset(user.email, resetLink);

  return { message: 'If the email exists, you will receive a reset link.' };
}

async resetPassword(token: string, newPassword: string, confirmPassword: string) {
  if (newPassword !== confirmPassword) {
    throw new BadRequestException('Passwords do not match');
  }

  const resetRecord = await this.prisma.passwordReset.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!resetRecord || resetRecord.used) {
    throw new BadRequestException('Invalid or expired reset token');
  }

  if (new Date() > resetRecord.expiresAt) {
    throw new BadRequestException('Reset token has expired');
  }

  // Check if new password same as old password
  const isSameAsOld = await bcrypt.compare(
    newPassword,
    resetRecord.user.passwordHash
  );

  if (isSameAsOld) {
    throw new BadRequestException('New password must be different from old password');
  }

  // Hash new password
  const passwordHash = await bcrypt.hash(newPassword, 10);

  // Update password
  await this.prisma.user.update({
    where: { id: resetRecord.userId },
    data: { passwordHash },
  });

  // Mark token as used
  await this.prisma.passwordReset.update({
    where: { id: resetRecord.id },
    data: { used: true },
  });

  // Log audit
  await this.auditService.log({
    userId: resetRecord.userId,
    action: 'PASSWORD_RESET',
    entityType: 'USER',
    entityId: resetRecord.userId,
  });

  return { message: 'Password has been reset successfully' };
}
```

### Email Template
```html
<!-- reset-password.template.html -->
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; }
    .button {
      background-color: #4CAF50;
      color: white;
      padding: 14px 20px;
      text-decoration: none;
      display: inline-block;
    }
  </style>
</head>
<body>
  <h2>Password Reset Request</h2>
  <p>You requested to reset your password for Rukon CDE.</p>
  <p>Click the button below to reset your password:</p>
  <a href="{{resetLink}}" class="button">Reset Password</a>
  <p>This link will expire in 1 hour.</p>
  <p>If you didn't request this, please ignore this email.</p>
</body>
</html>
```

## Dependencies

### Technical Dependencies
- Email service configured (NodeMailer atau SendGrid)
- SMTP credentials atau SendGrid API key

### Story Dependencies
- **Depends on**: Story 1.1 (User model must exist)

### Blocks
- None (independent feature)

## Testing Strategy

### Unit Tests
```typescript
describe('AuthService.requestPasswordReset', () => {
  it('should create password reset token', async () => {
    await authService.requestPasswordReset(mockUser.email);
    
    const token = await prisma.passwordReset.findFirst({
      where: { userId: mockUser.id },
    });
    
    expect(token).toBeDefined();
    expect(token.expiresAt).toBeInstanceOf(Date);
  });

  it('should not reveal if email does not exist', async () => {
    const result = await authService.requestPasswordReset('nonexistent@test.com');
    
    expect(result.message).toBe('If the email exists, you will receive a reset link.');
  });
});

describe('AuthService.resetPassword', () => {
  it('should update password with valid token', async () => {
    const token = await createResetToken(mockUser.id);
    
    await authService.resetPassword(token, 'NewPassword123!', 'NewPassword123!');
    
    const user = await prisma.user.findUnique({ where: { id: mockUser.id } });
    const isValid = await bcrypt.compare('NewPassword123!', user.passwordHash);
    expect(isValid).toBe(true);
  });

  it('should reject expired token', async () => {
    const expiredToken = await createExpiredResetToken(mockUser.id);
    
    await expect(
      authService.resetPassword(expiredToken, 'NewPass123!', 'NewPass123!')
    ).rejects.toThrow('Reset token has expired');
  });
});
```

## Definition of Done

- [ ] All acceptance criteria met
- [ ] Password reset flow working end-to-end
- [ ] Email delivery confirmed (test environment)
- [ ] Token expiration working correctly
- [ ] Security measures implemented (rate limiting, secure tokens)
- [ ] Unit tests ≥ 80% coverage
- [ ] Integration tests passed
- [ ] Manual testing completed
- [ ] Code reviewed
- [ ] Documentation updated

## Notes

### Environment Variables Required
```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
FRONTEND_URL=http://localhost:3000
```

### Future Enhancements
- Multi-language email templates
- SMS-based password reset option
- Security questions as additional verification
- Password reset history tracking

---

**Created**: 2025-12-01  
**Created by**: SM Agent  
**Status**: 📋 Ready for Development
