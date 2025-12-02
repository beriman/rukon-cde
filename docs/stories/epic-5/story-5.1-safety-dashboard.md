# Story 5.1: Safety Dashboard (Manhours & LTI Rates)

**Epic**: Epic 5 - HSE Management & Safety Monitoring  
**Story ID**: `story-5.1`  
**Story Points**: 5  
**Priority**: P0 (Critical)  
**Sprint**: Sprint 16 (Weeks 31-32)

## User Story

**As a** HSE Manager,  
**I want to** view real-time safety performance metrics (Manhours, LTI),  
**So that** I can monitor compliance with SMK3 and ISO 45001 targets.

## Acceptance Criteria

### Functional
- [ ] **Manhours Tracking**: Auto-calculate Total Manhours based on daily attendance (from Epic 4 or manual input)
- [ ] **LTI Free Days**: Counter showing days since last Lost Time Injury
- [ ] **Incident Rates**: Calculate FR (Frequency Rate) and SR (Severity Rate) per 1,000,000 manhours (Standard Depnaker/OSHA)
- [ ] **Indonesian Context**: Terminology: "Jam Kerja Aman", "Nihil Kecelakaan (Zero Accident)", "Tingkat Kekerapan/Keparahan"
- [ ] **Trends**: Line chart showing Incident Rate vs Target over 12 months

### Performance
- [ ] Dashboard loads in < 2 seconds
- [ ] **Optimization**: Pre-calculate monthly stats in a separate table

## Technical Tasks

### Backend
- [ ] Create `SafetyStats` model (Monthly aggregation)
- [ ] Implement Scheduled Job (Nightly) to update Manhours from Attendance logs

### Frontend
- [ ] Safety Dashboard UI with "Green Cross" (Papan Skor K3) visualization

## Dependencies
- **Depends on**: Story 5.2 (Incident Data)
