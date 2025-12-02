# Story 7.8: Auto-Carry Over (Action Items)

**Epic**: Epic 7 - Mobile AI Assistant  
**Story ID**: `story-7.8`  
**Story Points**: 3  
**Priority**: P2 (Medium)  
**Sprint**: Sprint 25 (Weeks 49-50)

## User Story

**As a** Project Admin,  
**I want to** automatically carry over open action items to the next meeting,  
**So that** nothing gets forgotten between sessions.

## Acceptance Criteria

### Functional
- [ ] **Auto-Add**: When creating a new meeting in a series, auto-import "Open" items from previous meeting
- [ ] **Aging**: Show how long an item has been open (e.g., "Open since Meeting #3")
- [ ] **Prioritization**: Allow reordering of carried-over items

## Technical Tasks

### Backend
- [ ] Implement "Meeting Series" logic
- [ ] Query for Open Items by Series ID

## Dependencies
- **Depends on**: Story 7.7 (Meeting Mgmt)
