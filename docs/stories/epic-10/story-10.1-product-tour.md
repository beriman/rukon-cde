# Story 10.1: Interactive Product Tour

**Epic**: Epic 10 - User Onboarding & Training  
**Story ID**: `story-10.1`  
**Story Points**: 5  
**Priority**: P1 (High)  
**Sprint**: After Epic 1-2 completion

## User Story

**As a** New User,  
**I want to** see an interactive tour when I first login,  
**So that** I can quickly learn key features.

## Acceptance Criteria

### Functional
- [ ] **Trigger**: Auto-show tour on first login
- [ ] **Steps**: 5-7 key features (File Upload, CDE Workflow, 3D Viewer, Reports, HSE Dashboard)
- [ ] **Interaction**: Highlight UI elements, tooltips, "Next/Skip" buttons
- [ ] **Progress**: User can skip tour and re-launch later from Help menu

### Technical
- [ ] **Library**: Intro.js, Shepherd.js, atau Driver.js

## Technical Tasks

### Frontend
- [ ] Implement product tour component
- [ ] Create tour steps configuration (JSON)

## Dependencies
- **Depends on**: Epic 1 (Auth, Dashboard)
