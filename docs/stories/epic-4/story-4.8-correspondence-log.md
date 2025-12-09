# Story 4.8: Correspondence Log (Site Memos & Instructions)

**Epic**: Epic 4 - Construction Monitoring Suite
**Story ID**: `story-4.8`
**Story Points**: 3
**Priority**: P3
**Sprint**: Sprint TBD

## User Story

**As a** Contract Administrator
**I want to** issue and track Site Memos and Site Instructions (SI)
**So that** all formal communication regarding site execution is recorded.

## Acceptance Criteria

### Functional
- [x] User can create a "Site Memo" or "SI".
- [x] Form includes: From, To, Subject, Message, Attachments.
- [x] Recipients get email notification.
- [x] System tracks "Read Receipt" or "Replied" status.
- [x] Threaded view of replies.

## Technical Tasks

### Backend
- [x] Add `Correspondence` model.
- [x] Integrate with `NotificationService`.

### Frontend
- [x] Correspondence Inbox/Outbox interface.

## Definition of Done
- [x] Schema updated.
- [x] Sending/Receiving works.
- [x] Notifications work.
