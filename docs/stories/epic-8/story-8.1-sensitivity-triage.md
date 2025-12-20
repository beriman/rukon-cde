# Story 8.1: Sensitivity Triage

**Epic**: Epic 8: Security, Compliance & Asset Lifecycle
**Status**: Done
**Priority**: High
**Estimation**: 5 Points

## User Story
**As a** Document Controller,
**I want to** classify files by sensitivity level during upload,
**So that** access is automatically restricted based on classification.

## Acceptance Criteria
- [x] User prompted to classify sensitivity during upload
- [x] Levels: Public, Internal, Confidential, Highly Confidential
- [x] Access permissions auto-adjusted based on classification
- [x] Audit log records classification decisions

## Technical Tasks
- [x] **Backend**: SensitivityService with classification logic
- [x] **Backend**: Access control integration
- [x] **Backend**: Audit logging for classifications
