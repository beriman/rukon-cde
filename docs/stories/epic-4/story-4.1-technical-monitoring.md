# Story 4.1: Technical Monitoring Dashboard

**Epic**: Epic 4 - Construction Monitoring & Document Control  
**Story ID**: `story-4.1`  
**Story Points**: 5  
**Priority**: P0 (Critical)  
**Sprint**: Sprint 13 (Weeks 25-26)

## User Story

**As a** Project Manager (Kontraktor/MK),  
**I want to** track technical progress per discipline (Structure, Architecture, MEP),  
**So that** I can identify delays and coordinate field execution effectively.

## Acceptance Criteria

### Functional
- [ ] **Dashboard**: Displays progress charts (Pie/Bar) for Structure, Architecture, and MEP
- [ ] **Status Tracking**: Elements tracked as `Not Started`, `In Progress`, `Completed`, `On Hold`
- [ ] **Drill-Down**: Click on a discipline to see detailed work packages (e.g., "Lantai 1 - Pengecoran")
- [ ] **Mobile Responsive**: Dashboard and input forms are optimized for mobile/tablet use on-site
- [ ] **Indonesian Context**: Terminology aligns with local standards (e.g., "Bobot Pekerjaan", "Prestasi Fisik")
- [ ] **Issue Linking**: Can link "Site Issues" (from Epic 5) to specific progress items

### Performance
- [ ] Dashboard loads in < 3 seconds with 10,000+ tracked elements
- [ ] **Optimization**: Use database indexing on `status` and `discipline` columns

## Technical Tasks

### Backend
- [ ] Create `WorkPackage` and `ProgressUpdate` models
- [ ] Implement `GET /api/monitoring/dashboard` with aggregated stats (using `GROUP BY`)

### Frontend
- [ ] Implement Dashboard UI using `Recharts` or `Nivo`
- [ ] Create "Update Progress" modal for field engineers

## Dependencies
- **Depends on**: Epic 6 (Schedule Integration - for "Planned" data)
