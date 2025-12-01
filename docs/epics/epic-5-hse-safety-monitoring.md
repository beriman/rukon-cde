# Epic 5: HSE Management & Safety Monitoring (K3)

**Epic ID**: `epic-5`  
**Priority**: P2 (Medium)  
**Estimated Effort**: Medium (4-6 weeks)  
**Target Phase**: Phase 3

## Description

Complete digitization of Health, Safety, and Environment (HSE/K3) operations: Safety dashboard dengan performance metrics, incident management, operational safety (inspections, meetings), HSE administration (PTW, documentation), dan emergency & audit management untuk ISO 45001/9001/14001.

## Business Value

- **Safety Culture**: Digital tracking meningkatkan accountability dan awareness
- **Compliance**: Memenuhi requirements ISO 45001, 9001, 14001, 31000
- **Risk Prevention**: Early detection dan tracking high-risk activities
- **Audit Ready**: Semua HSE records terorganisir dan searchable

## Functional Requirements (From PRD Section 3.2.7)

- Safety Dashboard: Manhours, LTI Free Days, Incident Rates calculation
- Incident Management: Reporting dan resolution tracking (First Aid → Fatality)
- Operational Safety: Digital checklists, meeting logs, risk control
- HSE Administration: PTW, Documentation (SOP, JSA, MSDS), Personnel tracking
- Emergency & Audit: Emergency plans, drill logs, internal audit management

## User Stories (High-Level)

1. **Safety Dashboard**
   - [ ] Dashboard displays Total Manhours (current period)
   - [ ] LTI Free Days counter (Days/Hours)
   - [ ] Incident rate calculations: Fatality Rate, LTI Rate, TRI Rate
   - [ ] Comparison: Current vs Previous Best performance

2. **Incident Reporting**
   - [ ] User dapat report incidents: First Aid, MTI, RWI, LTI, Fatality
   - [ ] Additional types: Illness, Vehicle Incident, Spill, Near Miss, Unsafe Acts
   - [ ] Form includes: Date, Time, Location, Description, Photos, Witnesses
   - [ ] Auto-categorization by severity

3. **Incident Investigation**
   - [ ] Investigation team assigned untuk LTI and above
   - [ ] Root Cause Analysis tools (5 Whys, Fishbone diagram)
   - [ ] Corrective Actions tracked to completion
   - [ ] Lessons Learned repository

4. **Safety Inspections**
   - [ ] Pre-Mobilization checklist (equipment, PPE, permits)
   - [ ] Monthly inspection schedules: Heavy Equipment, Lifting Gear, Vehicles, Tools
   - [ ] Digital forms dengan photo capture
   - [ ] Non-conformance tracking dengan corrective actions

5. **Safety Meetings**
   - [ ] Logs untuk TBM (Toolbox Meeting), Safety Induction
   - [ ] General Safety Talk, Weekly Safety Meetings
   - [ ] P2K3 Committee meeting minutes
   - [ ] Attendance tracking dengan e-signatures

6. **Permit to Work (PTW)**
   - [ ] Digital PTW issuance workflow
   - [ ] Types: Hot Work, Confined Space, Work at Height, Excavation
   - [ ] Multi-level approval requirements
   - [ ] Active permit dashboard dengan expiry tracking

7. **HSE Documentation**
   - [ ] Central repository: SOP HSE, JSA, SDS/MSDS, Legal Requirements
   - [ ] Version control untuk semua documents
   - [ ] Search by hazard type atau work activity

8. **Personnel Management**
   - [ ] Safety Card tracking (expiry dates)
   - [ ] Qualifications dan Certifications database
   - [ ] Training history per person
   - [ ] Competency matrix

9. **Emergency Management**
   - [ ] Emergency Response Plans upload dan versioning
   - [ ] Drill/Simulation logs dengan evaluation results
   - [ ] Emergency Organization Charts
   - [ ] Emergency Contact lists

10. **Internal Audits**
    - [ ] Audit schedule for ISO 45001, 9001, 14001, 31000
    - [ ] Audit checklists dan findings tracking
    - [ ] Corrective Action Plan (CAP) monitoring
    - [ ] Audit reports generation

## Acceptance Criteria

- [ ] Incident rates calculated accurately per OSHA standards
- [ ] PTW workflow supports multi-approver chains
- [ ] Safety inspections dapat completed offline (mobile support)
- [ ] Audit trails untuk all HSE-critical actions
- [ ] Reports can export to Excel/PDF for regulatory submission

## Technical Notes

### Database Schema
```prisma
model Incident {
  id          String   @id @default(uuid())
  projectId   String
  type        IncidentType
  severity    Severity
  date        DateTime
  location    String
  description String
  reportedBy  String
  witnesses   String[]
  photos      String[]  // S3 keys
  rootCause   String?
  corrective Actions Json?
  status      IncidentStatus
}

enum IncidentType {
  FIRST_AID
  MTI
  RWI
  LTI
  FATALITY
  ILLNESS
  VEHICLE_INCIDENT
  SPILL
  NEAR_MISS
  UNSAFE_ACT
}

model PermitToWork {
  id          String   @id @default(uuid())
  projectId   String
  type        PTWType
  workDescription String
  location    String
  startDate   DateTime
  endDate     DateTime
  approvals   Json     // Array of approvers
  status      PTWStatus
}

enum PTWType {
  HOT_WORK
  CONFINED_SPACE
  WORK_AT_HEIGHT
  EXCAVATION
  ELECTRICAL
}
```

### Calculations
- **Fatality Rate** = (Fatalities / Manhours) × 1,000,000
- **LTI Rate** = (LTI / Manhours) × 1,000,000
- **TRI Rate** = (Total Recordable Incidents / Manhours) × 1,000,000

## Dependencies

- Epic 1 (Core CDE) - Required
- Mobile app (Epic 7) untuk field inspections
- Reporting engine (Epic 4)

## Risks

| Risk | Mitigation |
|------|------------|
| User resistance to digital forms | Training, demonstrate time savings |
| Data privacy concerns for personnel records | Encryption, access controls, GDPR compliance |

---

**Related Epics**: Epic 1 (dependency), Epic 7 (Mobile app)  
**Updated**: 2025-12-01
