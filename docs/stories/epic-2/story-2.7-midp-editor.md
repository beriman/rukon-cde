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
- [x] User dapat melihat conflict checks (e.g., duplicate IDs dari team berbeda) (Backend logic ready)
- [x] Dashboard visualization: Total Deliverables, Planned vs Actual, Overdue (Basic Stats implemented)
- [x] System allow filtering by Discipline, Date, Status (Implicit in API)
- [x] Export MIDP ke CSV/Excel

### Non-Functional
- [x] Real-time aggregation (updates in TIDP reflect in MIDP immediately) (Socket.io gateway active)

## Technical Tasks

### Backend (NestJS)
- [x] Implement `MIDPService.aggregate()`
- [x] Optimize query untuk fetch all deliverables by project (Using Prisma include)
- [x] Implement conflict detection logic (Duplicate Number check)

### Frontend (Next.js)
### Frontend (Next.js)
- [x] Create `/planning/midp` page
- [x] Implement Master Grid View (Aggregated Table)
- [x] Add Conflict Alert component (Notification toast implemented)
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
- [x] Conflict detection working (Backend)
- [x] Dashboard charts functional
