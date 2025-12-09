# Story 3.3: 2D Drawing Markup Tools

**Epic**: Epic 3 - Design Collaboration Suite
**Story ID**: `story-3.3`
**Story Points**: 8
**Priority**: P1 (High)
**Dependency**: Canvas Library (Fabric.js or Konva)

## User Story

**As a** Design Reviewer
**I want to** Add redline markups (clouds, arrows, text) to PDF drawings
**So that** I can communicate design changes or issues visually.

## Acceptance Criteria

### Functional
- [x] Viewer has a "Markup Mode" toggle.
- [x] Toolbar offers: Cloud, Arrow, Rectangle, Text, Pen.
- [x] User can Save markup.
- [x] Markup is saved as a separate Layer (not burned into PDF).
- [x] Other users can load/toggle the Markup Layer.

### Technical
- [x] Frontend: Implement Canvas overlay on top of PDF/Image viewer.
- [x] Backend: Save JSON data of vector paths (`DrawingMarkup` model).

## Verification Plan
- **Test**: Open PDF. Draw a red box. Save. Refresh page. Load markup. Box should reappear.
