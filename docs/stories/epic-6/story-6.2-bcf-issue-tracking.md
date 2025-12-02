# Story 6.2: BCF Issue Tracking (API v2.1/v3.0)

**Epic**: Epic 6 - Advanced BIM Simulation  
**Story ID**: `story-6.2`  
**Story Points**: 8  
**Priority**: P0 (Critical)  
**Sprint**: Sprint 19 (Weeks 37-38)

## User Story

**As a** Design Manager,  
**I want to** create and track issues linked to the 3D model using BCF standard,  
**So that** design coordination issues are interoperable with Revit/Solibri.

## Acceptance Criteria

### Functional
- [ ] **Issue Creation**: Create issue with Title, Description, Priority, Assignee
- [ ] **Viewpoint**: Capture camera position, direction, and selected elements
- [ ] **Markup**: Draw annotations (Cloud, Arrow, Text) on the snapshot
- [ ] **Import/Export**: Support `.bcfzip` file import/export
- [ ] **API**: Compliant with BCF REST API v2.1 (and v3.0 foundation)
- [ ] **Indonesian Context**: Issue types: "Bentrok (Clash)", "Klarifikasi (RFI)", "Perubahan (Change)"

### Technical
- [ ] **Interoperability**: Verified connection with Solibri BCF Connector

## Technical Tasks

### Backend
- [ ] Implement BCF API endpoints (`/bcf/2.1/projects/...`)
- [ ] XML Parser/Generator for `bcf.version`, `markup.bcf`, `viewpoint.bcfv`

### Frontend
- [ ] BCF Panel in Viewer (List issues, click to fly-to viewpoint)

## Dependencies
- **Depends on**: Story 6.1 (Viewer)
