# Story 2.12: Approval Review Process (Comment/Approve/Reject)

**Epic**: Epic 2 - ISO 19650-2 Strategic Planning & Delivery  
**Story ID**: `story-2.12`  
**Story Points**: 5  
**Priority**: P0 (Critical)  
**Sprint**: Sprint 9 (Weeks 17-18)

## User Story

**As a** Reviewer/Approver,  
**I want to** review files assigned to me, add comments, and make an Approve/Reject decision,  
**So that** the workflow can proceed or return to the author.

## Acceptance Criteria

### Functional
- [ ] User receives notification when a review is assigned
- [ ] User can view the file and metadata
- [ ] **Decision**: Approve, Reject, or "Approve with Comments"
- [ ] **Comments**: User must provide reason for Rejection
- [ ] **Batch Review**: User can approve multiple files at once
- [ ] System transitions file state based on workflow logic (Story 2.11)
- [ ] Audit trail logs the decision and comments

### UI/UX
- [ ] "My Reviews" dashboard widget
- [ ] Clear visual status indicators (Pending, Approved, Rejected)

## Technical Tasks

### Backend
- [ ] Implement `POST /api/workflows/:id/decisions`
- [ ] Logic to trigger next step or revert state
- [ ] Notification service integration (Email/In-app)

### Frontend
- [ ] Review Interface (File viewer + Decision panel)
- [ ] "My Tasks" list

## Dependencies
- **Depends on**: Story 2.11 (Workflow Config)
