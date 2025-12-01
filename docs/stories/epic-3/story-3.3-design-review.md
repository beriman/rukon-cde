# Story 3.3: Design Review & Markup Tools (2D/3D)

**Epic**: Epic 3 - Design Collaboration Suite & Model Federation  
**Story ID**: `story-3.3`  
**Story Points**: 8  
**Priority**: P1 (High)  
**Sprint**: Sprint 10 (Weeks 19-20)

## User Story

**As a** Design Manager,  
**I want to** add markups and comments to drawings and models,  
**So that** I can communicate design issues clearly to the team.

## Acceptance Criteria

### Functional (2D PDF)
- [ ] Tools: Pen (Freehand), Text Box, Cloud, Arrow, Highlight
- [ ] Color picker for annotations
- [ ] Markups saved as a layer on top of PDF (not burning into file)

### Functional (3D Model)
- [ ] Tools: "Pin" issue at XYZ coordinate, Measure (Distance)
- [ ] **Viewpoint**: Clicking a markup restores the camera position and angle
- [ ] **Redline**: Draw 2D lines "on screen" over 3D model

### Data
- [ ] Markups can be saved as "Review Comment" or "Issue"
- [ ] Export markups to PDF report

## Technical Tasks

### Backend
- [ ] Create `Markup` and `Annotation` models (storing JSON geometry)
- [ ] Implement `POST /api/files/:id/markups`

### Frontend
- [ ] Integrate `PDF.js` wrapper with annotation canvas
- [ ] Implement 3D annotation in Viewer (projecting 3D point to 2D screen for icons)
- [ ] Markup List sidebar

## Dependencies
- **Depends on**: Epic 1 (File Viewer)
