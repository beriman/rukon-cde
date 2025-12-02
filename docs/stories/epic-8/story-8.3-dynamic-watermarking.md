# Story 8.3: Dynamic Watermarking

**Epic**: Epic 8 - Security, Compliance & Lifecycle  
**Story ID**: `story-8.3`  
**Story Points**: 5  
**Priority**: P1 (High)  
**Sprint**: Sprint 27 (Weeks 53-54)

## User Story

**As a** Compliance Manager,  
**I want to** display watermarks on all viewed documents,  
**So that** screenshots are traceable.

## Acceptance Criteria

### Functional
- [ ] **Overlay**: Watermark shows User Name, Date/Time, and "CONFIDENTIAL"
- [ ] **Viewers**: Applies to PDF, Image, and 3D Viewers
- [ ] **Screenshot-Proof**: Visible when user takes screenshot
- [ ] **Configurable**: Organization can customize watermark text/position

## Technical Tasks

### Frontend
- [ ] Implement Canvas-based watermark overlay (non-selectable, bypass-resistant)

## Dependencies
- **Depends on**: Epic 6 (Viewers)
