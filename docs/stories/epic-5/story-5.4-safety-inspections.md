# Story 5.4: Safety Inspections (Mobile Checklist)

**Epic**: Epic 5 - HSE Management & Safety Monitoring  
**Story ID**: `story-5.4`  
**Story Points**: 5  
**Priority**: P0 (Critical)  
**Sprint**: Sprint 17 (Weeks 33-34)

## User Story

**As a** Safety Inspector,  
**I want to** perform safety inspections using a mobile checklist,  
**So that** I can identify hazards directly on site without paper forms.

## Acceptance Criteria

### Functional
- [ ] **Checklist Library**: Configurable templates (e.g., Heavy Equipment, Scaffolding, Fire Extinguisher)
- [ ] **Execution**: Pass/Fail/NA for each item, with mandatory photo for "Fail"
- [ ] **Action Tracking**: Auto-create "Corrective Action" task for failed items
- [ ] **Mobile Support**: Fully functional offline (sync when online) with **Conflict Resolution** (Last Write Wins per field)
- [ ] **Indonesian Context**: Terminology: "Inspeksi K3", "Temuan (Finding)", "Tindak Lanjut"

### Performance
- [ ] Photo compression on client-side before upload (max 1MB per photo) to save bandwidth and storage

## Technical Tasks

### Backend
- [ ] Create `Inspection` and `ChecklistTemplate` models
- [ ] API for syncing offline data (handling conflicts)

### Frontend
- [ ] Mobile-first Inspection Runner
- [ ] Image annotation tool (draw circles on hazard photos)

## Dependencies
- **Depends on**: Epic 7 (Mobile App Foundation)
