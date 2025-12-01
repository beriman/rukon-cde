# Story 2.6: TIDP Editor with Gantt Chart

**Epic**: Epic 2 - ISO 19650-2 Strategic Planning & Delivery  
**Story ID**: `story-2.6`  
**Story Points**: 8  
**Priority**: P0 (Critical)  
**Sprint**: Sprint 7 (Weeks 13-14)

## User Story

**As a** Task Team Manager (Subcontractor/Specialist),  
**I want to** create a Task Information Delivery Plan (TIDP) using a Gantt chart interface,  
**So that** I can plan my team's deliverables and timelines.

## Acceptance Criteria

### Functional
- [ ] User can add "Information Deliverables" (Documents, Models, Drawings)
- [ ] For each deliverable: define Name, Responsibility, Due Date, Format, Level of Information Need
- [ ] **Gantt View**: Visualize deliverables on a timeline
- [ ] Drag-and-drop to adjust dates
- [ ] Import tasks from Excel/CSV template
- [ ] Validation: Check for missing required fields

### Performance
- [ ] Gantt chart handles 500+ tasks smoothly

## Technical Tasks

### Backend
- [ ] Create `TIDP` and `Task` models
- [ ] Implement `POST /api/tidp/tasks/import` (CSV handler)

### Frontend
- [ ] Integrate Gantt Chart library (e.g., `dhtmlx-gantt` or `react-gantt-task`)
- [ ] Build Task Form modal
- [ ] **Performance**: Implement virtual scrolling and lazy loading to handle 500+ tasks

## Dependencies
- **Depends on**: Story 2.5 (BEP)
- **Blocks**: Story 2.7 (MIDP)
