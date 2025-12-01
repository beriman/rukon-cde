# Story 3.7: Clash Detection & BCF Export

**Epic**: Epic 3 - Design Collaboration Suite & Model Federation  
**Story ID**: `story-3.7`  
**Story Points**: 8  
**Priority**: P1 (High)  
**Sprint**: Sprint 12 (Weeks 23-24)

## User Story

**As a** BIM Coordinator,  
**I want to** run clash detection between models and export results as BCF,  
**So that** I can assign issues to relevant teams for resolution.

## Acceptance Criteria

### Functional
- [ ] **Clash Setup**: Define "Set A" (e.g., Structure) vs "Set B" (e.g., MEP)
- [ ] **Tolerance**: Set tolerance (e.g., ignore intersections < 10mm)
- [ ] **Run**: Execute clash check (geometric intersection)
- [ ] **Results**: List of clashes with ID and screenshot
- [ ] **Review**: Click clash -> Zoom to location + Highlight intersecting elements
- [ ] **Grouping**: Group clashes by object (e.g., one beam hitting 10 pipes = 1 group)
- [ ] **Export**: Export selected clashes to **BCF 2.1** (BIM Collaboration Format) zip file

### Performance
- [ ] Clash check runs in background or WebWorker (non-blocking)

## Technical Tasks

### Backend
- [ ] Implement BCF file generation (XML structure + Snapshots)

### Frontend
- [ ] Implement Clash Algorithm (AABB Tree + Triangle Intersection) or use library (e.g., `three-bvh-csg` or `web-ifc` collision)
- [ ] Clash Results UI panel

## Dependencies
- **Depends on**: Story 3.5 (Federation)
