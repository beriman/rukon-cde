# Story 10.2: Help Center & Video Tutorials

**Epic**: Epic 10 - User Onboarding & Training  
**Story ID**: `story-10.2`  
**Story Points**: 3  
**Priority**: P2 (Medium)  
**Sprint**: After Epic 1-3 completion

## User Story

**As a** User,  
**I want to** access help documentation and video tutorials,  
**So that** I can learn features at my own pace.

## Acceptance Criteria

### Functional
- [ ] **Help Center**: Searchable knowledge base (FAQ, How-to guides)
- [ ] **Context-Sensitive**: Page-specific help links (e.g., "How to upload" on Upload page)
- [ ] **Search**: Client-side fuzzy search (typo-tolerant)
- [ ] **Videos**: 5-10 short tutorial videos (< 3 min each)
- [ ] **Topics**: File Upload, Approvals, 3D Viewer, Progress Tracking, HSE Reporting
- [ ] **Access**: Help icon in navigation bar

### Technical
- [ ] **Platform**: Built-in (Markdown docs) or third-party (Notion, GitBook)

## Technical Tasks

### Content (Critical)
- [ ] Write help articles (Markdown) - Assign Content Writer
- [ ] Record tutorial videos (Loom/OBS) - Assign Content Writer

### Frontend
- [ ] Implement Help Center UI with Markdown renderer
- [ ] Implement Client-side search using Fuse.js

## Dependencies
- **Depends on**: Epic 1-3 (Features exist)
