# Story 6.3: Smart Review & Change Analysis (2D/3D Diff)

**Epic**: Epic 6 - Advanced BIM Simulation  
**Story ID**: `story-6.3`  
**Story Points**: 8  
**Priority**: P1 (High)  
**Sprint**: Sprint 19 (Weeks 37-38)

## User Story

**As a** Lead Architect,  
**I want to** compare two versions of a drawing or model,  
**So that** I can instantly see what has changed (Added, Removed, Modified).

## Acceptance Criteria

### Functional
- [ ] **2D Diff**: Overlay PDF/DWG with color coding (Red = Old/Deleted, Green = New/Added)
- [ ] **3D Diff**: Compare two IFC versions
  - **Added**: Highlight Green
  - **Removed**: Highlight Red
  - **Modified**: Highlight Yellow (Geometry or Property change)
- [ ] **Slider Mode**: "Swipe" between Version A and Version B
- [ ] **Report**: Export "Change Log" PDF listing modified Element IDs

### Performance
- [ ] 3D Comparison calculation runs in background for large models (>50MB)

## Technical Tasks

### Backend
- [ ] Implement `IfcDiff` service (compare GUIDs and **Geometry Hashes** to detect modified geometry even if GUID persists)

### Frontend
- [ ] Split-screen comparison viewer
- [ ] PDF.js overlay logic for 2D diff

## Dependencies
- **Depends on**: Story 6.1 (Viewer)
