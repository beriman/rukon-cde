# Epic 6: Advanced BIM Features & Simulation (4D/5D)

**Epic ID**: `epic-6`  
**Priority**: P2 (Medium - Advanced)  
**Estimated Effort**: Large (8-10 weeks)  
**Target Phase**: Phase 3

## Description

Advanced BIM capabilities: web-based IFC viewer, BCF issue tracking, Smart Review & Change Analysis (2D/3D diff), 4D scheduling simulation, 5D cost estimation, LOIN/IDS validation, dan classification systems integration (Uniclass, OmniClass).

## Business Value

- **Visualization**: Web-based 3D viewing tanpa software installation
- **Change Control**: Instant detection of design changes between versions
- **Schedule Integration**: Visual 4D simulation untuk better planning
- **Cost Control**: 5D integration ties budget to model elements
- **Compliance**: LOIN validation ensures information completeness

## Functional Requirements (From PRD)

### 3.2.8 Smart Review & Change Analysis
- 2D Overlay (Smart Diff) for PDF/DWG drawings
- 3D Model Compare: Added/Removed/Modified elements detection
- Property Diff: Side-by-side metadata comparison
- Slider Mode: Before/After visual sweep

### 3.2.9 4D & 5D Simulation
- 4D: Schedule import (MS Project, P6, CSV), ID-based linking, timeline animation
- 5D: BQ integration, Cash flow simulation, Quantity take-off

### 3.4 Open BIM Support
- IFC Viewer (web-based 3D)
- BCF Server (issue tracking API v2.1/v3.0)

### 3.8 Technical Enablers
- Classification: Uniclass 2015, OmniClass dictionaries
- LOIN Manager: IDS editor and validator

## User Stories (High-Level)

1. **Web IFC Viewer**
   - [ ] User dapat view IFC file di browser (no plugins)
   - [ ] Viewer features: Orbit, Pan, Zoom, Section cuts
   - [ ] Element selection dengan property panel
   - [ ] Measurement tools (distance, area, volume)
   - [ ] Isolate/Hide elements by discipline atau type

2. **BCF Issue Tracking**
   - [ ] User dapat create issue dengan 3D viewpoint
   - [ ] Issues linked to specific model elements
   - [ ] BCF XML export/import untuk interoperability
   - [ ] API support BCF v2.1 dan v3.0
   - [ ] Integration dengan external tools (Revit, Solibri)

3. **2D Smart Diff**
   - [ ] User dapat compare 2 versions of PDF/DWG drawing
   - [ ] Overlay mode dengan color coding (Red=Deleted, Green=Added)
   - [ ] Side-by-side view mode
   - [ ] Export comparison report

4. **3D Model Compare**
   - [ ] User dapat select 2 model versions untuk compare
   - [ ] System highlights: Added (Green), Removed (Red), Modified (Yellow) elements
   - [ ] Filter results by change type
   - [ ] Generate change report dengan count summaries

5. **Property Diff**
   - [ ] Display parameter changes in table format
   - [ ] Example: "FireRating: 60min → 120min"
   - [ ] Highlight critical parameter changes

6. **4D Schedule Linking**
   - [ ] Import schedule dari MS Project (.mpp), P6 (.xml), atau CSV
   - [ ] CSV template dengan columns: Task ID, Element IDs, Start Date, End Date
   - [ ] User maps schedule tasks to 3D model elements via IDs
   - [ ] Timeline playback simulation

7. **4D Timeline Animation**
   - [ ] Play/Pause controls dengan date slider
   - [ ] Elements appear/fade based on construction sequence
   - [ ] Planned vs Actual mode (late items colored Red)
   - [ ] Export animation to video (MP4)

8. **5D BQ Integration**
   - [ ] Link BQ items to 3D model element categories
   - [ ] Automatic quantity take-off dari model
   - [ ] Cost per element calculated from BQ unit prices

9. **Cash Flow Simulation**
   - [ ] Combine 4D schedule + 5D cost data
   - [ ] Chart: Projected spending per month
   - [ ] "What-if" scenarios untuk schedule changes

10. **Classification Integration**
    - [ ] Element classification dengan Uniclass 2015 codes
    - [ ] Alternative: OmniClass codes
    - [ ] Auto-suggest classification based on IFC type
    - [ ] Search/filter elements by classification

11. **LOIN/IDS Validation**
    - [ ] IDS (Information Delivery Specification) editor
    - [ ] Define required parameters per asset type
    - [ ] Validate IFC model against IDS rules
    - [ ] Report missing or incorrect attributes

## Acceptance Criteria

- [ ] IFC viewer can load models up to 500MB dalam <10 seconds
- [ ] 3D diff algorithm accuracy ≥95% (validated manually)
- [ ] 4D simulation smooth playback untuk 5000+ elements
- [ ] BCF API compatible dengan standard tools (Solibri, Revit plugins)
- [ ] LOIN validation covers EN 17412-1 requirements

## Technical Notes

### 3D Libraries
- **IFC.js (That Open Platform)**: Primary IFC viewer
- **Three.js**: Base 3D engine
- **Potree**: Point cloud viewer (future)

### 4D/5D Backend
- Schedule parser libraries for .mpp, .xml, .csv
- Element ID mapping database (Task ↔ IFC GUID)
- Cost calculation engine

### BCF Server
- REST API endpoints per BCF API spec
- BCF XML parsing/generation
- Viewpoint storage (camera position, clipping planes)

## Dependencies

- Epic 1 (Core CDE) - Required
- Epic 3 (Model Federation) untuk multi-model support
- Epic 4 (Construction Monitoring) untuk BQ data

## Risks

| Risk | Mitigation |
|------|------------|
| IFC viewer performance on complex models | Level of Detail (LOD) rendering, progressive loading |
| 4D schedule data quality issues | Import validation, data cleaning tools |
| Change detection false positives | Tolerance settings, manual review workflow |

---

**Related Epics**: Epic 1, Epic 3, Epic 4  
**Updated**: 2025-12-01
