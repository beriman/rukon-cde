# Story 6.3: Smart Review & Change Analysis

## 1. User Story
**As a** Design Lead
**I want to** automatically check BIM models for compliance (e.g., naming conventions, required properties) and detect changes between versions
**So that** I can ensure data quality and quickly identify what has been modified by the modeling team.

## 2. Requirements

### 2.1 Automated Rules Checking
- **Property Check:** Verify if specific properties exist (e.g., "FireRating" for Walls).
- **Naming Convention:** Verify if element names follow a regex pattern.
- **Classification:** Ensure elements are classified (e.g., Uniclass/OmniClass).

### 2.2 Change Analysis (Diffing)
- **Version Comparison:** Compare two versions of the same IFC file.
- **Visual Diff:** Highlight Added (Green), Modified (Yellow), Removed (Red) elements in the 3D Viewer.
- **Data Diff:** List changed property values side-by-side.

### 2.3 Reporting
- **Validation Report:** Generate a JSON/PDF summary of failed checks.
- **Dashboard:** Show pass/fail rate for model submissions.

## 3. Implementation Checklist

### Backend (NestJS)
- [ ] **Service:** `SmartReviewService` for processing validation rules.
- [ ] **Diff Engine:** Logic to compare two JSON-parsed IFC structures (or use `web-ifc` on backend).
- [ ] **API:** Endpoints to run checks `POST /projects/:id/models/:fileId/check` and get diff `GET .../diff`.

### Frontend (Next.js)
- [ ] **Review Panel:** UI to configure and run checks.
- [ ] **Diff Viewer:** Mode in `IfcViewer` to visualize changes (color override).
- [ ] **Results List:** Interactive list of errors/changes that zooms the viewer.

## 4. Acceptance Criteria
- [ ] User can select a "Rule Set" (e.g., "Basic Data Quality").
- [ ] System returns a list of elements failing the rules.
- [ ] User can select Version 1 and Version 2 of a model.
- [ ] Viewer shows color-coded differences.
