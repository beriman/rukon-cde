# Story 4.1: Technical Monitoring Dashboard

**Epic**: Epic 4 - Construction Monitoring Suite
**Story ID**: `story-4.1`
**Story Points**: 5
**Priority**: P1
**Sprint**: Sprint TBD

## User Story

**As a** Construction Manager or Site Engineer
**I want to** report and monitor technical progress for Structure, Architecture, and MEP
**So that** I can track the percentage of work completed against the plan and identify delays.

## Acceptance Criteria

### Functional
- [x] User can navigate to "Construction Monitoring" > "[Discipline]" (Struct/Arch/MEP).
- [x] User can define "Progress Zones" or "Work Packages" (e.g., Level 1 - Zone A).
- [x] User can input progress percentage (0-100%) for a specific work package/date.
- [x] System stores the history of progress updates (Who, When, Value).
- [x] Dashboard displays a Progress Bar and Trend Line (S-Curve placeholder).
- [x] User can attach photos to a progress report.

### Non-Functional
- [x] Dashboard loads in < 2s.
- [x] Mobile-responsive for tablet usage on site.

## Technical Tasks

### Backend (NestJS)
- [x] Create `ConstructionModule` and `ConstructionController`.
- [x] Implement `ProgressService`.
- [x] Schema update: Add `WorkPackage`, `ProgressUpdate`.
- [x] Endpoint `POST /api/construction/progress` to submit update.
- [x] Endpoint `GET /api/construction/dashboard/:discipline` to fetch aggregated data.

### Frontend (Next.js)
- [x] Create `/construction/dashboard` layout.
- [x] Implement `DisciplineSelector`.
- [x] Create `ProgressInputForm` with slider or number input and file attachment.
- [x] Implement `ProgressChart` using Recharts.

### Database
- [x] Add `WorkPackage` model (linked to Project).
- [x] Add `ProgressUpdate` model (linked to WorkPackage).

## Definition of Done
- [x] Schema migration applied.
- [x] API Endpoints tested with Postman/Insomnia.
- [x] Frontend page functional.
- [x] Unit tests passed.
