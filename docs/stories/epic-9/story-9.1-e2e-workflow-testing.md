# Story 9.1: E2E Workflow Testing

**Epic**: Epic 9: Integration & System Testing
**Status**: Done
**Priority**: Critical
**Estimation**: 8 Points

## User Story
**As a** QA Engineer,
**I want to** run automated E2E tests for critical workflows,
**So that** I can verify the platform works correctly end-to-end.

## Acceptance Criteria
- [x] BQ → Progress → Payment workflow tested
- [x] Approval → As-Built → Handover workflow tested
- [x] Incident → BCF → Risk workflow tested
- [x] Tests use Page Object pattern
- [x] Tests run on multiple browsers (Chromium, Firefox)
- [x] Test reports generated (HTML, JSON)

## Technical Tasks
- [x] **Setup**: Playwright configuration
- [x] **Pages**: BasePage with common utilities
- [x] **Pages**: LoginPage with role-based login
- [x] **Tests**: workflow-bq-progress-payment.spec.ts
- [x] **Tests**: workflow-approval-asbuilt-handover.spec.ts
- [x] **Tests**: workflow-incident-bcf-risk.spec.ts

## Files Created
- `apps/web/playwright.config.ts`
- `apps/web/tests/e2e/pages/BasePage.ts`
- `apps/web/tests/e2e/pages/LoginPage.ts`
- `apps/web/tests/e2e/workflow-bq-progress-payment.spec.ts`
- `apps/web/tests/e2e/workflow-approval-asbuilt-handover.spec.ts`
- `apps/web/tests/e2e/workflow-incident-bcf-risk.spec.ts`

## Run Tests
```bash
cd apps/web
npx playwright install
npx playwright test
```
