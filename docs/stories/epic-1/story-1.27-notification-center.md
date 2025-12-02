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
- [ ] **Channels**: In-app, Email, Push (mobile)
- [ ] **Events**: Payment alerts, Incident alerts, Meeting reminders, Risk alerts, Document approvals
- [ ] **Preferences**: User can enable/disable notification types per channel
- [ ] **Notification Center**: In-app list of notifications with read/unread status

### Performance
- [ ] Send notifications within 5 seconds of event

## Technical Tasks

### Backend
- [ ] Implement `Notification` model and service
- [ ] Integrate email service (SendGrid/AWS SES)
- [ ] Implement push notification (Firebase Cloud Messaging)
- [ ] Implement idempotency key for notification delivery (prevent duplicates on retry)

### Frontend
- [ ] Notification bell icon with unread count
- [ ] Notification panel UI

## Dependencies
- **Depends on**: Epic 1 (Auth, User)
