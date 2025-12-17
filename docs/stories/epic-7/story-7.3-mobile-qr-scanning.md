# Story 7.3: Mobile App - QR Scanning

**Epic**: Epic 7: Mobile Field App & AI Assistant
**Status**: Pending
**Priority**: Medium
**Estimation**: 3 Points

## User Story
**As a** Facility Manager or Inspector,
**I want to** scan QR codes on rooms or equipment,
**So that** I can instantly retrieve the relevant specifications, drawings, and maintenance logs.

## Acceptance Criteria
- [ ] Admin can generate printable QR codes for Rooms/Assets from the web platform.
- [ ] Mobile app has a QR scanner feature.
- [ ] Scanning a valid project QR code opens the relevant "Asset Detail" or "Room Config" page.
- [ ] Parsing invalid/unrelated QR codes shows an error.

## Technical Tasks
- [ ] **Frontend (Web)**: Implement QR Code generation (PDF export).
- [ ] **Mobile**: Integrate QR Scanning library.
- [ ] **Backend**: Create lookup endpoint `GET /assets/by-qr/{code}`.
- [ ] **Mobile**: Build Asset/Room Detail view.

## Dependencies
- Epic 4 (Asset/Procurement data)

## Risks
- **Physical Tagging**: QR codes getting damaged on site.
