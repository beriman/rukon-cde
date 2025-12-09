# Story 3.4: 3D Model Federation

**Epic**: Epic 3 - Design Collaboration Suite
**Story ID**: `story-3.4`
**Story Points**: 8
**Priority**: P2 (Medium)

## User Story

**As a** BIM Coordinator
**I want to** load multiple IFC models into a single 3D view
**So that** I can visually check for coordination issues between disciplines.

## Acceptance Criteria

### Functional
- [ ] "Federate" or "Combine" button in file explorer (Select multiple files).
- [ ] Viewer Loads Model A (Arch) and Model B (Struct) simultaneously.
- [ ] Model Tree shows structure for BOTH models separately.
- [ ] Color coding: Different tint for each model? (Nice to have).

### Technical
- [ ] Frontend: ThatOpenPlatform/IFC.js supports multi-model loading.
- [ ] Performance: Ensure 2 simple models don't crash browser.

## Verification Plan
- **Test**: Load `Sample_Arch.ifc` and `Sample_Struct.ifc`. Verify both geometries are visible.
