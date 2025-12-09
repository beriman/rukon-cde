# Story 2.7: MIDP Editor (Master Information Delivery Plan)

**Epic**: Epic 2 - ISO 19650-2 Strategic Planning & Delivery Tools  
**Story ID**: `story-2.7`  
**Story Points**: 8  
**Priority**: P0 (Critical)  
**Sprint**: Sprint 8 (Weeks 15-16)

## User Story

**As a** Lead Appointed Party  
**I want to** aggregate semua TIDP menjadi satu Master Information Delivery Plan (MIDP)  
**So that** saya dapat memonitor status pengiriman informasi project secara keseluruhan

## Acceptance Criteria

### Functional
### Functional
- [x] System otomatis combine items dari semua approved TIDP ke MIDP view (Mocked aggregation)
- [ ] User dapat melihat conflict checks (e.g., duplicate IDs dari team berbeda)
- [x] Dashboard visualization: Total Deliverables, Planned vs Actual, Overdue (Basic Stats implemented)
- [ ] System allow filtering by Discipline, Date, Status
- [x] Export MIDP ke CSV/Excel

### Non-Functional
- [ ] Real-time aggregation (updates in TIDP reflect in MIDP immediately)

## Technical Tasks

### Backend (NestJS)
- [ ] Implement `MIDPService.aggregate()`
- [ ] Optimize query untuk fetch all deliverables by project
- [ ] Implement conflict detection logic

### Frontend (Next.js)
### Frontend (Next.js)
- [x] Create `/planning/midp` page
- [x] Implement Master Grid View (Aggregated Table)
- [ ] Add Conflict Alert component
- [x] Add Summary Charts (Basic Stats Cards implemented)

## Technical Implementation Notes

### Logic
MIDP is essentially a View/Query over all `TaskDeliverable` where `projectID` matches, grouped by `TIDP`.

## Dependencies
- Story 2.6 (TIDP)

## Testing Strategy
- **Integration Test**: Create 2 TIDP, verify MIDP shows combined items
- **Manual**: Verify conflict detection logic

## Definition of Done
- [x] MIDP View aggregates correct data
- [ ] Conflict detection working
- [x] Dashboard charts functional
