# Story 6.5: 5D Cost & Data

## Description
Integrate Cost Data (5D) with the BIM Model. This involves linking Bill of Quantities (BoQ) items to 3D elements to visualize cost distribution and generate cost reports based on model selection.

## User Stories
- As a Quantity Surveyor, I want to link BoQ items to BIM elements so I can track the cost of specific building parts.
- As a Project Manager, I want to view the total cost of selected elements in the 3D viewer.
- As a User, I want to see a "Cost Heatmap" where elements are colored by their unit cost.

## Acceptance Criteria
- [ ] Backend: `BillOfQuantities` and `BoQItem` models exist and can be linked to `File` (Model).
- [ ] Backend: API to link `BoQItem` to `ElementGUID`.
- [ ] Frontend: `CostPanel` in Viewer to:
    - Import/View BoQ.
    - Select Element -> Assign BoQ Item.
    - Select BoQ Item -> Select linked Elements.
- [ ] Frontend: "5D View Mode" in Viewer:
    - Colored heatmap (High cost = Red, Low = Green).
    - Tooltip shows cost data.

## Technical Tasks
- [ ] **Database**:
    - Update `BillOfQuantities` schema if needed (Epic 4 might have partial).
    - Create `CostLink` or add `elementId` to `BoQItem`? Or use `SimulationLink` equivalent?
    - Better: `BoQItem` has `elementGuid` (one-to-many? or many-to-many).
    - Let's assume One BoQ Item can target Multiple Elements (e.g. "Concrete C30" applies to 50 columns).
    - Create `CostMapping` table: `boqItemId` <-> `elementGuid`.
- [ ] **Backend**:
    - `CostModule`, `CostService`, `CostController`.
    - CSV/Excel Import for BoQ (Simple version).
- [ ] **Frontend**:
    - `CostPanel` component.
    - Integration with `IfcViewer` (Heatmap logic using `createSubset` or `setColor`).

## QA Risks
- **Data Accuracy**: Mismatched GUIDs or Units.
- **Performance**: Heatmap for thousands of elements.
