# Story 8.6: Maintenance Scheduler

**Epic**: Epic 8 - Security, Compliance & Lifecycle  
**Story ID**: `story-8.6`  
**Story Points**: 8  
**Priority**: P1 (High)  
**Sprint**: Sprint 28 (Weeks 55-56)

## User Story

**As a** Maintenance Manager,  
**I want to** schedule preventive maintenance tasks,  
**So that** equipment doesn't break down unexpectedly.

## Acceptance Criteria

### Functional
- [ ] **Task Templates**: Define tasks per asset type (e.g., "HVAC Filter Change every 3 months")
- [ ] **Auto-Generate**: Create work orders based on schedule
- [ ] **Triggers**: Time-based, Condition-based (IoT), Breakdown
- [ ] **Sign-Off**: Technician marks task as complete with notes/photos

## Technical Tasks

### Backend
- [ ] Implement `MaintenanceTask` model
- [ ] Scheduled job (Cron) to generate work orders

## Dependencies
- **Depends on**: Story 8.5 (Asset Twin)
