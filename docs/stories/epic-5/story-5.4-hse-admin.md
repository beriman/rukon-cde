# Story 5.4: HSE Administration (PTW & Personnel)

## 1. User Story
**As a** Sub-contractor
**I want to** submit a Permit to Work (PTW) request online
**So that** I don't need to physically chase signatures.

**As a** Safety Admin
**I want to** track expiry dates of workers' SIO/Safety Cards
**So that** no unqualified personnel operate heavy machinery.

## 2. Requirements

### 2.1 Permit to Work (PTW)
- **Types:** Cold Work, Hot Work, Confined Space, Working at Height, Excavation, Electrical.
- **Workflow:**
    1.  **Draft:** Subcon fills details (Location, Duration, Method Statement).
    2.  **Requested:** Submitted for review.
    3.  **Approved:** Safety Officer approves (Digital Signature).
    4.  **Active:** Work can start.
    5.  **Closed:** Work finished / Permit expired.
- **Validation:** Cannot approve Hot Work without Fire Watcher assigned.

### 2.2 Personnel Management
- **Worker Database:** Name, Role, Company.
- **Certifications:** SIO (Surat Izin Operator), Safety Induction Date, Medical Checkup Date.
- **Alerts:** Automated email 30 days before SIO expiry.

## 3. Implementation Checklist

### Database
- [ ] Verify `permit_to_works` table (Done in 5.1).
- [ ] Add `HsePersonnel` model? Or extend `User` model?
    - Recommendation: Separate `Worker` model for non-app users (laborers).
    - Fields: `name`, `company`, `documents` (JSON: { type: 'SIO', expiry: '2025-01-01' }).

### Backend
- [ ] **PTW Workflow:** State machine for PTW status transitions.
- [ ] **Worker CRUD:** Endpoints to manage worker database.
- [ ] **Expiry Cron Job:** Nightly job to check SIO expiries and send notifications.

### Frontend
- [ ] **PTW Wizard:** Step-by-step permit request form.
- [ ] **Approvals Inbox:** List of PTWs requiring my approval.
- [ ] **Worker Database:** Searchable table of all site workers with "Traffic Light" expiry status (Green/Yellow/Red).

## 4. Acceptance Criteria
- [ ] Hot Work Permit requires extra "Fire Watcher" field.
- [ ] Approved PTW generates a PDF with QR Code.
- [ ] System alerts if trying to add a worker with expired SIO to a PTW? (Advanced).
