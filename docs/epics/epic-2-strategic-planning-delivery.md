# Epic 2: ISO 19650-2 Strategic Planning & Delivery Tools

**Epic ID**: `epic-2`  
**Priority**: P1 (High)  
**Estimated Effort**: Large (6-8 weeks)  
**Target Phase**: Phase 2

## Description

Implementasi tools untuk Strategic Planning dan Delivery Phase sesuai ISO 19650-2, termasuk interactive generators untuk OIR/PIR/AIR/EIR, BEP/TIDP/MIDP editors dengan template bahasa Indonesia, tender module, dan approval workflows yang konfigurable.

## Business Value

- **Compliance**: Memenuhi ISO 19650-2 requirements untuk delivery phase
- **Efficiency**: Template dan generators mempercepat dokumen planning yang kompleks
- **Local Context**: Template bahasa Indonesia memudahkan adopsi di Indonesia
- **Transparency**: Approval workflows yang jelas untuk semua stakeholders

## Functional Requirements (From PRD Section 3.2)

- Strategic Planning Tools: OIR, PIR, AIR, EIR generators dengan Indonesian templates
- Tender Module: Secure data room untuk EIR dan Reference Information
- Planning Tools: Online editors untuk BEP, TIDP, MIDP dengan Gantt chart
- Mobilization: Team onboarding checklist dan capability assessment
- Approval Workflows: Configurable gateways untuk CDE state transitions

## User Stories (High-Level)

1. **OIR/PIR/AIR/EIR Generators**
   - [x] Appointing Party dapat generate Organizational Information Requirements (OIR)
   - [x] Appointing Party dapat generate Project Information Requirements (PIR)
   - [x] Appointing Party dapat generate Asset Information Requirements (AIR)
   - [x] Appointing Party dapat generate Exchange Information Requirements (EIR)
   - [x] System menyediakan template bahasa Indonesia untuk semua documents
   - [x] User dapat customize templates sesuai project needs

2. **BEP/TIDP/MIDP Editors**
   - [x] Lead Appointed Party dapat create BIM Execution Plan (BEP)
   - [x] Task team dapat create Task Information Delivery Plan (TIDP)
   - [x] Lead Appointed Party dapat create Master Information Delivery Plan (MIDP)
   - [x] Editors support rich text, tables, dan file attachments
   - [x] System dapat export ke PDF/DOCX format

3. **Gantt Chart Integration**
   - [x] TIDP/MIDP editors memiliki Gantt chart view untuk task timelines
   - [x] User dapat drag-drop tasks untuk reschedule
   - [x] System dapat import schedule dari MS Project atau Primavera P6
   - [x] Dependencies antar tasks dapat didefinisikan

4. **Tender Module**
   - [x] Appointing Party dapat create tender project
   - [x] System upload EIR ke secure data room
   - [x] Bidders dapat access data room dengan controlled permissions
   - [x] Activity logs untuk semua document access di data room

5. **Team Mobilization**
   - [x] Lead Appointed Party dapat create onboarding checklist
   - [x] Task team members dapat complete capability assessment forms
   - [x] System track completion status untuk mobilization requirements

6. **Approval Workflows**
   - [x] Admin dapat configure approval workflows per project
   - [x] Workflows define: WIP → Shared (reviewers) → Published (approvers)
   - [x] Reviewers/Approvers dapat approve/reject with comments
   - [x] Notification sent ke stakeholders saat approval status berubah

## Acceptance Criteria

- [ ] All document generators produce valid ISO 19650-2 compliant documents
- [ ] Indonesian templates tersedia dan customizable
- [ ] Gantt chart dapat handle 1000+ tasks tanpa performance issues
- [ ] Approval workflows can be configured tanpa code changes
- [ ] Tender data room access logged untuk audit

## Technical Notes

### Database Additions
```prisma
model DocumentTemplate {
  id       String @id @default(uuid())
  type     TemplateType
  language String // 'id' or 'en'
  content  Json   // Template structure
}

enum TemplateType {
  OIR
  PIR
  AIR
  EIR
  BEP
  TIDP
  MIDP
}

model ApprovalWorkflow {
  id          String @id @default(uuid())
  projectId   String
  name        String
  stages      Json // Array of approval stages
}

model WorkflowApproval {
  id         String @id @default(uuid())
  fileId     String
  workflowId String
  currentStage Int
  status     ApprovalStatus
  history    Json // Approval history
}

enum ApprovalStatus {
  PENDING
  APPROVED
  REJECTED
}
```

## Dependencies

- Epic 1 (Core CDE) - Required
- File management system untuk template storage
- PDF/DOCX export libraries

## Risks

| Risk | Mitigation |
|------|------------|
| Template complexity untuk Indonesian context | Collaborate dengan domain experts |
| Gantt chart performance | Use virtual scrolling, pagination |
| Workflow configuration too complex | Provide default templates, wizard UI |

---

**Related Epics**: Epic 1 (dependency), Epic 3, Epic 4  
**Updated**: 2025-12-01
