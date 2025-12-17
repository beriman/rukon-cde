# Story 7.1: Mobile App - Offline Mode

**Epic**: Epic 7: Mobile Field App & AI Assistant
**Status**: Pending
**Priority**: High
**Estimation**: 8 Points

## User Story
**As a** Site Engineer,
**I want to** download project drawings and documents for offline use,
**So that** I can access critical information even when working in basements or remote areas with no internet connection.

## Acceptance Criteria
- [ ] User can select specific project folders/drawings to download.
- [ ] Downloaded content is securely stored in a local encrypted database (SQLite/Realm).
- [ ] App automatically detects network restoration and syncs changes.
- [ ] Conflict resolution UI appears if offline edits conflict with server state.
- [ ] User can view downloaded PDF/IFC files without internet.

## Technical Tasks
- [x] **Backend**: Create API endpoints for bulk data sync (delta updates).
- [ ] **Mobile**: Implement offline storage layer (SQLite/WatermelonDB).
- [ ] **Mobile**: Build background sync worker/service.
- [ ] **Mobile**: Build background sync worker/service.
- [ ] **Mobile**: Create UI for "Offline Mode" status and Sync Progress.
- [ ] **Mobile**: Implement file viewer integration for local files.

## Dependencies
- Epic 1 (Core CDE) - Auth & File Storage

## Risks
- **Data Consistency**: Conflicts between offline edits and server updates.
- **Storage Limits**: Mobile device storage constraints with large BIM models.
