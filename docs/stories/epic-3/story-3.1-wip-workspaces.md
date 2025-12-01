# Story 3.1: WIP Privacy Workspaces

**Epic**: Epic 3 - Design Collaboration Suite & Model Federation  
**Story ID**: `story-3.1`  
**Story Points**: 5  
**Priority**: P0 (Critical)  
**Sprint**: Sprint 10 (Weeks 19-20)

## User Story

**As a** Discipline Lead (e.g., Lead Architect),  
**I want to** have a private WIP workspace for my team,  
**So that** we can iterate on designs without exposing unfinished work to other disciplines.

## Acceptance Criteria

### Functional
- [ ] System automatically creates WIP folders for each discipline defined in Project Settings (Arch, Struct, MEP)
- [ ] **Permissions**: Only users with specific Discipline Role (e.g., `ARCH_TEAM`) can view/edit their `WIP/Architecture` folder
- [ ] Project Admins can view all WIP folders
- [ ] **Promote to Shared**: User can select a file and "Share" it
- [ ] System copies file to `Shared` folder and increments version (e.g., P01.01 -> P02)
- [ ] Audit Log records who shared the file and when

### Security
- [ ] API ensures strict RBAC enforcement (prevent IDOR on folder access)

## Technical Tasks

### Backend
- [ ] Update `Folder` model to support `discipline` attribute
- [ ] Implement `DisciplineGuard` for folder access
- [ ] Implement `POST /api/files/:id/share` (Copy logic + Version bump)

### Frontend
- [ ] Project Browser: Filter/Hide folders based on user discipline
- [ ] "Share" Action in context menu

## Dependencies
- **Depends on**: Epic 1 (Folder Management, RBAC)
