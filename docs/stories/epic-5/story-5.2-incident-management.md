# Story 5.2: Incident Management System

## 1. User Story
**As a** Site Worker / Supervisor
**I want to** easily report safety incidents (Near Miss, Injury, Property Damage) via a digital form
**So that** the HSE team can be notified immediately and start an investigation.

**As a** Safety Officer
**I want to** manage the investigation process (Root Cause Analysis, Corrective Actions)
**So that** I can prevent reoccurrence and close the incident formally.

## 2. Requirements (ISO 45001)

### 2.1 Incident Reporting (The "What")
- **Types:** First Aid, Medical Treatment (MTI), Restricted Work (RWI), Lost Time (LTI), Fatality, Near Miss, Unsafe Act, Unsafe Condition, Property Damage, Environmental Spill.
- **Data Points:** Date, Time, Location (Project Area), Description, Photos (Multiple), Immediate Action Taken, Witnesses.
- **Workflow:** Report Submitted -> Notification to HSE Admin -> Status "OPEN".

### 2.2 Investigation (The "Why")
- **Root Cause Analysis (RCA):** Text field or 5-Why template.
- **Contributing Factors:** Unsafe condition, Lack of training, PPE failure, etc.
- **Corrective Actions (CAPA):** List of actions to take.
    - Action Item
    - Assigned To
    - Due Date
    - Status (Pending/Done)

### 2.3 Workflow States
1.  **OPEN:** New report.
2.  **INVESTIGATING:** RCA in progress.
3.  **PENDING ACTION:** Investigation done, waiting for CAPA completion.
4.  **CLOSED:** All done and verified.

## 3. Implementation Checklist

### Database (Prisma/Supabase)
- [ ] Verify `incidents` table supports `photos[]`, `witnesses[]`.
- [ ] Add `IncidentAction` model for Corrective Actions (One-to-Many).
    - `id`, `incidentId`, `description`, `assigneeId`, `dueDate`, `completedDate`, `status`.

### Backend (NestJS)
- [ ] **Create Incident:** Endpoint `POST /projects/:id/incidents` handling file uploads (S3).
- [ ] **Update Incident:** Endpoint to add RCA and change status.
- [ ] **Manage Actions:** CRUD for Corrective Actions.
- [ ] **Notifications:** Email/In-app alert to Safety Manager on new LTI/High severity.

### Frontend (Next.js)
- [ ] **Active Incidents List:** Table with Status Badges and Severity Colors.
- [ ] **Report Form:** Wizard-style form:
    1.  Basic Info (Type, Date, Location)
    2.  Description & Witnesses
    3.  Photo Upload (Drag & Drop)
- [ ] **Investigation View:** Admin-only view to enter Root Cause and add Actions.
- [ ] **Action Tracker:** Widget to see open corrective actions.

## 4. Acceptance Criteria
- [ ] User can submit a "Near Miss" with a photo.
- [ ] Safety Officer receives notification.
- [ ] Safety Officer can add 3 corrective actions to an incident.
- [ ] Incident cannot be "Closed" if Corrective Actions are pending.
