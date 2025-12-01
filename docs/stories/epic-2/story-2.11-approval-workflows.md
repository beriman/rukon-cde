# Story 2.11: Configurable Approval Workflows (Gateways)

**Epic**: Epic 2 - ISO 19650-2 Strategic Planning & Delivery  
**Story ID**: `story-2.11`  
**Story Points**: 8  
**Priority**: P0 (Critical)  
**Sprint**: Sprint 9 (Weeks 17-18)

## User Story

**As a** Project Admin,  
**I want to** configure approval workflows for CDE state transitions (e.g., WIP -> Shared),  
**So that** I can enforce quality control gateways appropriate for the project scale.

## Acceptance Criteria

### Functional
- [ ] User can define workflows for specific transitions:
  - WIP -> Shared (Review)
  - Shared -> Published (Approval)
- [ ] **Steps Configuration**: Define sequential or parallel steps (e.g., Step 1: Arch Review -> Step 2: Lead Review)
- [ ] **Approver Assignment**: Assign specific Users or Roles (e.g., "All Lead Architects")
- [ ] **Logic**: Define "All must approve" vs "Any one can approve"
- [ ] Workflows can be applied to specific folders or file types

### Technical
- [ ] Workflow engine stores state machine definition
- [ ] Validation prevents deadlocks (e.g., assigning to no one)

## Technical Tasks

### Backend
- [ ] Create `Workflow` and `WorkflowStep` models
- [ ] Implement Workflow Engine (State Machine) with **robust error handling** (e.g., handling deleted users)
- [ ] **Safety**: Implement Deadlock Prevention logic (validate that every step has at least one valid assignee)
- [ ] API to CRUD workflows

### Frontend
- [ ] Visual Workflow Editor (Drag-and-drop steps)
- [ ] Configuration form for approvers and logic

## Dependencies
- **Depends on**: Epic 1 (CDE States)
- **Blocks**: Story 2.12 (Execution)
