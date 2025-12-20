# Story 7.11: Custom Report Builder

**Epic**: Epic 7: Mobile Field App & AI Assistant
**Status**: Done
**Priority**: Low
**Estimation**: 5 Points

## User Story
**As a** Project Administrator,
**I want to** customize the layout and sections of the automated reports,
**So that** the output matches our specific client or internal requirements.

## Acceptance Criteria
- [ ] Drag-and-drop interface to add/remove/reorder report sections (e.g., Executive Summary, Safety, Progress, Financial).
- [ ] User can save custom layouts as "Report Templates".
- [ ] Rich text editor for adding manual commentary/Executive Summary.
- [ ] Ability to schedule automatic generation and email delivery.

## Technical Tasks
- [ ] **Frontend**: Build Drag-and-Drop Layout Editor.
- [ ] **Backend**: Store report templates in DB.
- [ ] **Backend**: Render engine support for dynamic layouts (Handlebars/Pug).
- [ ] **Backend**: Implement Scheduler for recurring reports.

## Dependencies
- Story 7.10 (Reporting Engine)
