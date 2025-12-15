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
- [x] Create `InspectionForm` model (Header).
- [x] Create `InspectionItem` model (Lines: Question, Result, Photo).
- [x] Create `SafetyMeeting` model.
    - `id`, `project_id`, `type` (TBM/Induction), `topic`, `date`, `attendees` (JSON or Relation).

### Backend
- [x] **Inspections:** Endpoints to submit full checklist.
- [x] **Meetings:** Endpoint to log meeting and upload attendance sheet photo.

### Frontend
- [x] **Inspection Library:** List of available templates (Excavator, Scaffolding, etc.).
- [x] **Mobile Inspection View:** Mobile-optimized form for ticking checkboxes.
- [x] **Meeting Log Form:** Simple form to record TBM topic and upload photo.

## 4. Acceptance Criteria
- [x] Inspector can select "Excavator Inspection" and submit a report.
- [x] Failed items require a comment or photo.
- [x] Supervisor can view a calendar of TBMs held this month.
