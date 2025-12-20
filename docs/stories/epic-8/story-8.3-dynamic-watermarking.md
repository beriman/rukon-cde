# Story 8.3: Dynamic Watermarking

**Epic**: Epic 8: Security, Compliance & Asset Lifecycle
**Status**: Done
**Priority**: Medium
**Estimation**: 3 Points

## User Story
**As a** Security Officer,
**I want to** watermark all documents/models with viewer info,
**So that** leaked content can be traced back to the source.

## Acceptance Criteria
- [x] All viewers display watermark overlay
- [x] Watermark includes: User name, Date/Time, "Confidential"
- [x] Screenshot detection: Watermark visible on captures
- [x] Configurable per organization

## Technical Tasks
- [x] **Backend**: WatermarkService with org config
- [x] **Backend**: Viewer overlay generation
- [x] **Backend**: SVG watermark for exports
