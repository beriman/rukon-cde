# Story 4.6: Project Control Dashboard (S-Curve Integration)

**Epic**: Epic 4 - Construction Monitoring Suite
**Story ID**: `story-4.6`
**Story Points**: 5
**Priority**: P2
**Sprint**: Sprint TBD

## User Story

**As a** Project Director
**I want to** view the overall S-Curve (Weighted Physical % vs Cost %)
**So that** I can assess the project health at a glance.

## Context
Story 4.1 implemented the basic "Physical" curve based on Work Packages. This story adds the "Cost" curve (from Story 4.5 Payment) and "Planned" curve integration (from future Schedule module or manual import).

## Acceptance Criteria

### Functional
- [x] Dashboard displays Multi-Line Chart: Planned %, Actual Physical %, Actual Cost %.
- [x] User can derive "Earned Value" metrics (SPI, CPI).
- [x] Drill-down capability from Overall -> Discipline -> Zone.

## Technical Tasks

### Backend
- [x] Implement `SCurveService` aggregating data from `ProgressUpdate` (Physical) and `ProgressClaim` (Financial).
- [x] Endpoint `GET /api/construction/dashboard/s-curve`.

### Frontend
- [x] Enhance 4.1 Dashboard with Cost series.
- [x] Add SPI/CPI cards.

## Definition of Done
- [x] S-Curve shows both Physical and Financial progress.
- [x] Unit tests for SPI/CPI calc.
