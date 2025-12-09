# Story 5.3: Operational Safety (Inspections & Meetings)

## 1. User Story
**As a** Safety Inspector
**I want to** complete digital inspection checklists for equipment and site conditions
**So that** I can ensure compliance without using paper forms.

**As a** Site Manager
**I want to** log Toolbox Meetings and Safety Inductions
**So that** I have proof of safety communication and attendance.

## 2. Requirements

### 2.1 Digital Inspections
- **Types:**
    - Heavy Equipment (Excavator, Crane) - Daily/Weekly.
    - Scaffolding - Weekly/Before Use.
    - Fire Extinguisher - Monthly.
    - Electrical Tools.
- **Format:** Checklist (Pass/Fail/NA) + Photo evidence for Fails.
- **Outcome:** If Critical Fail -> Auto-generate "Unsafe Condition" Incident? (Nice to have).

### 2.2 Meeting Logs (TBM/Induction)
- **Toolbox Meeting (TBM):** Topic, date, time, photo of activity.
- **Attendance:** List of attendees (Search user or manual entry).
- **Safety Induction:** Record of new workers inducted.

## 3. Implementation Checklist

### Database
- [ ] Create `InspectionForm` model (Header).
- [ ] Create `InspectionItem` model (Lines: Question, Result, Photo).
- [ ] Create `SafetyMeeting` model.
    - `id`, `project_id`, `type` (TBM/Induction), `topic`, `date`, `attendees` (JSON or Relation).

### Backend
- [ ] **Inspections:** Endpoints to submit full checklist.
- [ ] **Meetings:** Endpoint to log meeting and upload attendance sheet photo.

### Frontend
- [ ] **Inspection Library:** List of available templates (Excavator, Scaffolding, etc.).
- [ ] **Mobile Inspection View:** Mobile-optimized form for ticking checkboxes.
- [ ] **Meeting Log Form:** Simple form to record TBM topic and upload photo.

## 4. Acceptance Criteria
- [ ] Inspector can select "Excavator Inspection" and submit a report.
- [ ] Failed items require a comment or photo.
- [ ] Supervisor can view a calendar of TBMs held this month.
