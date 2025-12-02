# Story 7.2: Site Capture (Photo/Video & GPS)

**Epic**: Epic 7 - Mobile AI Assistant  
**Story ID**: `story-7.2`  
**Story Points**: 5  
**Priority**: P0 (Critical)  
**Sprint**: Sprint 23 (Weeks 45-46)

## User Story

**As a** Site Supervisor,  
**I want to** take photos and videos tagged with location,  
**So that** I can document progress and issues accurately.

## Acceptance Criteria

### Functional
- [ ] **Capture**: Take Photo/Video within app
- [ ] **Annotation**: Draw on photos (Arrow, Circle, Text)
- [ ] **Location**: Auto-tag GPS coordinates
- [ ] **Pinning**: Pin photo to specific location on 2D Floor Plan
- [ ] **Indonesian Context**: Timestamp format (WIB/WITA/WIT)

### Performance
- [ ] **Compression**: Compress images client-side (max 1MB) before sync

## Technical Tasks

### Mobile
- [ ] Implement Camera module (`expo-camera` or `react-native-vision-camera`)
- [ ] Implement Image Editor (Markup)

## Dependencies
- **Depends on**: Story 7.1 (Mobile Foundation)
