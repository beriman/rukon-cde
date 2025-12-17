# Story 6.10: Classification Integration

## Description
Implement support for standard classification systems (Uniclass 2015, OmniClass) to organize BIM model elements. Users should be able to search for classification codes and assign them to model elements, facilitating better data management and 5D/QA workflows.

## User Stories
- As a BIM Manager, I want to classify model elements using Uniclass 2015 so that I can standardize data across projects.
- As a Coordinator, I want to search for classification codes by keyword (e.g., "Wall", "Beam") to quickly find the correct code.
- As a User, I want to see which elements have been classified and filter the 3D view by classification.

## Acceptance Criteria
- [ ] **Data Source**: Backend provides Uniclass 2015 and/or OmniClass tables (at least a subset/MVP).
- [ ] **Search**: User can search codes by name or number.
- [ ] **Assignment**: User can select elements in the 3D Viewer and assign a code.
- [ ] **Persistence**: Classification assignments are saved to the database per project.
- [ ] **Visualization**: Selected elements show their assigned classification in the property panel (or dedicated view).

## Technical Tasks
- [ ] **Backend**:
    - Create `ClassificationAssignment` model in Prisma.
    - Create `ClassificationService` to load/search standard tables (JSON/CSV source).
    - Create endpoints for searching codes and saving assignments.
- [ ] **Frontend**:
    - Create `ClassificationPanel` component.
    - Integrate into `IfcViewer` or `SimulationPage` sidebar.
    - Implement search and assign workflow.

## Dependencies
- Epic 1 (Core)
- Story 6.1 (Web IFC Viewer) - for element selection.

## QA Risks
- **Data Volume**: Full Uniclass tables are large; search performance must be good.
- **Mapping**: Ensuring GUIDs remain consistent for assignment (IFC re-uploads might change GUIDs if not careful, but out of scope for now).
