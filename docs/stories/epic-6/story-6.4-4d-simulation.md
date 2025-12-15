# Story 6.4: 4D Simulation

**Epic**: 6. Advanced BIM Features & Simulation
**ID**: STORY-6.4
**Status**: PLANNING

## Description
Implement 4D Simulation capabilities by linking 3D BIM elements with project schedule data (Gantt charts). This allows users to visualize the construction sequence over time.

## User Stories
- As a **Construction Manager**, I want to play a timeline simulation to see the building construction sequence.
- As a **Planner**, I want to link Schedule Tasks to BIM Elements so the simulation is accurate.
- As a **Stakeholder**, I want to pause the simulation at a specific date to see the expected progress.

## Acceptance Criteria
- [ ] **Gantt Chart View**: Display project schedule (from Epic 2/3) in the BIM Dashboard.
- [ ] **Element Linking**: UI to select a Schedule Task and assign 3D Elements (GUIDs) to it.
- [ ] **Simulation Player**: Controls to Play, Pause, Rewind, and scrub through the timeline.
- [ ] **Visual Updates**: Elements appear/disappear or change color based on their schedule status vs. simulation time.
- [ ] **Data Persistence**: Store Task-to-Element links in the database.

## Technical Tasks
- [ ] **Database**: Create `SimulationLink` model (taskId, elementId/guids).
- [ ] **Backend**: Create `SimulationModule` to manage links.
- [ ] **Frontend**:
    - [ ] Add `GanttPanel` to `IfcViewer`.
    - [ ] Implement `TimelinePlayer` control.
    - [ ] Implement 4D visualization logic (filtering elements by date).

## QA Risks (BMad)
- **Performance**: animating visibility of thousands of elements might lag.
- **Data Integrity**: Schedule tasks might change, breaking links.

## Quality Gate
- [ ] Unit Tests passed
- [ ] Integration Tests passed
- [ ] QA Score > 90
