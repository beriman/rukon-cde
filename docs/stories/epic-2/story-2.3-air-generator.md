# Story 2.3: AIR Generator (Asset Information Requirements)

**Epic**: Epic 2 - ISO 19650-2 Strategic Planning & Delivery Tools  
**Story ID**: `story-2.3`  
**Story Points**: 5  
**Priority**: P1 (High)  
**Sprint**: Sprint 9 (Weeks 17-18)

## User Story

**As an** Appointing Party / Facility Manager  
**I want to** define Asset Information Requirements (AIR) yang terintegrasi dengan classification standar (Uniclass/OmniClass)  
**So that** saya menerima data aset yang terstruktur (COBie compliant) pada saat handover untuk operational maintenance

## Acceptance Criteria

### Functional
### Functional
- [x] User dapat define list of Maintainable Assets (e.g., AHU, Chiller, Pumps)
- [x] System allow mapping asset types ke Uniclass 2015 tables (Pr_System / Pr_Product) (Mocked for now)
- [x] User dapat specify required attributes untuk setiap asset type (e.g., SerialNumber, WarrantyDate)
- [x] System automatically generate requirement tables untuk EIR attachment (Visual in UI)
- [ ] Support export ke format Spreadsheets (XLSX) untuk COBie mapping template

### Non-Functional
- [ ] Classification search responsif (< 200ms)

## Technical Tasks

### Backend (NestJS)
### Backend (NestJS)
- [ ] Integrate with Classification Service (Epic 3 dependency - mock for now)
- [x] Create `RequirementAttribute` logic (Dynamic fields) (Frontend Logic)
- [x] Implement `AssetType` definition endpoint (Using Generic Planning Document)
- [ ] Export service update untuk support XLSX generation

### Frontend (Next.js)
- [x] Create `/planning/air` page
- [x] Build `AssetClassSelector` with autocomplete search (Mocked Uniclass)
- [x] Implement `AttributeBuilder` (add fields dynamically)

## Technical Implementation Notes

### AIR Data Structure
```json
{
  "assets": [
    {
      "uniclassCode": "Pr_70_60_36",
      "name": "Chillers",
      "requiredAttributes": [
        { "name": "SerialNumber", "type": "String", "required": true },
        { "name": "InstallDate", "type": "Date", "required": true }
      ]
    }
  ]
}
```

## Dependencies
- Epic 3 (Technical Enablers - Classification) - Loose dependency, can use static list first.

## Testing Strategy
- **Unit Test**: Data structure validation validation
- **Manual**: Verify mapping with actual Uniclass codes

## Definition of Done
- [ ] AIR Template functional
- [ ] Attribute builder working
- [ ] XLSX Export valid
