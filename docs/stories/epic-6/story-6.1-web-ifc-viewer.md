# Story 6.1: Web IFC Viewer (Open BIM)

**Epic**: Epic 6 - Advanced BIM Simulation  
**Story ID**: `story-6.1`  
**Story Points**: 8  
**Priority**: P0 (Critical)  
**Sprint**: Sprint 19 (Weeks 37-38)

## User Story

**As a** BIM Coordinator,  
**I want to** view IFC models directly in the web browser without installing software,  
**So that** all stakeholders (including non-BIM users) can visualize the design.

## Acceptance Criteria

### Functional
- [ ] **Loader**: Load `.ifc` files (IFC2x3, IFC4)
- [ ] **Navigation**: Orbit, Pan, Zoom, **First Person Walk Mode** (WASD + Mouse Look)
- [ ] **Touch Support**: Pinch-to-zoom and two-finger pan for tablet users
- [ ] **Selection**: Click element to view properties (Pset_*)
- [ ] **Tools**: Section Box (Potongan), Measurement (Jarak/Luas)
- [ ] **Tree View**: Hierarchy by Spatial Structure (Site -> Building -> Storey -> Space)
- [ ] **Indonesian Context**: Support "Bahasa Indonesia" in UI tooltips

### Performance
- [ ] Load 100MB IFC file in < 10 seconds on standard laptop
- [ ] Maintain 60 FPS for models with < 100k polygons

## Technical Tasks

### Frontend
- [ ] Implement `IFC.js` (web-ifc-three) viewer component
- [ ] Implement Web Worker for geometry processing (off-main-thread)

### Backend
- [ ] Optimize IFC file serving (Gzip/Brotli compression)

## Dependencies
- **Depends on**: Epic 1 (File Storage)
