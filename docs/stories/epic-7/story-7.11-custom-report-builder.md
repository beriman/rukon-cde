# Story 7.11: Custom Report Builder (Drag-and-Drop)

**Epic**: Epic 7 - Mobile AI Assistant  
**Story ID**: `story-7.11`  
**Story Points**: 8  
**Priority**: P1 (High)  
**Sprint**: Sprint 26 (Weeks 51-52)

## User Story

**As a** Project Director,  
**I want to** customize the structure and content of reports,  
**So that** different stakeholders get relevant information.

## Acceptance Criteria

### Functional
- [ ] **Sections**: Drag-and-drop available sections (Cover, Executive Summary, S-Curve, Photo Gallery, Issues, HSE)
- [ ] **Templates**: Save custom templates for reuse
- [ ] **Scheduling**: Schedule automatic report generation (e.g., every Friday 5 PM)
- [ ] **Distribution**: Auto-send report to email list

## Technical Tasks

### Frontend
- [ ] Implement Drag-and-Drop UI (`react-beautiful-dnd`)

### Backend
- [ ] Template Storage and Scheduled Job (Cron/BullMQ)

## Dependencies
- **Depends on**: Story 7.10 (Automated Reporting)
