# Story 6.11: LOIN/IDS Validation

## Description
Implement functionality to define and validate Information Delivery Specifications (IDS). This allows the project team to specify what information (properties, attributes) is required for specific model elements at different stages (LOIN - Level of Information Need).

## User Stories
- As a BIM Manager, I want to define IDS rules (e.g., "All Walls must have a FireRating property") so that I can ensure data quality.
- As a Coordinator, I want to run a validation check on the model to see which elements fail compliance.
- As a User, I want to see a report of missing information to correct the model.

## Acceptance Criteria
- [x] **IDS Management**: Create, Read, Update, Delete IDS Specifications for a project.
- [x] **Rule Definition**: Define rules targeting specific IFC Classes (e.g., `IfcWall`) and requiring specific Property Sets/Properties.
- [x] **Validation Engine**: Service that accepts element data and checks against active IDS rules.
- [x] **Reporting**: Generate a validation report listing passed/failed elements.

## Technical Tasks
- [x] **Backend**:
    - Create `IdsSpecification` and `IdsRule` models in Prisma.
    - Create `LoinService` to manage specs and run validation logic.
    - Create `LoinController`.
- [x] **Frontend**:
    - Create `IdsEditor` component (form to add rules).
    - Create `ValidationPanel` (Button to run check, list to show results).
    - Integrate into `SimulationPage` (or new LOIN tab).

## Dependencies
- Epic 1 (Core)
- Story 6.1 (Viewer) - source of data to validate.

## QA Risks
- **Complexity**: IDS standard is complex (xml). We will implement a simplified JSON-based version for this story (Internal Schema), not full IDS XML export/import yet.
- **Performance**: Validating thousands of elements might be slow. Validation should be efficient or async.
