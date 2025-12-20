# Story 7.9: Meeting Management - BCF Links

**Epic**: Epic 7: Mobile Field App & AI Assistant
**Status**: Done
**Priority**: Medium
**Estimation**: 3 Points

## User Story
**As a** BIM Coordinator,
**I want to** link meeting action items to specific BCF topics (3D issues),
**So that** we can view the 3D context of the problem directly from the meeting minutes.

## Acceptance Criteria
- [ ] User can search and select BCF Topics to attach to a Meeting Item.
- [ ] Clicking the attachment opens the 3D Viewer localized to the BCF Viewpoint.
- [ ] Status sync: Closing the Meeting Item can optionally close the BCF Topic (and vice versa).

## Technical Tasks
- [ ] **Backend**: Add relation between `ActionItem` and `BcfTopic`.
- [ ] **Frontend**: Implement BCF Picker component in Meeting UI.
- [ ] **Frontend**: Integrate 3D Viewer context switching.

## Dependencies
- Story 7.7 (Meeting Management)
- Epic 6 (BCF Module)
