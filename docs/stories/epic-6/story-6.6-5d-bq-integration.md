# Story 6.6: 5D BQ Integration (Cost + Model)

**Epic**: Epic 6 - Advanced BIM Simulation  
**Story ID**: `story-6.6`  
**Story Points**: 8  
**Priority**: P0 (Critical)  
**Sprint**: Sprint 21 (Weeks 41-42)

## User Story

**As a** Quantity Surveyor (QS),  
**I want to** link Bill of Quantities (BQ) items to model elements,  
**So that** I can verify quantities and visualize cost distribution.

## Acceptance Criteria

### Functional
- [ ] **Linkage**: Map BQ Items (from Epic 4) to IFC Elements
- [ ] **QTO (Quantity Take-Off)**: Auto-extract Volume/Area/Count from IFC geometry
- [ ] **Validation**: Compare "BQ Quantity" vs "Model Quantity" (Variance Alert)
- [ ] **Heatmap**: Colorize model by Cost (High cost = Red, Low cost = Green)
- [ ] **Indonesian Context**: Support "RAB" structure

### Data
- [ ] Sync with Epic 4 BQ database

## Technical Tasks

### Backend
- [ ] Implement QTO Service (Geometry calculation from IFC)
- [ ] API to fetch BQ data from Epic 4

### Frontend
- [ ] BQ Panel in Viewer
- [ ] Heatmap Shader

## Dependencies
- **Depends on**: Epic 4 (BQ Data), Story 6.1 (Viewer)
