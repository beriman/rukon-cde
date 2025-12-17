# Test Design: Story 7.2 - Mobile Site Capture

**Story**: [Story 7.2](docs/stories/epic-7/story-7.2-mobile-site-capture.md)

## Test Strategy

### 1. Unit Tests (Backend)
- `SiteCaptureService.create`: Verify metadata linkage (GPS, Project, File/Drawing).
- `SiteCaptureService.getObservations`: filtering by drawing/location.

### 2. Integration Tests
- `POST /site-capture`: Upload multipart file + JSON metadata.
- Verify `File` record created (the photo/video).
- Verify `SiteObservation` (or `DrawingMarkup`) record created linked to the file.
- Verify GPS coordinates stored correctly.

### 3. Manual Tests
- Mobile upload queue is out of scope for now (backend only).
- Postman test: Upload image with `x: 100, y: 200` and `fileId` (Plan).

## Priority
- **P0**: Image upload & storage (S3 link).
- **P0**: Linking to Drawing (Pin).
- **P1**: GPS Metadata.
