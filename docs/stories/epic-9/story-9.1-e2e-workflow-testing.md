# Story 9.1: E2E Workflow Testing

**Epic**: Epic 9 - Integration & System Testing  
**Story ID**: `story-9.1`  
**Story Points**: 8  
**Priority**: P0 (Critical)  
**Sprint**: After Epic 4-8 completion

## User Story

**As a** QA Engineer,  
**I want to** test complete workflows across multiple epics,  
**So that** I can verify end-to-end functionality works correctly.

## Acceptance Criteria

### Functional
- [ ] **Workflow 1**: BQ Import (Epic 4) → Progress Update → Payment Claim → Report (Epic 7)
- [ ] **Workflow 2**: Shop Drawing Upload → Approval (Epic 4) → As-built → AIM Handover (Epic 8)
- [ ] **Workflow 3**: Incident Report (Epic 5) → Investigation → BCF Issue (Epic 6) → Risk Register (Epic 8)
- [ ] **Negative Scenarios**: Test workflow failures (e.g., payment rejected, approval denied, BCF creation fails)
- [ ] **Automation**: Playwright or Cypress E2E tests
- [ ] **Maintainability**: Use data-testid attributes for all interactive elements
- [ ] **Maintainability**: Implement Page Object Pattern for test structure
- [ ] **Reporting**: Integrate with test reporting tool (Allure or TestRail)

## Technical Tasks

### QA
- [ ] Write E2E test scripts for 3 critical workflows
- [ ] Write negative scenario tests for each workflow
- [ ] Setup test data fixtures/factories for complex workflows
- [ ] Integrate E2E tests into CI pipeline
- [ ] Setup test reporting (Allure/TestRail)

## Dependencies
- **Depends on**: Epic 4, 5, 6, 7, 8 (Features complete)
