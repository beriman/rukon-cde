# Story 6.8: Classification Systems (Uniclass/OmniClass)

**Epic**: Epic 6 - Advanced BIM Simulation  
**Story ID**: `story-6.8`  
**Story Points**: 5  
**Priority**: P2 (Medium)  
**Sprint**: Sprint 22 (Weeks 43-44)

## User Story

**As a** BIM Manager,  
**I want to** classify model elements using standard systems (Uniclass 2015, OmniClass),  
**So that** data is structured consistently for asset management.

## Acceptance Criteria

### Functional
- [ ] **Dictionary**: Built-in database of Uniclass 2015 and OmniClass tables
- [ ] **Auto-Suggest**: Suggest classification code based on IFC Entity (e.g., `IfcWall` -> `EF_25_10`)
- [ ] **Validation**: Check if all elements have a classification code
- [ ] **Search**: Filter model by classification (e.g., "Show all `Pr_...` products")

## Technical Tasks

### Backend
- [ ] Import Classification Tables (JSON/SQLite)
- [ ] Implement Search API by Classification Code

### Frontend
- [ ] Classification Picker UI (Tree view)

## Dependencies
- **Depends on**: Story 6.1 (Viewer)
