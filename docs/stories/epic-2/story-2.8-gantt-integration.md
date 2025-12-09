# Story 2.8: Gantt Chart Integration for TIDP/MIDP

**Epic**: Epic 2 - ISO 19650-2 Strategic Planning & Delivery Tools  
**Story ID**: `story-2.8`  
**Story Points**: 13  
**Priority**: P1 (High)  
**Sprint**: Sprint 9 (Weeks 17-18)

## User Story

**As a** Project Manager  
**I want to** visualize TIDP and MIDP deliverables dalam bentuk Gantt Chart  
**So that** saya dapat melihat timeline pengiriman, dependencies, dan potential bottleneck

## Acceptance Criteria

### Functional
### Functional
- [x] TIDP/MIDP editor memiliki toggle view "Gantt" (Standalone page implemented for MVP)
- [x] Gantt chart menampilkan tasks berdasarkan Planned Date dan Duration
- [ ] User dapat resize timeframe (drag bars) untuk update dates secara otomatis (Deferred to Phase 4.5)
- [ ] Support dependencies (Finish-to-Start) antar deliverables
- [ ] Show Critical Path (optional highlighted)
- [ ] Import from MS Project (.mpp) or Primavera P6 (.xml)

### Non-Functional
- [ ] Smooth scrolling dan rendering untuk > 1000 tasks (Virtualization required)

## Technical Tasks

### Backend (NestJS)
- [x] Update `TaskDeliverable` model dengan `startDate`, `duration`, `dependencies`
- [ ] Create `ScheduleImportService` (parse MPP/XML)
- [ ] Implement Validation untuk circular dependencies

### Frontend (Next.js)
### Frontend (Next.js)
- [x] Integrate Gantt library (Implemented custom SVG/CSS for lightweight performance)
- [ ] Implement Drag-and-Drop update logic
- [ ] Build Import Wizard UI

## Technical Implementation Notes

### Gantt Library
Consider using a performant React Gantt component. If commercial license is an issue, build a lightweight SVG based one using `vis-timeline` or similar open source.

## Dependencies
- Story 2.6 & 2.7 (TIDP/MIDP Data)

## Testing Strategy
- **Performance**: Load testing with 2000 tasks
- **Unit Test**: Test dependency cycle detection
- **Manual**: Verify import from sample MS Project file

## Definition of Done
- [x] Gantt view operational
- [x] Date updates sync to database
- [ ] Import works for standard formats
