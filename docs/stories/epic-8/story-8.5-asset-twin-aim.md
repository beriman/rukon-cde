# Story 8.5: Asset Twin (AIM Database)

**Epic**: Epic 8 - Security, Compliance & Lifecycle  
**Story ID**: `story-8.5`  
**Story Points**: 8  
**Priority**: P0 (Critical)  
**Sprint**: Sprint 28 (Weeks 55-56)

## User Story

**As a** Facility Manager,  
**I want to** maintain a live database of all building assets,  
**So that** I can manage operations and maintenance effectively.

## Acceptance Criteria

### Functional
- [ ] **Asset Register**: Database of assets (HVAC, Pumps, Doors, etc.)
- [ ] **Attributes**: Location, Specs, Install Date, Warranty Expiry
- [ ] **Documents**: Link O&M Manuals, As-built Drawings, COBie
- [ ] **Live Data**: Integration with IoT sensors (optional)
- [ ] **Indonesian Context**: Support "Aset Gedung" terminology

### Performance
- [ ] Support 10,000+ assets per project

## Technical Tasks

### Backend
- [ ] Implement `Asset` and `AssetType` models
- [ ] API for CRUD operations with pagination
- [ ] **Database Indexing**: Create indexes on `assetType` and `location` for query performance

## Dependencies
- **Depends on**: Epic 4 (COBie)
