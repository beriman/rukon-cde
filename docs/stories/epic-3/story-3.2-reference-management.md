# Story 3.2: Reference Management (XREF)

**Epic**: Epic 3 - Design Collaboration Suite & Model Federation  
**Story ID**: `story-3.2`  
**Story Points**: 5  
**Priority**: P1 (High)  
**Sprint**: Sprint 10 (Weeks 19-20)

## User Story

**As a** Modeler/Engineer,  
**I want to** load models from other disciplines as background references (XREF),  
**So that** I can coordinate my design against the latest shared information.

## Acceptance Criteria

### Functional
- [ ] User can select files from `Shared` folder to "Link" into current view
- [ ] **Visualization**: Linked models displayed with 50% transparency or grayscale (configurable)
- [ ] **Version Check**: System warns if the linked model is not the latest version in `Shared`
- [ ] User can toggle visibility of linked models
- [ ] Saved Views: "Link configuration" is saved with the view

### Performance
- [ ] Viewer handles loading main model + 3 reference models without crashing (WebAssembly/SharedArrayBuffer optimization)

## Technical Tasks

### Backend
- [ ] Create `FileLink` model (ParentFile -> LinkedFile)
- [ ] API to check for newer versions of linked files

### Frontend
- [ ] Viewer UI: "Link Manager" panel
- [ ] Implement "Ghost Mode" (transparency) for linked models in Three.js/IFC.js

## Dependencies
- **Depends on**: Story 3.1 (Shared folder content)
- **Blocks**: Story 3.7 (Clash Detection)
