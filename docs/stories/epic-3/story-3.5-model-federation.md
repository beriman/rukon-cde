# Story 3.5: Model Federation (Merge Logic)

**Epic**: Epic 3 - Design Collaboration Suite & Model Federation  
**Story ID**: `story-3.5`  
**Story Points**: 8  
**Priority**: P0 (Critical)  
**Sprint**: Sprint 12 (Weeks 23-24)

## User Story

**As a** BIM Coordinator,  
**I want to** merge multiple discipline models into a single federated view,  
**So that** I can visualize the complete project and identify coordination issues.

## Acceptance Criteria

### Functional
- [ ] **Selection**: User can select multiple models (e.g., Arch + Struct + MEP) from Shared/Published folders
- [ ] **Federation**: System loads all selected models into a single 3D scene
- [ ] **Alignment**: System aligns models based on Shared Coordinates (Internal Origin / Survey Point)
- [ ] **Visibility Control**: User can toggle visibility/transparency per model
- [ ] **Save View**: User can save the federation configuration (list of file IDs + settings) as a "Federated View"
- [ ] **Performance**: Viewer handles 10+ merged models (up to 500MB total geometry)

## Technical Tasks

### Backend
- [ ] Create `FederatedView` model (stores list of `fileIds` and camera settings)

### Frontend
- [ ] Viewer "Model Tree" (showing loaded models)
- [ ] Implement "Add to Scene" logic in Viewer
- [ ] Coordinate System alignment logic (IFC/GLTF matrix transform)

## Dependencies
- **Depends on**: Story 3.6 (Common format like GLTF/IFC needed for efficient merging)
