# Epic 4: Construction Monitoring & Document Control

**Epic ID**: `epic-4`  
**Priority**: P1 (High)  
**Estimated Effort**: Large (6-8 weeks)  
**Target Phase**: Phase 2

## Description

Comprehensive dashboard tools untuk Contractors monitor field execution: technical monitoring (Structure/Arch/MEP), document control (Shop Drawings, Method Statements, Material Approvals), commercial tracking (Procurement, BQ, Payment), project control (S-Curve), dan COBie compliance checking.

## Business Value

- **Real-Time Visibility**: Stakeholders dapat track progress secara real-time
- **Document Traceability**: Semua submittals tercatat dengan approval status
- **Financial Control**: BQ dan payment monitoring mencegah cost overruns
- **Quality Assurance**: COBie validation memastikan handover data completeness

## Functional Requirements (From PRD Section 3.2.6)

- Technical Monitoring: Track Structure, Architecture, MEP disciplines
- Document Control: Shop Drawings, Method Statements, Material Approvals
- Commercial: Procurement (Long Lead Items), BQ Monitoring, Payment & Billing
- Project Control: S-Curve, BIM Model development progress
- COBie Compliance: Health check dashboard, parameter validation
- Correspondence: Site Memos, Instruction Letters (SI) log

## User Stories (High-Level)

1. **Technical Monitoring Dashboard**
   - [ ] Contractor dapat view progress per discipline (Structure/Arch/MEP)
   - [ ] Status tracked: Not Started, In Progress, Completed, On Hold
   - [ ] Issues linked to specific work packages atau locations

2. **Shop Drawings Management**
   - [ ] Contractor dapat submit shop drawings untuk review
   - [ ] MK/Consultant dapat review dan set status (Submitted/Reviewed/Approved/RFI)
   - [ ] Notification sent saat status change
   - [ ] History log untuk semua revisions

3. **Method Statements & Material Approvals**
   - [ ] Contractor dapat upload Method Statements untuk approval
   - [ ] Material submittal log dengan sample photos dan specs
   - [ ] Approval workflow dengan comments dan conditions

4. **Procurement Tracking**
   - [ ] User dapat add Long Lead Items to tracking list
   - [ ] Delivery schedule dengan alerts untuk delays
   - [ ] Vendor information dan PO tracking

5. **BQ Monitoring**
   - [ ] BQ items imported dari Excel/CSV
   - [ ] Actual quantities dapat di-update weekly/monthly
   - [ ] Variance analysis: Planned vs Actual quantities
   - [ ] Alerts saat variance exceeds threshold

6. **Payment & Billing**
   - [ ] Progress Claims submitted monthly dengan supporting docs
   - [ ] Variation Orders (VO) tracking dengan approval workflow
   - [ ] Invoice status monitoring

7. **S-Curve Visualization**
   - [ ] Chart displays Planned vs Actual progress
   - [ ] Data sources: Schedule (Planned) + Field updates (Actual)
   - [ ] Export to PNG/PDF untuk reports

8. **COBie Health Check**
   - [ ] Dashboard shows % completion untuk COBie parameters
   - [ ] Example: "75% of Doors have FireRating filled"
   - [ ] Drill-down to see which elements missing data
   - [ ] Validation rules configurable per asset type

9. **Correspondence Log**
   - [ ] Centralized log untuk Site Memos dan Instruction Letters
   - [ ] Each entry has: Date, From, To, Subject, Attachments
   - [ ] Search and filter by date range atau keyword

## Acceptance Criteria

- [ ] Dashboard displays real-time data dengan <5 second refresh
- [ ] Shop drawings workflow supports bulk upload (≥20 files)
- [ ] S-Curve accurate dengan data dari schedule integration
- [ ] COBie validation rules cover minimum 20 asset types
- [ ] BQ variance alerts sent automatically when threshold exceeded

## Technical Notes

### Database Schema
```prisma
model ShopDrawing {
  id         String   @id @default(uuid())
  projectId  String
  fileId     String   // Reference to File table
  discipline String   // Structure, Arch, MEP
  status     ShopDrawingStatus
  submittedBy String
  reviewedBy String?
  submittedAt DateTime
  reviewedAt DateTime?
  comments   String?
}

enum ShopDrawingStatus {
  SUBMITTED
  UNDER_REVIEW
  APPROVED
  APPROVED_WITH_COMMENTS
  REVISE_AND_RESUBMIT
}

model BillOfQuantity {
  id          String  @id @default(uuid())
  projectId   String
  itemCode    String
  description String
  unit        String
  plannedQty  Float
  actualQty   Float   @default(0)
  unitPrice   Float?
}

model ProgressClaim {
  id          String   @id @default(uuid())
  projectId   String
  period      String   // "Month 1", "Month 2"
  amount      Float
  status      ClaimStatus
  submittedAt DateTime
  approvedAt  DateTime?
  attachments String[]  // File IDs
}
```

### S-Curve Data
- Integration dengan 4D schedule (Epic 6)
- Weekly data points untuk smooth curve
- Calculation: Cumulative progress %

## Dependencies

- Epic 1 (Core CDE) - Required
- Chart library (Recharts) untuk S-Curve
- Excel import/export untuk BQ data
- Schedule integration (Epic 6) untuk 4D data

## Risks

| Risk | Mitigation |
|------|------------|
| COBie validation too strict → user frustration | Configurable rules, warnings vs errors |
| BQ data integrity issues | Import validation, audit trail |
| S-Curve data staleness | Auto-refresh every 15 min, cache invalidation |

---

**Related Epics**: Epic 1 (dependency), Epic 6 (4D/5D integration)  
**Updated**: 2025-12-01
