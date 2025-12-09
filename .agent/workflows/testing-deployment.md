---
description: Comprehensive testing and deployment workflow
---

# Testing & Deployment Workflow

// turbo-all

## Phase 1: Pre-Testing Setup

1. Ensure all dependencies installed
```bash
npm install
```

2. Verify environment configuration
```bash
cat .env
```

3. Check database connection
```bash
npx prisma db push --preview-feature
```

## Phase 2: Unit Testing

4. Run all unit tests
```bash
npm run test:api
npm run test:web
```

5. Check test results
   - All tests passing?
   - Any flaky tests?
   - Any skipped tests?

6. Generate coverage report
```bash
npm run test:coverage
```

7. Verify coverage ≥ 80%

## Phase 3: Integration Testing

8. Run integration tests
```bash
npm run test:integration
```

9. Run API endpoint tests
```bash
python execution/api_endpoint_tester.py --env dev
```

10. Test RBAC enforcement
    - Test as different user roles
    - Verify permissions work correctly
    - Test multi-tenancy isolation

## Phase 4: Code Quality

11. Run linting
```bash
npm run lint
```

12. Run code quality checker
```bash
python execution/code_quality_checker.py apps/
```

13. Check for security vulnerabilities
```bash
npm audit
```

14. Fix any critical/high issues

## Phase 5: Build Verification

15. Build production bundle
```bash
npm run build
```

16. Verify build completed successfully

17. Check build output size

18. Test production build locally
```bash
npm run start
```

## Phase 6: Pre-Deployment Validation

19. Run deployment validator
```bash
python execution/deployment_validator.py --env staging
```

20. Check deployment prerequisites:
    - ✅ All tests passing
    - ✅ Code quality ≥ 85
    - ✅ No security vulnerabilities
    - ✅ Build successful
    - ✅ Environment variables set
    - ✅ Database migrations ready

## Phase 7: Deployment (Staging)

21. Deploy to staging environment
```bash
# This depends on your deployment setup
# Example for Docker:
docker-compose -f docker-compose.staging.yml up -d
```

22. Wait for deployment to complete

23. Run health check
```bash
python execution/deployment_validator.py --health-check --env staging
```

## Phase 8: Smoke Testing

24. Test critical user paths in staging:
    - User registration
    - User login
    - Core feature workflows
    - API endpoints

25. Verify database migrations applied
```bash
npx prisma migrate status --schema apps/api/prisma/schema.prisma
```

26. Check application logs untuk errors
```bash
docker-compose -f docker-compose.staging.yml logs --tail=100
```

## Phase 9: Production Deployment (Manual Approval Required)

27. **STOP HERE** - Request user approval untuk production deployment

28. After user approval, deploy to production
```bash
# Production deployment command
# Example:
docker-compose -f docker-compose.prod.yml up -d
```

29. Monitor deployment
    - Watch logs
    - Check health endpoints
    - Monitor error rates

30. Run post-deployment validation
```bash
python execution/deployment_validator.py --health-check --env production
```

## Phase 10: Post-Deployment

31. Verify all services running

32. Test critical paths in production

33. Monitor for errors (first 15 minutes)

34. Document deployment
    - Timestamp
    - Version deployed
    - Issues encountered
    - Resolution steps

## Rollback Procedure

**If deployment fails or critical issues found**:

1. Stop current deployment
```bash
docker-compose down
```

2. Revert to previous version
```bash
git checkout {previous_version}
docker-compose up -d
```

3. Revert database migrations if needed
```bash
npx prisma migrate reset
```

4. Notify user about rollback

5. Investigate root cause

6. Fix issues

7. Re-run testing workflow before re-deploying

## Exit Criteria

- ✅ All tests passing (unit, integration)
- ✅ Code quality ≥ 85
- ✅ Build successful
- ✅ Staging deployment successful
- ✅ Smoke tests passing
- ✅ Production deployed (after user approval)
- ✅ Post-deployment validation passed

## Error Handling

**Test failures**:
1. Identify failing tests
2. Trigger error recovery workflow
3. Fix issues
4. Re-run tests (goto Phase 2)

**Build failures**:
1. Read build error logs
2. Check for:
   - TypeScript errors
   - Missing dependencies
   - Configuration issues
3. Fix and rebuild (goto Phase 5)

**Deployment failures**:
1. Read deployment logs
2. Check for:
   - Environment config issues
   - Database connection problems
   - Service startup failures
3. Fix issues
4. Attempt deployment again
5. If fails 3 times, rollback and escalate to user
