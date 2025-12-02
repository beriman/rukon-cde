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
- [ ] **Persistence**: Sync "Tour Seen" status to user profile in DB (not just local storage)
- [ ] **Steps**: 5-7 key features (File Upload, CDE Workflow, 3D Viewer, Reports, HSE Dashboard)
- [ ] **Interaction**: Highlight UI elements, tooltips, "Next/Skip" buttons
- [ ] **Restart**: User can manually restart tour from Help menu
- [ ] **Mobile**: Disable or adapt tour for mobile devices (screen width < 768px)
- [ ] **Stability**: Use `data-tour-id` attributes for all tour targets to prevent breakage on UI changes

### Technical
- [ ] **Library**: Intro.js, Shepherd.js, atau Driver.js

## Technical Tasks

### Frontend
- [ ] Implement product tour component using `data-tour-id` selectors
- [ ] Create tour steps configuration (JSON)

### Backend
- [ ] Add `hasSeenTour` boolean field to UserPreference model
- [ ] API endpoint to update tour status

## Dependencies
- **Depends on**: Epic 1 (Auth, Dashboard)
