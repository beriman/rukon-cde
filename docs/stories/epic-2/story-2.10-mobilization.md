# Story 2.10: Team Mobilization & Capability Assessment

**Epic**: Epic 2 - ISO 19650-2 Strategic Planning & Delivery  
**Story ID**: `story-2.10`  
**Story Points**: 3  
**Priority**: P2 (Medium)  
**Sprint**: Sprint 8 (Weeks 15-16)

## User Story

**As a** Lead Appointed Party,  
**I want to** manage team mobilization and capability assessments,  
**So that** I can confirm all task teams are ready before starting work.

## Acceptance Criteria

### Functional
- [ ] User can create Mobilization Checklist (e.g., IT Setup, Training, Access)
- [ ] User can send Capability Assessment forms to Task Teams
- [ ] Task Teams can submit assessment responses (IT capacity, BIM experience)
- [ ] Dashboard showing "Mobilization Status" per team (Ready / Pending)
- [ ] Block access to WIP folders until Mobilization is "Complete" (Optional config)
- [ ] **Flexibility**: Admin can "Bypass" mobilization requirements for specific teams or small projects

## Technical Tasks

### Backend
- [ ] Create `Mobilization` and `Assessment` models
- [ ] Implement logic to track status

### Frontend
- [ ] Mobilization Dashboard
- [ ] Assessment Form Builder (simple questionnaire)

## Dependencies
- **Depends on**: Story 2.5 (BEP - defines teams)
