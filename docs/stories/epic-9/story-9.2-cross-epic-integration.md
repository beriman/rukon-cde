# Story 9.2: Cross-Epic Integration Tests

**Epic**: Epic 9 - Integration & System Testing  
**Story ID**: `story-9.2`  
**Story Points**: 5  
**Priority**: P0 (Critical)  
**Sprint**: After Epic 4-8 completion

## User Story

**As a** QA Engineer,  
**I want to** test integration points between epics,  
**So that** data flows correctly across features.

## Acceptance Criteria

### Functional
- [ ] **Integration 1**: Epic 4 (Progress) → Epic 6 (S-Curve visualization)
- [ ] **Integration 2**: Epic 5 (Manhours) → Epic 4 (Attendance data)
- [ ] **Integration 3**: Epic 7 (AI RAG) → All epics (document indexing)
- [ ] **Integration 4**: Epic 8 (Audit Log) → All epics (action logging)
- [ ] **Data Consistency**: Verify data consistency across epic boundaries (e.g., Progress data = S-Curve data)
- [ ] **Coverage Target**: Test at least 80% of critical integration points from dependency maps
- [ ] **Real Environment**: Run integration tests against real database (test environment), not mocks

## Technical Tasks

### QA
- [ ] Write integration test suites for each integration point
- [ ] Implement API contract tests using Pact or similar
- [ ] Mock external dependencies where needed

## Dependencies
- **Depends on**: Epic 4-8 (Integration points exist)
