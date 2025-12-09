# Story 4.7: COBie & Data Compliance

**Epic**: Epic 4 - Construction Monitoring Suite
**Story ID**: `story-4.7`
**Story Points**: 5
**Priority**: P3
**Sprint**: Sprint TBD

## User Story

**As a** BIM Manager
**I want to** validate the asset data against COBie requirements
**So that** I can ensure a smooth handover to the Facility Management team.

## Acceptance Criteria

### Functional
- [x] User can run a "Health Check" on a model/file.
- [x] System checks for presence of COBie fields (Component.Name, Type.Name, Space, etc.).
- [x] Dashboard shows % Compliance (e.g., "80% of Doors missing FireRating").
- [x] Export non-compliant list to Excel/BCF.

## Technical Tasks

### Backend
- [x] Implement `CobieService` to parse IFC/Revit metadata (extracted during upload).
- [x] Define Compliance Rules engine.

### Frontend
- [x] COBie Dashboard.

## Definition of Done
- [x] Parsing logic tests passed.
- [x] UI visualizes compliance score.
