# Story 6.9: LOIN/IDS Validation (Information Delivery)

**Epic**: Epic 6 - Advanced BIM Simulation  
**Story ID**: `story-6.9`  
**Story Points**: 8  
**Priority**: P1 (High)  
**Sprint**: Sprint 22 (Weeks 43-44)

## User Story

**As a** BIM Manager,  
**I want to** validate the model against Information Delivery Specification (IDS),  
**So that** I can ensure all required parameters (LOIN) are present before handover.

## Acceptance Criteria

### Functional
- [ ] **IDS Editor**: Create/Edit IDS XML files (Define required properties per entity)
- [ ] **Validation**: Run check against IFC model
- [ ] **Report**: List failing elements (Missing Property, Wrong Type, Wrong Value)
- [ ] **Indonesian Context**: Support "SNI ISO 19650" requirements

### Technical
- [ ] **Standard**: Compliant with buildingSMART IDS standard

## Technical Tasks

### Backend
- [ ] Implement IDS Parser and Validator logic

### Frontend
- [ ] Validation Dashboard (Pass/Fail charts)

## Dependencies
- **Depends on**: Story 6.1 (Viewer)
