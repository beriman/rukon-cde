# Story 2.4: EIR Generator (Exchange Information Requirements)

**Epic**: Epic 2 - ISO 19650-2 Strategic Planning & Delivery Tools  
**Story ID**: `story-2.4`  
**Story Points**: 8  
**Priority**: P0 (Critical)  
**Sprint**: Sprint 6 (Weeks 11-12)

## User Story

**As an** Appointing Party  
**I want to** generate Exchange Information Requirements (EIR) yang mencakup technical, management, dan commercial requirements  
**So that** calon tender participants memahami deliverables dan standard yang harus dipenuhi

## Acceptance Criteria

### Functional
### Functional
- [x] User dapat combine outputs dari OIR, PIR, dan AIR ke dalam EIR (Mocked aggregation selection)
- [x] Form wizard mencakup sections: Information Standards, Production Methods, Software, CDE
- [x] User dapat define submission frequency dan file formats (RVT, IFC, PDF)
- [ ] System generated PDF document yang professional dan siap untuk tender

### Non-Functional
- [ ] Generated document format complies with branding guidelines

## Technical Tasks

### Backend (NestJS)
### Backend (NestJS)
- [ ] Create `EIRTemplate` seed
- [x] Implement aggregation logic (Merge content from OIR/PIR/AIR if selected) (Frontend Logic)
- [ ] Add `TechnicalStandards` entity relation

### Frontend (Next.js)
- [x] Create `/planning/eir` page
- [x] Implement `RequirementCheckBox` list (Software, Formats, etc.)
- [ ] Document previewer with section merging visualization

## Technical Implementation Notes

### Aggregation Logic
If User selects "Include OIR Technical Policy", the system fetches the OIR document content and appends it to Section 2 of the EIR.

## Dependencies
- Story 2.1, 2.2, 2.3 (Optional inputs)

## Testing Strategy
- **Integration Test**: Validasi penggabungan konten dari OIR/PIR ke EIR
- **Manual**: Check output PDF untuk completeness

## Definition of Done
- [ ] EIR Generation Wizard complete
- [ ] Aggregation logic working
- [ ] Professional PDF output verified
