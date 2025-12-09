# Story 5.5: Emergency Response & Audits

## 1. User Story
**As a** Safety Manager
**I want to** maintain an up-to-date Emergency Response Plan (ERP) and contact list
**So that** everyone knows what to do in a crisis.

**As a** Quality/HSE Auditor
**I want to** record findings from Internal Audits
**So that** non-conformances are tracked to closure.

## 2. Requirements

### 2.1 Emergency Response
- **ERP Repository:** Dedicated folder for ERP documents (PDFs).
- **Emergency Contacts:** List of Key Personnel (Project Manager, Safety Manager, Ambulance, Fire, Police) with click-to-call buttons on mobile.
- **Drill Logs:** Record of fire drills (Date, Scenario, Duration, Participants, Photo).

### 2.2 Audit Management (ISO 19011)
- **Audit Schedule:** Calendar of upcoming audits.
- **Findings (NCR):** Non-Conformance Reports.
    - Major / Minor / Observation.
    - Linked to specific ISO clause (e.g., "4.2 Understanding needs of interested parties").
- **Closure:** Evidence of rectification required to close NCR.

## 3. Implementation Checklist

### Database
- [ ] Create `HseEmergencyContact` model.
- [ ] Create `HseAudit` and `HseAuditFinding` models.

### Backend
- [ ] **Drill Logs:** Simple CRUD.
- [ ] **Audits:** Workflow for NCR (Open -> Responded -> Verified -> Closed).

### Frontend
- [ ] **Emergency Button:** A "SOS" or Red button in the app header (Mobile) to show contacts instantly.
- [ ] **Audit Dashboard:** Summary of Open vs Closed NCRs.
- [ ] **Drill History:** List of past drills.

## 4. Acceptance Criteria
- [ ] Emergency Contacts are accessible offline (PWA feature - future).
- [ ] Audit NCR cannot be closed without "Verification Evidence" (Photo/Doc).
