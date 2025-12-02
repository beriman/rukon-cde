# Story 7.3: QR Scanning (Asset/Room Lookup)

**Epic**: Epic 7 - Mobile AI Assistant  
**Story ID**: `story-7.3`  
**Story Points**: 3  
**Priority**: P1 (High)  
**Sprint**: Sprint 23 (Weeks 45-46)

## User Story

**As a** Facility Manager,  
**I want to** scan a QR code on a room or equipment,  
**So that** I can instantly view its drawings and maintenance history.

## Acceptance Criteria

### Functional
- [ ] **Scan**: Scan QR Code using device camera
- [ ] **Lookup**: Redirect to Asset Detail or Room Detail page
- [ ] **Deep Link**: Support deep linking (e.g., `rukon://asset/123`)
- [ ] **Fallback**: Manual code entry if scan fails

## Technical Tasks

### Mobile
- [ ] Implement QR Scanner (`expo-barcode-scanner`)
- [ ] Handle Deep Linking navigation

## Dependencies
- **Depends on**: Story 7.1 (Mobile Foundation)
