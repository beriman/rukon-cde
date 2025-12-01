# Story 2.2: PIR Generator (Project Information Requirements)

**Epic**: Epic 2 - ISO 19650-2 Strategic Planning & Delivery  
**Story ID**: `story-2.2`  
**Story Points**: 3  
**Priority**: P1 (High)  
**Sprint**: Sprint 6 (Weeks 11-12)

## User Story

**As an** Appointing Party,  
**I want to** generate Project Information Requirements (PIR) based on my OIR,  
**So that** I can specify information needed to make key decisions at each project stage.

## Acceptance Criteria

### Functional
- [ ] User can create PIR linked to a specific Project
- [ ] System suggests "Key Decision Points" (milestones) based on standard project stages (e.g., Concept, Design, Construction)
- [ ] User can link PIR questions to OIR objectives
- [ ] Template includes sections: Project Scope, Key Decision Points, Information Deliverables
- [ ] Export to PDF/DOCX

### Data Integration
- [ ] If OIR exists, system prompts to import strategic objectives

## Technical Tasks

### Backend
- [ ] Create `DocumentTemplate` seed data for PIR
- [ ] Add relation `PIR` -> `OIR` (optional)
- [ ] Implement logic to fetch OIR objectives for dropdown selection

### Frontend
- [ ] PIR Editor with "Key Decision Points" timeline UI
- [ ] Component to select/link OIR objectives

## Dependencies
- **Depends on**: Story 2.1 (OIR Generator - for linking)
