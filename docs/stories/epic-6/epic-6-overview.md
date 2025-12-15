# Epic 6: Advanced BIM Features & Simulation (4D/5D)

## 1. Vision
To empower users with advanced BIM capabilities directly in the browser, including 4D scheduling, 5D cost estimation, and intelligent change analysis, democratizing high-end BIM tools without requiring expensive desktop software.

## 2. Scope
This epic covers the "Advanced Intelligence" and "Lifecycle" phases of the platform, focusing on simulation and deep data analysis.

### Stories
1.  **Story 6.1: Web IFC Viewer**
    -   High-performance 3D viewing in browser.
    -   Navigation, selection, and isolation tools.
    -   Measurement and sectioning.

2.  **Story 6.2: BCF Issue Tracking**
    -   Create and manage issues with 3D viewpoints.
    -   BCF-XML interoperability.
    -   API v2.1/v3.0 support.

3.  **Story 6.3: Smart Review & Change Analysis**
    -   2D Overlay (PDF/DWG Diff).
    -   3D Model Compare (Geometry changes).
    -   Property Diff (Metadata changes).

4.  **Story 6.4: 4D Scheduling Simulation**
    -   Import MS Project/P6/CSV schedules.
    -   Link tasks to model elements.
    -   Timeline playback animation.

5.  **Story 6.5: 5D Cost & Advanced Data**
    -   BQ Integration and Quantity Take-off.
    -   Cash Flow Simulation.
    -   Classification (Uniclass/OmniClass) and LOIN validation.

## 3. Technology Strategy
-   **3D Engine:** IFC.js (That Open Platform) / Three.js.
-   **Data Processing:** Web Workers for heavy geometry processing.
-   **BCF:** Standardized REST API.
-   **Schedule:** Server-side parsing of .mpp/.xml files.
