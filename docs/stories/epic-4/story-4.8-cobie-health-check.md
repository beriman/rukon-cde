# Story 4.8: COBie Health Check & Validation

**Epic**: Epic 4 - Construction Monitoring & Document Control  
**Story ID**: `story-4.8`  
**Story Points**: 8  
**Priority**: P2 (Medium)  
**Sprint**: Sprint 15 (Weeks 29-30)

## User Story

**As a** BIM Manager,  
**I want to** validate the BIM model against COBie requirements,  
**So that** the handover data is complete and compliant with ISO 19650-3.

## Acceptance Criteria

### Functional
- [ ] **Dashboard**: Shows % Completion for COBie sheets (Facility, Floor, Space, Zone, Type, Component)
- [ ] **Validation Rules**:
  - "All Doors must have FireRating"
  - "All Equipment must have SerialNumber"
  - "Space names must be unique"
- [ ] **Drill-Down**: Click "Failed" items to see list of Element IDs
- [ ] **Export**: Export COBie Excel spreadsheet

### Performance
- [ ] Validation runs in background for models > 100MB
- [ ] **Optimization**: Use `sqlite` or in-memory database for fast validation queries

## Technical Tasks

### Backend
- [ ] Implement COBie parser/validator (using `xlsx` or `exceljs`)
- [ ] Create Validation Rule Engine (JSON-based config)

### Frontend
- [ ] COBie Health Dashboard (Red/Green indicators)
- [ ] Element ID link to 3D Viewer (Epic 3)

## Dependencies
- **Depends on**: Epic 3 (Model Management)
