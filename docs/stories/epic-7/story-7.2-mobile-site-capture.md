# Story 7.2: Mobile App - Site Capture

**Epic**: Epic 7: Mobile Field App & AI Assistant
**Status**: Pending
**Priority**: High
**Estimation**: 5 Points

## User Story
**As a** Field Supervisor,
**I want to** take photos and videos tagged with GPS location and floor plan position,
**So that** I can accurately document site progress and issues for reports.

## Acceptance Criteria
- [ ] User can capture photo/video within the app.
- [ ] Photos are automatically tagged with GPS coordinates.
- [ ] User can "pin" a photo to a specific location on a 2D floor plan.
- [ ] User can add text commentary or voice notes to the capture.
- [ ] Media is queued for batch upload when online.

## Technical Tasks
- [ ] **Mobile**: Integrate Camera API (Expo Camera / Native).
- [ ] **Mobile**: Implement Geolocation tagging.
- [ ] **Mobile**: Build "Pin on Plan" UI overlay.
- [ ] **Backend**: Create API for receiving batch media uploads.
- [ ] **Backend**: Link media metadata to Project/Location/Drawing.

## Dependencies
- Story 7.1 (Offline Mode - for queuing uploads)

## Risks
- **Upload Bandwidth**: Large video files failing to upload on poor connections.
