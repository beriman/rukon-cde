# Epic 3: Design Collaboration Suite & Model Federation

**Epic ID**: `epic-3`  
**Priority**: P1 (High)  
**Estimated Effort**: Large (8-10 weeks)  
**Target Phase**: Phase 2

## Description

Tools untuk design teams (Structure, Architecture, MEP) untuk mengelola engineering workflows: WIP privacy workspaces, reference management (XREF), design review & markup tools, model federation (merge RVT/IFC/NWD/DWG), dan clash detection.

## Business Value

- **Discipline Isolation**: Setiap discipline bekerja di workspace private hingga ready untuk share
- **Coordination**: Federal model memungkinkan clash detection sebelum construction
- **Quality**: Design review tools meningkatkan kualitas sebelum submission
- **Interoperability**: Support multi-format (proprietary + open standards)

## Functional Requirements (From PRD Section 3.2.3)

- WIP Privacy: Dedicated workspaces per discipline
- Reference Management: Load other discipline models as XREF/Link
- Design Review: Markup dan redlining tools
- Engineering Data: Support RVT, DWG, DGN, IFC formats
- Model Federation: Merge RVT/IFC/NWD/DWG into federated model
- Automated Conversion: Convert proprietary formats to IFC/GLTF untuk web viewing
- Clash Detection: Interference checks between federated models

## User Stories (High-Level)

1. **WIP Privacy Workspaces**
   - [x] System otomatis create private folder untuk setiap discipline
   - [x] Files di WIP workspace hanya visible untuk discipline team
   - [x] User dapat promote file dari WIP → Shared untuk coordination

2. **Reference Management**
   - [x] User dapat load model dari discipline lain sebagai background reference
   - [x] Reference models di-display dengan transparency/grayscale
   - [x] Changes di referenced model otomatis terdeteksi

3. **Design Review & Markup**
   - [x] User dapat add markup annotations di PDF drawings
   - [x] User dapat add comments dengan 3D viewpoint di IFC models
   - [x] Markup tools: pen, text, shapes, measurements
   - [x] Redline mode: overlay comments di atas drawings

4. **Multi-Format Support**
   - [x] System dapat upload dan preview RVT files
   - [x] System dapat upload dan preview DWG/DGN files
   - [x] System auto-detect file format dan assign correct viewer

5. **Model Federation**
   - [x] User dapat select multiple models untuk merge (RVT, IFC, NWD, DWG)
   - [x] System creates federated model dengan all selected components
   - [x] Federated model dapat di-view di web-based 3D viewer

6. **Automated Conversion**
   - [x] Background worker converts RVT → IFC
   - [x] Background worker converts all 3D formats → GLTF untuk web viewing
   - [x] User notified saat conversion complete

7. **Clash Detection**
   - [x] User dapat run clash detection pada federated model
   - [x] System detects geometric intersections between elements
   - [x] Clash results displayed dengan 3D viewpoint untuk each clash
   - [x] Clashes dapat di-export sebagai BCF format

## Acceptance Criteria

- [ ] WIP workspaces isolated per discipline dengan proper permissions
- [ ] Markup tools functional di PDF dan 3D viewers
- [ ] Model federation dapat merge ≥4 formats (RVT, IFC, NWD, DWG)
- [ ] Conversion service handles files up to 2GB
- [ ] Clash detection accuracy ≥95% (validated against Navisworks)

## Technical Notes

### Background Processing
- Use queues (Bull/BullMQ dengan Redis) untuk file conversion
- Separate worker processes untuk CPU-intensive operations
- Progress tracking untuk long-running conversions

### 3D Viewer Integration
- Primary: That Open Platform (IFC.js) untuk IFC viewing
- Secondary: Three.js untuk GLTF viewing
- PDF.js untuk 2D drawing markup

### Clash Detection Algorithm
- Bounding box intersection as first-pass filter
- Detailed geometry intersection untuk confirmed clashes
- Configurable tolerance levels

## Dependencies

- Epic 1 (Core CDE) - Required
- 3D viewer libraries (IFC.js, Three.js)
- File conversion tools (Revit API, ODA SDK)
- BCF library untuk issue export

## Risks

| Risk | Mitigation |
|------|------------|
| RVT conversion tidak 100% accurate | Fallback to IFC export, document limitations |
| Clash detection performance on large models | Spatial indexing, run as background job |
| 3D viewer browser compatibility | Test matrix, provide fallback viewers |

---

**Related Epics**: Epic 1 (dependency), Epic 6 (BIM features)  
**Updated**: 2025-12-01
