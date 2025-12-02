# Story 6.7: Cash Flow Simulation (Time + Cost)

**Epic**: Epic 6 - Advanced BIM Simulation  
**Story ID**: `story-6.7`  
**Story Points**: 5  
**Priority**: P1 (High)  
**Sprint**: Sprint 21 (Weeks 41-42)

## User Story

**As a** Project Director,  
**I want to** simulate cash flow based on the 4D schedule and 5D cost data,  
**So that** I can forecast monthly spending.

## Acceptance Criteria

### Functional
- [ ] **Simulation**: Calculate projected cost per month based on Schedule (Story 6.4) and BQ (Story 6.6)
- [ ] **Chart**: Bar chart (Monthly Spend) + Line chart (Cumulative S-Curve)
- [ ] **What-If**: Drag schedule bars to see impact on Cash Flow
- [ ] **Export**: Export Cash Flow projection to Excel

### Performance
- [ ] Recalculate graph in < 1 second after schedule change

## Technical Tasks

### Backend
- [ ] Implement Cash Flow Aggregation Service

### Frontend
- [ ] Interactive Chart (Recharts) linked to Gantt Chart

## Dependencies
- **Depends on**: Story 6.4 (4D), Story 6.6 (5D)
