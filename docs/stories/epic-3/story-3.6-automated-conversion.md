# Story 3.6: Automated Model Conversion (Background Workers)

**Epic**: Epic 3 - Design Collaboration Suite & Model Federation  
**Story ID**: `story-3.6`  
**Story Points**: 8  
**Priority**: P0 (Critical)  
**Sprint**: Sprint 11 (Weeks 21-22)

## User Story

**As a** System,  
**I want to** automatically convert proprietary formats (RVT, DWG) to open web-friendly formats (IFC, GLTF),  
**So that** they can be viewed in the browser and used for federation.

## Acceptance Criteria

### Functional
- [ ] **Trigger**: Uploading a 3D file triggers a background job
- [ ] **Conversion Logic**:
  - RVT -> IFC (for data) & GLTF (for geometry)
  - DWG -> SVG (2D) or GLTF (3D)
  - IFC -> GLTF (optimized for web)
- [ ] **Status Tracking**: File status updates: `QUEUED` -> `PROCESSING` -> `READY` or `FAILED`
- [ ] **Retry Logic**: Failed jobs retried 3 times before permanent failure
- [ ] User receives notification when conversion is complete

### Performance
- [ ] Background worker does not block main API thread
- [ ] Support concurrent conversions (scalable workers)

## Technical Tasks

### Backend
- [ ] Setup Redis and BullMQ for job queues
- [ ] Create `ConversionWorker` (separate Node.js process or microservice)
- [ ] Implement conversion scripts (using ODA File Converter or Blender CLI for simple cases)

## Dependencies
- **Depends on**: Story 3.4 (Multi-Format)
- **Blocks**: Story 3.5 (Federation - needs common format)
