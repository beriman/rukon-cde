# Story 6.2: BCF Issue Tracking

## 1. User Story
**As a** BIM Coordinator
**I want to** create and manage issues (BCF) linked to specific 3D model elements and viewpoints
**So that** I can assign responsibility, track resolution, and ensure design coordination problems are fixed.

## 2. Requirements

### 2.1 BCF Core Features (API v2.1/v3.0)
- **Topics:** Create, Read, Update, Delete (CRUD) issues. Fields: Title, Description, Priority, Status, Assignee, Labels.
- **Viewpoints:** Capture camera position, direction, and selected/hidden elements.
- **Comments:** Threaded discussions on an issue.
- **Snapshots:** Image preview of the issue (base64 or URL).

### 2.2 Integration
- **Web Viewer:** Users can click "Add Issue" in the 3D viewer (Story 6.1).
- **Viewpoint Restoration:** Clicking an issue in the list moves the camera to the saved viewpoint in the 3D viewer.
- **Interoperability:** Export/Import `.bcfzip` files for Revit/Navisworks/Solibri.

## 3. Implementation Checklist

### Backend (NestJS)
- [ ] **Module:** `BcfModule` (or `IssuesModule`).
- [ ] **Schema:** Prisma models for `Topic`, `Comment`, `Viewpoint`, `Selection`, `Visibility`.
- [ ] **API:** REST endpoints compliant with buildingSMART BCF API.
- [ ] **File Handling:** Processing `.bcfzip` (XML parsing + Image extraction).

### Frontend (Next.js)
- [ ] **Issue Panel:** Collapsible sidebar in the 3D Viewer page.
- [ ] **Creation Form:** Form to add title, priority, standard BCF fields.
- [ ] **Capture Tool:** Button to grab current camera state and screenshot from `IfcViewer`.
- [ ] **List View:** Filterable list of issues for the current project/model.

## 4. Acceptance Criteria
- [ ] User can create an issue while looking at the 3D model.
- [ ] The issue saves the current camera angle and selected elements.
- [ ] Another user can open the issue and click "Fly to" to restore the view.
- [ ] BCF-XML export produces a valid file that opens in Solibri (optional verification).
