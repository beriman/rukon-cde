# Story 6.6: 4D Schedule Linking

**Epic**: 6. Advanced BIM Features & Simulation
**ID**: STORY-6.6
**Status**: IMPLEMENTED (Pending Verification)

## Description
Implement the ability to link external project schedules (MS Project, P6, CSV) with 3D BIM elements. This provides the data foundation for 4D simulations by mapping time-based tasks to building components.

## User Stories
- As a **Planner**, I want to import a construction schedule from a CSV file so that I don't have to manually re-enter data.
- As a **BIM Manager**, I want to select 3D elements and link them to a specific schedule task so that the system knows what to simulate.
- As a **User**, I want to see which elements are linked to a selected task to verify the connection.

## Acceptance Criteria
- [x] **Schedule Import**: User can upload a CSV file containing Task ID, Name, Start Date, End Date.
- [x] **Data Validation**: System validates the CSV format and required fields. (Implemented in Service)
- [x] **Task List UI**: Display imported tasks in a sortable/searchable list. (Implemented in Frontend)
- [x] **Visual Linking**: Select Task in list + Select Elements in Viewer -> "Link" button creates the relationship. (UI Implemented)
- [x] **Link Persistence**: Links are saved to the database and persist across sessions. (Service logic implemented)
- [x] **Link Visualization**: Selecting a task highlights the linked elements in the 3D viewer. (Mock logic in Frontend)

## Technical Tasks
- [x] **Database**: Create `Schedule`, `ScheduleTask`, and `SimulationLink` tables. (Schema updated)
- [x] **API**: Endpoint for uploading/parsing schedule file.
- [x] **API**: Endpoint for creating/deleting links.
- [x] **UI**: Schedule Management Panel in the 4D Dashboard.
- [x] **UI**: Integration with IFC Viewer for selection handling.

## QA Risks (BMad)
- **Data Integrity**: Uploading large CSVs might timeout or fail partially.
- **Mapping Errors**: User might link wrong elements; need easy way to unlink/edit.
