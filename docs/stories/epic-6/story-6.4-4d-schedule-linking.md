# Story 6.4: 4D Schedule Linking (Time + Model)

**Epic**: Epic 6 - Advanced BIM Simulation  
**Story ID**: `story-6.4`  
**Story Points**: 8  
**Priority**: P0 (Critical)  
**Sprint**: Sprint 20 (Weeks 39-40)

## User Story

**As a** Planner,  
**I want to** link schedule tasks to 3D model elements,  
**So that** I can visualize the construction sequence.

## Acceptance Criteria

### Functional
- [ ] **Import**: Support **MS Project XML** and **Primavera P6 XML** (Primary), CSV (Secondary), and `.mpp` (Experimental/Low Priority)
- [ ] **Mapping**: Drag-and-drop linking of Tasks to IFC Elements (1-to-Many)
- [ ] **Auto-Link**: Rule-based linking (e.g., "If Task Name contains 'Column L1', link to Columns on Storey 1")
- [ ] **Indonesian Context**: Support "Kurva S" data structure (Planned Start/Finish)

### Data
- [ ] Store mappings in `ElementTaskLink` table (TaskID <-> IFC GUID)

## Technical Tasks

### Backend
- [ ] Implement Schedule Parsers (`node-mpp`, `xml-js`)
- [ ] Create `Schedule` and `Task` models

### Frontend
- [ ] Split view: Gantt Chart (left) + 3D Viewer (right)
- [ ] Linking interaction (Selection in 3D -> Assign to Task)

## Dependencies
- **Depends on**: Epic 6.1 (Viewer)
