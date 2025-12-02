# Story 8.2: Redaction Tools (2D/3D)

**Epic**: Epic 8 - Security, Compliance & Lifecycle  
**Story ID**: `story-8.2`  
**Story Points**: 8  
**Priority**: P1 (High)  
**Sprint**: Sprint 27 (Weeks 53-54)

## User Story

**As a** Security Officer,  
**I want to** redact sensitive areas from drawings and models,  
**So that** I can share documents with external parties safely.

## Acceptance Criteria

### Functional
- [ ] **3D Redaction**: Select IFC elements to hide (rendered as bounding boxes)
- [ ] **2D Redaction**: Draw rectangles to blur PDF/DWG areas
- [ ] **Non-Destructive**: Original file preserved, redacted version created
- [ ] **Export**: Export redacted file for sharing

## Technical Tasks

### Frontend
- [ ] Implement redaction overlay editor (Canvas API)

## Dependencies
- **Depends on**: Epic 6 (IFC Viewer)
