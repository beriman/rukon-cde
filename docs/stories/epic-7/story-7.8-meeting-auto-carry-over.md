# Story 7.8: Meeting Management - Auto-Carry Over

**Epic**: Epic 7: Mobile Field App & AI Assistant
**Status**: Pending
**Priority**: Medium
**Estimation**: 2 Points

## User Story
**As a** Meeting Coordinator,
**I want to** automatically carry over open action items to the next meeting's agenda,
**So that** unresolved issues are not forgotten.

## Acceptance Criteria
- [ ] When scheduling a follow-up meeting, system prompts to import open items from previous meeting.
- [ ] Carried-over items retain their original creation date/history.
- [ ] Users can reorder or prioritize these items in the new agenda.
- [ ] History visualizer shows how long an item has been open (e.g., "Open since Meeting #3").

## Technical Tasks
- [ ] **Backend**: Implement "Clone/Import" logic for Meeting Items.
- [ ] **Frontend**: UI for selecting items to carry over.
- [ ] **Frontend**: Visual indicator for item aging.

## Dependencies
- Story 7.7 (Meeting Management Structure)
