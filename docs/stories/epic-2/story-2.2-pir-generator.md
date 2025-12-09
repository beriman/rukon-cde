# Story 2.2: PIR Generator (Project Information Requirements)

**Epic**: Epic 2 - ISO 19650-2 Strategic Planning & Delivery Tools  
**Story ID**: `story-2.2`  
**Story Points**: 5  
**Priority**: P0 (Critical)  
**Sprint**: Sprint 6 (Weeks 11-12)

## User Story

**As an** Appointing Party (Owner)  
**I want to** generate Project Information Requirements (PIR) berdasarkan OIR yang sudah ada  
**So that** saya dapat mendefinisikan kebutuhan informasi spesifik untuk project tertentu (high-level milestones & deliverables)

## Acceptance Criteria

### Functional
### Functional
- [x] User dapat memilih Project saat membuat PIR
- [ ] System automatically link PIR ke OIR yang aktif (jika ada)
- [x] Form wizard mencakup: Project Goals, Key Decision Points, Milestones
- [x] User dapat define deliverables yang dibutuhkan pada setiap Milestone (e.g., Concept Design submit LOD 200)
- [ ] System menyediakan template Bahasa Indonesia untuk PIR
- [ ] Export ke PDF dan DOCX

### Non-Functional
- [ ] Consistency check: System warns jika PIR contradict OIR goals (manual check mechanism via checklist)

## Technical Tasks

### Backend (NestJS)
### Backend (NestJS)
- [ ] Create seed data untuk PIR Templates
- [x] Update `PlanningController` untuk handle Type=PIR (Generic implementation works)
- [x] Implement logic untuk fetch OIR data saat create PIR (pre-fill fields) (Added findLatestOIR)

### Frontend (Next.js)
- [x] Create `/planning/pir` page
- [x] Build `MilestoneDefinition` form component (Integrated in Wizard)
- [x] Implement `DeliverableMapping` component (Milestone -> Deliverable) (Integrated in Wizard)
- [x] Integrate with Project Context (select project first)

## Technical Implementation Notes

### PIR Template Structure
JSON content akan memiliki section khusus untuk `key_decision_points`.

```json
{
  "key_decision_points": [
    {
      "stage": "Concept",
      "question": "Apakah desain layak secara finansial?"
    },
    {
      "stage": "Technical Design",
      "question": "Apakah compliance regulasi terpenuhi?"
    }
  ]
}
```

## Dependencies
- Story 2.1 (OIR Generator) - OIR sebaiknya ada, tapi optional
- Epic 1 (Project Management)

## Testing Strategy
- **Unit Test**: Test linkage logic between OIR and PIR
- **Manual**: Create PIR for a dummy project and verify export

## Definition of Done
- [ ] PIR Template seeds created
- [ ] Milestone & Deliverable UI working
- [ ] Export to PDF works
- [ ] Linked to specific Project ID
