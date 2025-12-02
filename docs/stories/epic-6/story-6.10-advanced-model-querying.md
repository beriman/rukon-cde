# Story 6.10: Advanced Model Querying (SQL-like)

**Epic**: Epic 6 - Advanced BIM Simulation  
**Story ID**: `story-6.10`  
**Story Points**: 5  
**Priority**: P2 (Medium)  
**Sprint**: Sprint 22 (Weeks 43-44)

## User Story

**As a** Data Analyst,  
**I want to** query model data using complex conditions,  
**So that** I can extract specific information without manual searching.

## Acceptance Criteria

### Functional
- [ ] **Query Builder**: Visual builder for "AND/OR" conditions
- [ ] **Conditions**: Property Value (Equals, Contains, >, <), Classification, Type
- [ ] **Action**: Select, Isolate, Colorize, or Export results
- [ ] **Save Query**: Save common queries (e.g., "All Fire Rated Doors > 60min")

## Technical Tasks

### Frontend
- [ ] Implement Query Engine on top of `web-ifc` properties

## Dependencies
- **Depends on**: Story 6.1 (Viewer)
