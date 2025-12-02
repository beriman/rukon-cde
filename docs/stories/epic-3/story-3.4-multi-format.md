# Story 3.4: Multi-Format Support (RVT, DWG, IFC)

**Epic**: Epic 3 - Design Collaboration Suite & Model Federation  
**Story ID**: `story-3.4`  
**Story Points**: 5  
**Priority**: P1 (High)  
**Sprint**: Sprint 11 (Weeks 21-22)

## User Story

**As a** User,  
**I want to** upload and preview engineering files in various formats (RVT, DWG, IFC),  
**So that** I can view project data without needing expensive desktop software.

## Acceptance Criteria

### Functional
- [ ] System accepts upload of `.rvt`, `.dwg`, `.dgn`, `.ifc`, `.nwd` files
- [ ] **Format Detection**: System correctly identifies file type via magic numbers (not just extension)
- [ ] **Viewer Selection**: System routes file to appropriate viewer engine:
  - IFC -> IFC.js / That Open Platform
  - RVT/DWG -> ODA SDK (or converted GLTF)
- [ ] User sees "Processing" state while file is being prepared for viewing

### Performance
- [ ] Viewer loads 50MB IFC file in < 5 seconds **on standard laptop** (Intel i5/AMD Ryzen 5, 8GB RAM, integrated GPU)

## Technical Tasks

### Backend
- [ ] Update `File` model with `mimeType` and `processingStatus`
- [ ] Integration with ODA (Open Design Alliance) SDK or similar service for proprietary formats

### Frontend
- [ ] Viewer Component Factory (selects renderer based on file type)

## Dependencies
- **Depends on**: Epic 1 (File Upload)
- **Blocks**: Story 3.6 (Conversion)
