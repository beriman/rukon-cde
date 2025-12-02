# Story 4.7: S-Curve Visualization

**Epic**: Epic 4 - Construction Monitoring & Document Control  
**Story ID**: `story-4.7`  
**Story Points**: 8  
**Priority**: P1 (High)  
**Sprint**: Sprint 15 (Weeks 29-30)

## User Story

**As a** Project Director,  
**I want to** view the Project S-Curve (Planned vs Actual),  
**So that** I can assess the overall project health at a glance.

## Acceptance Criteria

### Functional
- [ ] **Chart**: Line chart showing "Planned Cumulative %" vs "Actual Cumulative %" over time
- [ ] **Data Sources**:
  - Planned: From Schedule (Epic 6) or **Manual Input** (Fallback if Epic 6 not ready)
  - Actual: Aggregated from BQ Progress (Story 4.5) or Technical Monitoring (Story 4.1)
- [ ] **Granularity**: View by Week or Month
- [ ] **Indonesian Context**: "Kurva S" with "Deviasi" (Deviation) indicator
- [ ] **Export**: Download Chart as PNG/PDF for reports

### Performance
- [ ] Chart renders in < 1 second
- [ ] **Optimization**: Pre-calculate weekly data points (Materialized View or Caching)

## Technical Tasks

### Backend
- [ ] Implement `SCurveService` to aggregate data points
- [ ] Scheduled job to update "Actual" curve nightly

### Frontend
- [ ] Implement Chart using `Recharts` or `Victory`
- [ ] Interactive tooltip showing Deviation %

## Dependencies
- **Depends on**: Story 4.1 (Progress Data), Story 4.5 (BQ Data)
