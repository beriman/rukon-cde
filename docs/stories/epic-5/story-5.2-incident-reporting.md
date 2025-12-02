# Story 5.2: Incident Reporting & Management

**Epic**: Epic 5 - HSE Management & Safety Monitoring  
**Story ID**: `story-5.2`  
**Story Points**: 5  
**Priority**: P0 (Critical)  
**Sprint**: Sprint 16 (Weeks 31-32)

## User Story

**As a** Safety Officer,  
**I want to** report incidents and near misses digitally,  
**So that** immediate action can be taken and data is recorded for analysis.

## Acceptance Criteria

### Functional
- [ ] **Report Form**: Capture Date, Time, Location, Description, Photos, Witnesses
- [ ] **Classification**: First Aid, Medical Treatment (MTI), Restricted Work (RWI), Lost Time (LTI), Fatality, Near Miss, Property Damage
- [ ] **Indonesian Context**: Support "Laporan Kecelakaan Kerja (Form KK2 BPJS)" format export
- [ ] **Notification**: Auto-alert Project Manager and HSE Manager for LTI/Fatality (via Email/Push)
- [ ] **Mobile Support**: Offline-capable form for reporting from remote sites
- [ ] **Performance**: Client-side image compression (max 1MB) before upload

### Security
- [ ] **Privacy**: Hide victim name/ID from general users (Only visible to HSE/HR)

## Technical Tasks

### Backend
- [ ] Create `Incident` model
- [ ] Implement Notification Service for high-severity alerts

### Frontend
- [ ] Incident Form with "Body Map" selector (click body part injured)
- [ ] Offline Sync logic (Service Worker)

## Dependencies
- **Depends on**: Epic 1 (File Upload)
