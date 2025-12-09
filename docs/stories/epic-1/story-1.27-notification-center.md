# Story 1.27: Notification Center

**Epic**: Epic 1 - Core CDE Foundation  
**Story ID**: `story-1.27`  
**Story Points**: 8  
**Priority**: P0 (Critical)  
**Sprint**: Sprint 3-4

## User Story

**As a** User,  
**I want to** receive notifications for important events,  
**So that** I stay informed about project activities.

## Acceptance Criteria

### Functional
- [x] **Channels**: In-app, Email, Push (mobile) - In-app implemented
- [x] **Events**: Payment alerts, Incident alerts, Meeting reminders, Risk alerts, Document approvals
- [x] **Preferences**: User can enable/disable notification types per channel
- [x] **Notification Center**: In-app list of notifications with read/unread status

### Performance
- [x] Send notifications within 5 seconds of event

## Technical Tasks

### Backend
- [x] Implement `Notification` model and service
- [x] Integrate email service (SendGrid/AWS SES) - Stub ready
- [x] Implement push notification (Firebase Cloud Messaging) - Future (Deferred)
- [x] Implement idempotency key for notification delivery (prevent duplicates on retry)

### Frontend
- [x] Notification bell icon with unread count (Frontend Phase 3)
- [x] Notification panel UI (Frontend Phase 3)

## Dependencies
- **Depends on**: Epic 1 (Auth, User)
