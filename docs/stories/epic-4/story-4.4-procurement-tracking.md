# Story 4.4: Procurement Tracking (Long Lead Items)

**Epic**: Epic 4 - Construction Monitoring & Document Control  
**Story ID**: `story-4.4`  
**Story Points**: 5  
**Priority**: P1 (High)  
**Sprint**: Sprint 14 (Weeks 27-28)

## User Story

**As a** Procurement Manager,  
**I want to** track Long Lead Items (LLI) and vendor deliveries,  
**So that** material delays do not impact the critical path.

## Acceptance Criteria

### Functional
- [ ] **LLI Log**: Track items with: Description, Vendor, PO Date, Manufacturing Lead Time, Shipping Time, ETA
- [ ] **Alerts**: Auto-alert if `ETA > Required On Site Date`
- [ ] **Status**: `Ordered`, `Manufacturing`, `In Transit`, `Delivered`, `Inspection Passed`
- [ ] **Indonesian Context**: Terminology: "Barang Impor", "TKDN (Tingkat Komponen Dalam Negeri)" tracking field

### Data
- [ ] Link LLI to Schedule Activity (Epic 6) for automatic "Required On Site Date" updates

## Technical Tasks

### Backend
- [ ] Create `ProcurementItem` model
- [ ] Implement Alert Job (Daily check for delays)

### Frontend
- [ ] Procurement Dashboard with "Delay Risk" highlighting (Red/Amber/Green)

## Dependencies
- **Depends on**: Epic 6 (Schedule)
