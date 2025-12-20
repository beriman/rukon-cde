# Story 8.2: Redaction Tools

**Epic**: Epic 8: Security, Compliance & Asset Lifecycle
**Status**: Done
**Priority**: High
**Estimation**: 5 Points

## User Story
**As a** BIM Manager,
**I want to** redact sensitive elements from models before sharing,
**So that** confidential geometry is hidden while preserving context.

## Acceptance Criteria
- [x] User can select elements for redaction in 3D viewer
- [x] Redacted elements appear as bounding boxes
- [x] Redacted 2D drawings blur specified areas
- [x] Redacted versions exported for sharing (non-destructive)

## Technical Tasks
- [x] **Backend**: RedactionService with element tracking
- [x] **Backend**: Viewer config generation for redactions
- [x] **Backend**: Non-destructive storage of original files
