# Risk Assessment: Story 7.2 - Mobile Site Capture

**Date**: 2025-12-17
**Story**: [Story 7.2](docs/stories/epic-7/story-7.2-mobile-site-capture.md)

## Risk Profile

### 1. Large Media Uploads (Medium Risk)
- **Risk**: Video files failing to upload reliably over cellular networks.
- **Likelihood**: High.
- **Mitigation**: Use multipart/chunked upload or presigned S3 URLs allows resuming uploads.

### 2. Location Accuracy (Low Risk)
- **Risk**: GPS inaccuracy indoors causing confusion.
- **Mitigation**: Rely on "Pin on Plan" (Manual positioning) as primary context for indoor works. GPS is secondary.

### 3. Data Association (Medium Risk)
- **Risk**: Linking photos to outdated Drawing versions.
- **Mitigation**: Store `fileVersionId` with the pin. Warn user if drawing has been updated.

## Risk Score
**Score**: 5/10 (Medium Risk)
**Recommendation**: Proceed. Focus on robust upload mechanism.
