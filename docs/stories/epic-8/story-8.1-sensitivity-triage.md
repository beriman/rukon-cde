# Story 8.1: Sensitivity Triage & Classification

**Epic**: Epic 8 - Security, Compliance & Lifecycle  
**Story ID**: `story-8.1`  
**Story Points**: 5  
**Priority**: P0 (Critical)  
**Sprint**: Sprint 27 (Weeks 53-54)

## User Story

**As a** Information Manager,  
**I want to** classify all uploaded documents by sensitivity level,  
**So that** access is automatically restricted based on classification.

## Acceptance Criteria

### Functional
- [ ] **Triage Prompt**: Upon file upload, user MUST select sensitivity level
- [ ] **Levels**: Public, Internal, Confidential, Highly Confidential
- [ ] **Auto-Permission**: Access auto-adjusted (e.g., "Confidential" = Project Team only)
- [ ] **Audit**: Classification decision logged
- [ ] **Indonesian Context**: Support "Terbatas" and "Rahasia" terminology
- [ ] **User Guidance**: In-app tutorial/guided tour for first-time classification

## Technical Tasks

### Backend
- [ ] Add `sensitivity` enum to File model
- [ ] Implement RBAC rules based on sensitivity

### Security Testing
- [ ] Penetration testing for access control bypass
- [ ] Verify cross-tenant data isolation

## Dependencies
- **Depends on**: Epic 1 (File Upload)
