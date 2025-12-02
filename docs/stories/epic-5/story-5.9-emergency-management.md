# Story 5.9: Emergency Management (Drills, Plans)

**Epic**: Epic 5 - HSE Management & Safety Monitoring  
**Story ID**: `story-5.9`  
**Story Points**: 3  
**Priority**: P2 (Medium)  
**Sprint**: Sprint 18 (Weeks 35-36)

## User Story

**As a** Emergency Response Team (ERT) Leader,  
**I want to** manage emergency plans and drill records,  
**So that** the project is prepared for actual emergencies.

## Acceptance Criteria

### Functional
- [ ] **Emergency Plan**: Upload and versioning of ERP (Emergency Response Plan)
- [ ] **Drill Log**: Record Drill Date, Type (Fire, Evacuation, Spill), Scenario, Evaluation
- [ ] **Contacts**: Manage list of Emergency Contacts (Hospital, Fire Dept, Police)
- [ ] **Indonesian Context**: "Tanggap Darurat" terminology
- [ ] **Broadcast**: (Nice to Have) SMS/Push Notification "SOS" button for site wide alert

## Technical Tasks

### Backend
- [ ] Create `EmergencyDrill` model

### Frontend
- [ ] Emergency Dashboard (Quick access to contacts and plans)

## Dependencies
- **Depends on**: Story 5.7 (Docs)
