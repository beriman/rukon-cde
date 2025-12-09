# Story 3.1: Discipline Workspaces (WIP Isolation)

**Epic**: Epic 3 - Design Collaboration Suite
**Story ID**: `story-3.1`
**Story Points**: 5
**Priority**: P1 (High)

## User Story

**As a** Information Manager
**I want to** setup dedicated Workspaces for each discipline (Architecture, Structure, MEP) with strict permissions
**So that** teams can work in WIP (Work In Progress) without exposing unfinished data to other teams.

## Acceptance Criteria

### Functional
- [x] Project creation automatically generates `WIP_ARCH`, `WIP_STRUCT`, `WIP_MEP` folders.
- [x] Users assigned to "Structure" role generally CANNOT view `WIP_ARCH` content.
- [x] Users CAN view their own discipline's WIP.
- [x] Admin/IM can view ALL WIP folders.

### Technical
- [x] Extend `Folder` model or `Permission` logic to support "Discipline-Restricted" access.
- [x] Middleware/Guard to check User Discipline vs Folder Discipline.

## Verification Plan
- **Test**: Create User A (Arch) and User B (Struct). User A uploads to WIP_ARCH. User B tries to list WIP_ARCH (Should fail/empty). User B uploads to WIP_STRUCT (Success).
