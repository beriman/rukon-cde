# Story 2.4: EIR Generator (Exchange Information Requirements)

**Epic**: Epic 2 - ISO 19650-2 Strategic Planning & Delivery  
**Story ID**: `story-2.4`  
**Story Points**: 8  
**Priority**: P0 (Critical)  
**Sprint**: Sprint 6 (Weeks 11-12)

## User Story

**As an** Appointing Party,  
**I want to** generate Exchange Information Requirements (EIR) combining OIR, PIR, and AIR,  
**So that** I can issue a clear tender document to prospective Delivery Teams.

## Acceptance Criteria

### Functional
- [ ] User can aggregate requirements from OIR, PIR, and AIR into EIR
- [ ] Template includes: Technical, Management, and Commercial requirements
- [ ] User can define "Information Delivery Milestones"
- [ ] User can specify CDE standards and file naming conventions (referencing Epic 1)
- [ ] **Indonesian Context**: Template follows "Spesifikasi Teknis BIM" common in Indonesia (referencing **PUPR Permen 9/2021** and **SNI ISO 19650-2**)
- [ ] Export to PDF/DOCX

### Integration
- [ ] Auto-populate "Project Details" from Project settings
- [ ] Link to AIR for technical specs

## Technical Tasks

### Backend
- [ ] Create `EIR` template structure
- [ ] Implement "Merge" logic to pull data from OIR/PIR/AIR
- [ ] Create `EIRService` to manage the generation process

### Frontend
- [ ] EIR Wizard: Step-by-step generation
- [ ] Section selector (Technical, Management, Commercial)

## Dependencies
- **Depends on**: Stories 2.1, 2.2, 2.3 (Source data)
- **Blocks**: Story 2.8 (Tender Data Room)
