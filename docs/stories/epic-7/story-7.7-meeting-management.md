# Story 7.7: Meeting Management - Minutes & Actions

**Epic**: Epic 7: Mobile Field App & AI Assistant
**Status**: Done
**Priority**: Medium
**Estimation**: 5 Points

## User Story
**As a** Meeting Coordinator,
**I want to** create digital meeting minutes with tracked action items,
**So that** responsibilities are clear and progress can be monitored.

## Acceptance Criteria
- [ ] User can create a meeting (Title, Date, Attendees, Agenda).
- [ ] During meeting, user can add "Action Items" with Assignee, Due Date, and Priority.
- [ ] Users receive notifications when assigned an action item.
- [ ] Action Items have status (Open, In Progress, Closed).
- [ ] Meeting minutes can be exported to PDF.

## Technical Tasks
- [ ] **Backend**: Create `Meeting`, `AgendaItem`, `ActionItem` models.
- [ ] **Backend**: Implement CRUD endpoints.
- [ ] **Frontend**: Build Meeting Editor UI (Agenda/Minutes view).
- [ ] **Frontend**: Build "My Action Items" dashboard widget.

## Dependencies
- Epic 1 (User Management)

## Risks
- **Adoption**: Users sticking to Word/Excel if the UI is not intuitive.
