# Story 4.2: Shop Drawings Management

**Epic**: Epic 4 - Construction Monitoring & Document Control  
**Story ID**: `story-4.2`  
**Story Points**: 8  
**Priority**: P0 (Critical)  
**Sprint**: Sprint 13 (Weeks 25-26)

## User Story

**As a** Drafter (Kontraktor),  
**I want to** submit Shop Drawings for approval by the MK/Consultant,  
**So that** construction can proceed with approved technical details.

## Acceptance Criteria

### Functional
- [ ] **Bulk Upload**: Support uploading ≥20 drawings at once
- [ ] **Metadata**: Auto-extract sheet number from filename (regex config)
- [ ] **Workflow**:
  1.  `SUBMITTED` (Kontraktor)
  2.  `UNDER_REVIEW` (MK/Consultant)
  3.  `APPROVED` / `APPROVED_WITH_NOTES` / `REVISE_RESUBMIT`
- [ ] **Stamping**: System automatically overlays "QR Code" and "Status Stamp" on the PDF upon approval
- [ ] **Revision Control**: New upload increments revision (A -> B -> C)

### Performance
- [ ] PDF Stamping process takes < 2 seconds per file

## Technical Tasks

### Backend
- [ ] Implement `ShopDrawing` workflow state machine
- [ ] **PDF Engine**: Use `pdf-lib` or `muhammara` for high-performance stamping
- [ ] **Dynamic Stamping**: Logic to detect page size (A4/A3/A1) and orientation to place stamp correctly (e.g., bottom-right corner)
- [ ] QR Code generation service

### Frontend
- [ ] Bulk Upload UI with progress bars
- [ ] PDF Viewer with "Stamp Preview"

## Dependencies
- **Depends on**: Epic 2 (Approval Workflows)
