# Story 2.7: MIDP Aggregation & Master Schedule

**Epic**: Epic 2 - ISO 19650-2 Strategic Planning & Delivery  
**Story ID**: `story-2.7`  
**Story Points**: 5  
**Priority**: P0 (Critical)  
**Sprint**: Sprint 7 (Weeks 13-14)

## User Story

**As a** Lead Appointed Party,  
**I want to** aggregate all TIDPs into a Master Information Delivery Plan (MIDP),  
**So that** I can view the overall project delivery schedule and identify clashes.

## Acceptance Criteria

### Functional
- [ ] System automatically aggregates approved TIDPs into MIDP
- [ ] Master Gantt View showing all teams' deliverables
- [ ] Filter by Team, Discipline, Status
- [ ] **Clash Detection**: Highlight deliverables with conflicting dates or dependencies
- [ ] Export MIDP to MS Project (XML) or Excel
- [ ] Baseline comparison (Planned vs Actual)

## Technical Tasks

### Backend
- [ ] Implement Aggregation Logic (Query all TIDP tasks)
- [ ] Implement Export service (MS Project XML format)

### Frontend
- [ ] Master Gantt View (read-only or high-level adjustment)
- [ ] Dashboard showing delivery status (On Time, Delayed)

## Dependencies
- **Depends on**: Story 2.6 (TIDP)
