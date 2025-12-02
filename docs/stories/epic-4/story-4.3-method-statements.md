# Story 4.3: Method Statements & Material Approvals

**Epic**: Epic 4 - Construction Monitoring & Document Control  
**Story ID**: `story-4.3`  
**Story Points**: 5  
**Priority**: P1 (High)  
**Sprint**: Sprint 14 (Weeks 27-28)

## User Story

**As a** QA/QC Engineer,  
**I want to** submit Method Statements and Material Approvals,  
**So that** the MK can verify compliance with technical specifications.

## Acceptance Criteria

### Functional
- [ ] **Material Submittal**: Form includes Manufacturer, Specs, Sample Photo, and Brochure
- [ ] **Method Statement**: Upload PDF with "Risk Assessment" section
- [ ] **Approval Workflow**: Similar to Shop Drawings but with "Conditional Approval" option
- [ ] **Indonesian Context**: Terminology: "Izin Pelaksanaan (Work Permit)", "Approval Material", "Metode Kerja"

### Data
- [ ] Link Material Approval to BQ Item (Story 4.5) to track budget compliance

## Technical Tasks

### Backend
- [ ] Create `MaterialApproval` and `MethodStatement` models
- [ ] API to link Approvals to BQ Items

### Frontend
- [ ] Material Approval Form with image gallery
- [ ] Mobile-friendly view for on-site verification

## Dependencies
- **Depends on**: Story 4.2 (Workflow Engine)
