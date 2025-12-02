# Story 8.8: Risk Register

**Epic**: Epic 8 - Security, Compliance & Lifecycle  
**Story ID**: `story-8.8`  
**Story Points**: 5  
**Priority**: P1 (High)  
**Sprint**: Sprint 29 (Weeks 57-58)

## User Story

**As a** Safety Manager,  
**I want to** maintain a register of project risks,  
**So that** mitigation measures are tracked.

## Acceptance Criteria

### Functional
- [ ] **Risk Database**: Record risks with Severity (Low/Med/High), Category (Safety/Schedule/Cost/Quality)
- [ ] **3D Linking**: Link risks to model locations (e.g., "Confined Space at B1")
- [ ] **Mitigation**: Track mitigation actions and responsible parties
- [ ] **Mobile Access**: Accessible via mobile app for field teams

## Technical Tasks

### Backend
- [ ] Implement `Risk` model with geolocation

## Dependencies
- **Depends on**: Epic 6 (3D Viewer)
