# Story 5.7: HSE Documentation (SOP, JSA, MSDS)

**Epic**: Epic 5 - HSE Management & Safety Monitoring  
**Story ID**: `story-5.7`  
**Story Points**: 5  
**Priority**: P1 (High)  
**Sprint**: Sprint 18 (Weeks 35-36)

## User Story

**As a** Document Controller (HSE),  
**I want to** manage HSE documents centrally,  
**So that** the latest versions of SOPs, JSAs, and MSDS are accessible to the team.

## Acceptance Criteria

### Functional
- [ ] **Repository**: Folders for SOP, JSA (Job Safety Analysis), MSDS (Material Safety Data Sheet), Legal Register
- [ ] **Versioning**: Auto-versioning (Rev 00, 01, etc.) with history
- [ ] **Search**: Full-text search by hazard keyword (e.g., "Chemical", "Height")
- [ ] **Indonesian Context**: "CSMS (Contractor Safety Management System)" document requirements
- [ ] **Access**: QR Code generation for MSDS (scan to view on site)
- [ ] **Usability**: QR Codes must be scannable by standard camera apps (deep link to PWA)

### Performance
- [ ] Search results return in < 1 second

## Technical Tasks

### Backend
- [ ] Reuse `Document` model from Epic 1 with added `category` tag
- [ ] Implement Full-Text Search

### Frontend
- [ ] Document Library UI with Filter by Category
- [ ] PDF Viewer

## Dependencies
- **Depends on**: Epic 1 (Core CDE)
