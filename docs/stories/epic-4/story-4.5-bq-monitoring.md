# Story 4.5: BQ Monitoring & Variance Analysis

**Epic**: Epic 4 - Construction Monitoring & Document Control  
**Story ID**: `story-4.5`  
**Story Points**: 8  
**Priority**: P0 (Critical)  
**Sprint**: Sprint 14 (Weeks 27-28)

## User Story

**As a** Quantity Surveyor (QS),  
**I want to** monitor Bill of Quantities (BQ) and track actual vs planned usage,  
**So that** I can control project costs and identify overruns early.

## Acceptance Criteria

### Functional
- [ ] **Import**: Import BQ from Excel/CSV (Standard format: Item Code, Desc, Unit, Qty, Rate)
- [ ] **Tracking**: Input "Actual Qty" per period (Weekly/Monthly)
- [ ] **Variance**: Auto-calculate `Variance = Planned - Actual` and `Cost Variance = Variance * Rate`
- [ ] **Thresholds**: Alert if Variance > 10% (Configurable)
- [ ] **Indonesian Context**: Support "RAB (Rencana Anggaran Biaya)" structure

### Performance
- [ ] Import handles 5,000+ BQ items in < 10 seconds
- [ ] **Optimization**: Use bulk insert/upsert for imports

## Technical Tasks

### Backend
- [ ] Create `BillOfQuantity` and `BQUpdate` models
- [ ] Implement Excel Parser (using `xlsx` or `sheetjs`) with validation

### Frontend
- [ ] BQ Tree View (Nested items)
- [ ] Variance highlighting (Red for overruns)

## Dependencies
- **Depends on**: Epic 1 (File Upload)
