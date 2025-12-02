# Story 6.5: 4D Timeline Animation (Playback)

**Epic**: Epic 6 - Advanced BIM Simulation  
**Story ID**: `story-6.5`  
**Story Points**: 5  
**Priority**: P1 (High)  
**Sprint**: Sprint 20 (Weeks 39-40)

## User Story

**As a** Project Manager,  
**I want to** play a timeline animation of the construction process,  
**So that** I can communicate the plan to stakeholders and identify sequencing errors.

## Acceptance Criteria

### Functional
- [ ] **Playback**: Play/Pause, Speed Control (1x, 2x, 5x), Scrubber Slider
- [ ] **Visuals**:
  - **Future**: Transparent/Hidden
  - **Active**: Highlight Green (Constructing)
  - **Completed**: Original Texture
- [ ] **Planned vs Actual**: Compare Baseline vs Actual dates (Late items = Red)
- [ ] **Export**: Render animation to MP4 video

### Performance
- [ ] Smooth animation (30fps) for 5000+ elements

## Technical Tasks

### Frontend
- [ ] Implement Animation Loop in `Three.js`
- [ ] Shader modification for "Ghosting" effect (Future elements)
- [ ] `ccapture.js` or `MediaRecorder` API for video export

## Dependencies
- **Depends on**: Story 6.4 (Linking)
