# Story 7.1: Mobile App Foundation (Offline-First)

**Epic**: Epic 7 - Mobile AI Assistant  
**Story ID**: `story-7.1`  
**Story Points**: 8  
**Priority**: P0 (Critical)  
**Sprint**: Sprint 23 (Weeks 45-46)

## User Story

**As a** Site Engineer,  
**I want to** access project data on my mobile device even without internet connection,  
**So that** I can work in remote areas or basements.

## Acceptance Criteria

### Functional
- [ ] **Offline Sync**: Download selected project (Drawings, Docs, Checklists) for offline use
- [ ] **Selective Sync**: User can choose specific folders/files to download (to save device storage)
- [ ] **Local Database**: Store data securely on device (SQLite/Realm)
- [ ] **Auto-Sync**: Automatically upload changes when back online
- [ ] **Conflict Resolution**: "Last Write Wins" strategy with UI to resolve conflicts manually if needed
- [ ] **Indonesian Context**: UI localized to Bahasa Indonesia

### Technical
- [ ] **Framework**: React Native (Expo) or Flutter
- [ ] **Storage**: Encrypted local storage

## Technical Tasks

### Mobile
- [ ] Setup React Native project with `watermelondb` or `realm`
- [ ] Implement Sync Engine (Background fetch)

## Dependencies
- **Depends on**: Epic 1 (API)
