# Test Design: Story 4.1 (Technical Monitoring Dashboard)

**Date**: 2025-12-09
**Assessor**: BMad QA Agent (Simulated)

## Test Strategy
- **Level**: Unit (Service/Controller), Integration (API), E2E (Critical Path).
- **Focus**: Data integrity of progress updates and correct aggregation.

## Test Scenarios

### 1. Functional Tests (API/Integration)
- **TC-4.1-001**: Submit valid progress update (0 -> 50%). Expect 201 Created and history entry.
- **TC-4.1-002**: Submit invalid progress (>100% or <0%). Expect 400 Bad Request.
- **TC-4.1-003**: Submit progress for non-existent Work Package. Expect 404 Not Found.
- **TC-4.1-004**: Retrieve progress history. Expect list sorted by date desc.
- **TC-4.1-005**: Dashboard aggregation. Create 2 packages (50%, 100%). Expect project average to be 75% (if equal weight).

### 2. UI/UX Tests (E2E/Manual)
- **TC-4.1-006**: Verify Discipline Selector filters the package list.
- **TC-4.1-007**: Verify file attachment works (photo upload).
- **TC-4.1-008**: Verify "S-Curve" (or progress chart) renders without crashing on empty data.

### 3. Security Tests
- **TC-4.1-009**: User with unrelated role cannot update progress.
- **TC-4.1-010**: User from different Organization cannot access Project data.

## Test Data Requirements
- **Seed Data**:
    - 1 Project
    - 3 Disciplines (Struct, Arch, MEP)
    - 5 Work Packages per discipline
    - 1 User (Contractor), 1 User (Owner)
