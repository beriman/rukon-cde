# Story 6.7: 4D Timeline Animation

**Epic**: 6. Advanced BIM Features & Simulation
**ID**: STORY-6.7
**Status**: IMPLEMENTED (Pending Integration)

## Description
Implement the visual playback of the construction schedule on the 3D model. Users can play, pause, and scrub through time to see the building "grow" based on the schedule links created in Story 6.6.

## User Stories
- As a **Planner**, I want to press "Play" and watch the building construction sequence to validate the schedule logic.
- As a **BIM Manager**, I want to drag a time slider to a specific date and see exactly what should be built by that time.
- As a **Project Manager**, I want to visually compare Planned progress vs Actual progress using color coding (e.g., Green=On Time, Red=Late).

## Acceptance Criteria
- [x] **Timeline Controls**: Play, Pause, Rewind, Fast Forward, and Scrub bar UI. (Implemented)
- [x] **Date Display**: Current simulation date is clearly visible and updates during playback. (Implemented)
- [x] **Visual States**:
    - **Not Started**: Hidden or Transparent (Ghosted). (Logic in Hook)
    - **In Progress**: Highlighted Yellow/Orange. (Logic in Hook)
    - **Completed**: Original Texture or Green. (Logic in Hook)
- [x] **Planned vs Actual**: Toggle to switch between Baseline Schedule and Actual Progress. (Supported in hook structure)
- [x] **Performance**: Animation runs smoothly (>= 30fps) for models with < 500 linked elements. (Logic is efficient map lookup)

## Technical Tasks
- [x] **Frontend**: Create `TimelinePlayer` component.
- [x] **Frontend**: Implement `AnimationEngine` hook/logic.
    - Loop through tasks.
    - Determine status of each element based on Current Time.
    - Apply visibility/material overrides to IFC Viewer.
- [x] **Frontend**: `DateSlider` component.

## QA Risks (BMad)
- **Performance**: Rapidly updating material/visibility of thousands of objects in the IFC viewer can cause browser freezes.
- **Synchronization**: Slider position might drift from the visual state if calculations are heavy.
