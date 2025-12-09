# Story 3.2: Reference Management (XREFs)

**Epic**: Epic 3 - Design Collaboration Suite
**Story ID**: `story-3.2`
**Story Points**: 8
**Priority**: P1 (High)

## User Story

**As a** Lead Designer (e.g., Architect)
**I want to** link "Shared" models from other disciplines into my workspace as references
**So that** I can coordinate my design against their latest approved work without duplicating files.

## Acceptance Criteria

### Functional
- [x] UI provides "Link Reference" button in File Browser.
- [x] User can browse "Shared" folder to select a target.
- [x] Linked file appears in current folder with a "Link/Shortcut" icon.
- [x] Linked file is READ-ONLY in the destination.
- [x] If original file is updated (new version), the Link points to the NEW version (Dynamic Linking) OR specific version (Static). *Decision: Dynamic for MVP*.

### Technical
- [x] New Database Model `FileLink` or `ModelReference` (SourceID -> TargetFolderID).
- [x] API `GET /files` must include Links.

## Verification Plan
- **Test**: Link "Struct_Model.ifc" from Shared to Arch WIP. Check if Architect can see it. Check if Architect can delete the *link* but not the *source*.
