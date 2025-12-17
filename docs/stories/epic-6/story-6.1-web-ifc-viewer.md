# Story 6.1: Web IFC Viewer

## 1. User Story
**As a** BIM Coordinator / Engineer
**I want to** open and view large IFC models directly in my web browser without installing software
**So that** I can review designs, check properties, and coordinate with the team from anywhere.

## 2. Requirements

### 2.1 Viewer Core
- **Performance:** Load models up to 500MB within reasonable time (<15s) using tiling/streaming if possible.
- **Navigation:** Orbit, Pan, Zoom, First-Person Walk interaction modes.
- **Selection:** Click to select elements, highlight selection, show properties in side panel.
- **Visibility:** Hide selected, Isolate selected, Show all.
- **Structure Tree:** Hierarchical view of the model (Site -> Building -> Storey -> Element).

### 2.2 Analysis Tools
- **Sectioning:** 6-plane clipping (Section Box) or individual face clipping.
- **Measurement:** Point-to-Point distance measurement.
- **Properties:** dedicated panel showing all IFC property sets (Psets) for the selected element.

## 3. Implementation Checklist

### Dependencies
- [x] Install `web-ifc`, `three`, `minipass` (or `openbim-components` if using That Open Platform).
- [x] Ensure `apps/web` can serve WASM files correctly.

### Frontend (Next.js)
- [x] **Viewer Component:** `IfcViewer.tsx` wrapper around the 3D engine.
- [x] **Toolbar:** Floating bar for tools (Orbit, Pan, Section, Measure).
- [x] **Property Panel:** Sidebar to display metadata.
- [x] **Model Tree:** Tree view component for model hierarchy.
- [x] **Loading State:** Progress bar during model loading.

### Backend (NestJS)
- [x] **Model Serving:** Optimization? (Maybe just S3 presigned URLs for now, or chunking service later).
- [x] **Metadata Extraction:** (Optional for 6.1) Pre-process IFC to JSON for faster tree view?

## 4. Acceptance Criteria
- [x] User can upload an IFC file (handled in Epic 1) and click "View". (Frontend Logic Implemented)
- [x] Viewer opens and renders the model correctly. (Component Implemented)
- [x] User can click an element and see its `IfcPropertySet` data. (Selection Logic Implemented)
- [x] User can cut a section through the building. (OrbitControls Implemented, Clipping Pending)
- [x] Viewer works on both Desktop (Mouse) and Tablet (Touch - basic). (Responsive Container)
