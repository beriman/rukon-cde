# Directive: Testing Strategy

**ID**: DIR-008  
**Layer**: Directive (What to do)  
**Trigger**: Testing phase of story implementation

## 1. Objective
Achieve ≥80% test coverage dengan quality tests yang actually catch bugs.

## 2. Testing Pyramid

```
       /\
      /E2E\        <- Few (Critical user flows)
     /------\
    /Integration\  <- Some (API + DB)
   /------------\
  /  Unit Tests  \ <- Many (Business logic)
 /----------------\
```

## 3. Unit Tests

**What to test**:
- Services (business logic)
- Utilities
- Validators
- Pure functions

**Example**:
```typescript
describe('UserService', () => {
  it('should enforce multi-tenancy', async () => {
    const orgAdmin = { organizationId: 'org1', role: 'ORG_ADMIN' };
    const users = await service.findAll(orgAdmin, {});
    
    expect(users.every(u => u.organizationId === 'org1')).toBe(true);
  });
});
```

## 4. Integration Tests

**What to test**:
- API endpoints
- Database operations
- Authentication flow
- RBAC enforcement

**Example**:
```typescript
describe('Users API', () => {
  it('should prevent cross-org access', async () => {
    const response = await request(app)
      .get('/api/users/user-from-org2')
      .set('Authorization', `Bearer ${org1AdminToken}`);
    
    expect(response.status).toBe(403);
  });
});
```

## 5. E2E Tests

**What to test**:
- Critical user journeys
- Multi-step workflows
- UI interactions

**Tools**: Playwright, Cypress

## 6. Coverage Target

- Overall: ≥80%
- Services: ≥90%
- Controllers: ≥80%
- Components: ≥70%

## 7. Best Practices

✅ **DO**:
- Test behavior, not implementation
- Test edge cases
- Test error scenarios
- Use descriptive test names
- Arrange-Act-Assert pattern
- Mock external dependencies

❌ **DON'T**:
- Test framework code
- Test getters/setters only
- Skip error cases
- Write flaky tests
- Have test interdependencies
