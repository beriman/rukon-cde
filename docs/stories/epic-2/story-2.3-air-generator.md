# Story 2.3: AIR Generator (Asset Information Requirements)

**Epic**: Epic 2 - ISO 19650-2 Strategic Planning & Delivery  
**Story ID**: `story-2.3`  
**Story Points**: 5  
**Priority**: P1 (High)  
**Sprint**: Sprint 6 (Weeks 11-12)

## User Story

**As an** Appointing Party (Facility Manager),  
**I want to** generate Asset Information Requirements (AIR),  
**So that** I can specify the detailed technical data required for asset operation and maintenance (e.g., COBie data).

## Acceptance Criteria

### Functional
- [ ] User can select asset categories (e.g., HVAC, Electrical, Plumbing)
- [ ] System provides standard parameter lists for each category (based on COBie/IFC)
- [ ] User can define required Level of Information Need (LOIN) for each asset type
- [ ] Template includes sections: Asset Classification, Required Attributes, Documentation formats
- [ ] Export to PDF/DOCX and **Machine Readable Format (JSON/XML)** for validation later

### Technical
- [ ] Integration with Classification Standards (Uniclass 2015 / OmniClass)
- [ ] Define "Required" vs "Optional" attributes

## Technical Tasks

### Backend
- [ ] Create `ClassificationService` to serve Uniclass/OmniClass tables
- [ ] Implement AIR data structure (AssetType -> Attributes -> Requirements)
- [ ] Implement JSON export for automated validation (used in Epic 6)

### Frontend
- [ ] Build Asset Requirement Editor (Table-based UI)
- [ ] Classification picker component

## Dependencies
- **Depends on**: Epic 1
- **Blocks**: Epic 4 (COBie validation), Epic 8 (Asset Lifecycle)
