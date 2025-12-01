# Epic Overview - Rukon CDE Platform

Dokumen ini memberikan overview semua Epics yang telah didefinisikan dari PRD.

## Epic Summary Table

| Epic ID | Epic Name | Priority | Size | Phase | Dependencies |
|---------|-----------|----------|------|-------|--------------|
| [Epic 1](file:///d:/Coding/Rukon/docs/epics/epic-1-core-cde-foundation.md) | Core CDE Foundation & Multi-Tenancy | P0 (Critical) | Large (8-12w) | MVP (Phase 1) | None |
| [Epic 2](file:///d:/Coding/Rukon/docs/epics/epic-2-strategic-planning-delivery.md) | ISO 19650-2 Strategic Planning & Delivery | P1 (High) | Large (6-8w) | Phase 2 | Epic 1 |
| [Epic 3](file:///d:/Coding/Rukon/docs/epics/epic-3-design-collaboration-federation.md) | Design Collaboration Suite & Model Federation | P1 (High) | Large (8-10w) | Phase 2 | Epic 1 |
| [Epic 4](file:///d:/Coding/Rukon/docs/epics/epic-4-construction-monitoring.md) | Construction Monitoring & Document Control | P1 (High) | Large (6-8w) | Phase 2 | Epic 1 |
| [Epic 5](file:///d:/Coding/Rukon/docs/epics/epic-5-hse-safety-monitoring.md) | HSE Management & Safety Monitoring (K3) | P2 (Medium) | Medium (4-6w) | Phase 3 | Epic 1 |
| [Epic 6](file:///d:/Coding/Rukon/docs/epics/epic-6-advanced-bim-simulation.md) | Advanced BIM Features & Simulation (4D/5D) | P2 (Medium) | Large (8-10w) | Phase 3 | Epic 1, 3, 4 |
| [Epic 7](file:///d:/Coding/Rukon/docs/epics/epic-7-mobile-ai-assistant.md) | Mobile Field App & AI Assistant | P2 (Medium) | Medium (5-7w) | Phase 3-4 | Epic 1, 4, 6 |
| [Epic 8](file:///d:/Coding/Rukon/docs/epics/epic-8-security-compliance-lifecycle.md) | Security, Compliance & Asset Lifecycle | P2 (Medium) | Medium (4-6w) | Phase 3-4 | Epic 1, 4, 6 |

**Total Estimated Effort**: ~50-62 weeks (Individual epic durations, not accounting for parallel work)

## Epic Descriptions

### Phase 1: MVP (The "Compliant Drive")

#### [Epic 1: Core CDE Foundation & Multi-Tenancy](file:///d:/Coding/Rukon/docs/epics/epic-1-core-cde-foundation.md)
**Scope**: Authentication, Multi-tenancy, Projects, Files, CDE States, Smart Versioning, Naming Convention

**Why First**: Semua Epic lain bergantung pada fondasi ini. Tanpa Core CDE, tidak ada platform untuk dibangun.

**Key Deliverables**:
- User registration & login (JWT-based)
- Organization & Project management
- File upload/download dengan S3 storage
- CDE workflow: WIP → Shared → Published → Archived
- Version stacking (ACC-style)
- Naming convention validator
- Audit trail

---

### Phase 2: Process & Planning

#### [Epic 2: ISO 19650-2 Strategic Planning & Delivery](file:///d:/Coding/Rukon/docs/epics/epic-2-strategic-planning-delivery.md)
**Scope**: OIR/PIR/AIR/EIR generators, BEP/TIDP/MIDP editors, Tender module, Approval workflows

**Business Value**: Compliance dengan ISO 19650-2, Indonesian templates memudahkan adopsi lokal.

**Key Deliverables**:
- Document generators untuk strategic planning
- Gantt chart integration untuk TIDP/MIDP
- Tender data room
- Configurable approval workflows

#### [Epic 3: Design Collaboration Suite & Model Federation](file:///d:/Coding/Rukon/docs/epics/epic-3-design-collaboration-federation.md)
**Scope**: WIP workspaces, XREF management, Design review & markup, Model federation, Clash detection

**Business Value**: Koordinasi antar discipline, early clash detection saves rework costs.

**Key Deliverables**:
- Discipline-isolated WIP folders
- Markup tools (2D & 3D)
- Multi-format merging (RVT/IFC/NWD/DWG)
- Automated format conversion
- Web-based clash detection

#### [Epic 4: Construction Monitoring & Document Control](file:///d:/Coding/Rukon/docs/epics/epic-4-construction-monitoring.md)
**Scope**: Technical monitoring, Shop Drawings workflow, BQ tracking, S-Curve, COBie validation, Correspondence log

**Business Value**: Real-time visibility untuk progress, financial control, quality assurance.

**Key Deliverables**:
- Shop Drawing approval workflows
- BQ variance monitoring
- S-Curve visualization
- COBie health check dashboard
- Payment & billing tracking

---

### Phase 3: Advanced Intelligence

#### [Epic 5: HSE Management & Safety Monitoring (K3)](file:///d:/Coding/Rukon/docs/epics/epic-5-hse-safety-monitoring.md)
**Scope**: Safety dashboard, Incident management, PTW, Inspections, Emergency & Audits

**Business Value**: Compliance ISO 45001/9001/14001, improved safety culture, audit-ready records.

**Key Deliverables**:
- Safety metrics dashboard (LTI Free Days, Incident Rates)
- Digital incident reporting
- Permit to Work system
- Safety inspection checklists
- Internal audit management

#### [Epic 6: Advanced BIM Features & Simulation (4D/5D)](file:///d:/Coding/Rukon/docs/epics/epic-6-advanced-bim-simulation.md)
**Scope**: IFC Viewer, BCF issue tracking, 2D/3D change detection, 4D scheduling, 5D cost integration, LOIN validation

**Business Value**: Instant change detection, visual schedule simulation, cost control through model linkage.

**Key Deliverables**:
- Web-based IFC viewer
- BCF API v2.1/v3.0 support
- Smart Diff (2D overlay + 3D compare)
- 4D timeline animation
- 5D cash flow simulation
- Classification (Uniclass, OmniClass)
- LOIN/IDS validator

---

### Phase 4: Lifecycle & Twin

#### [Epic 7: Mobile Field App & AI Assistant](file:///d:/Coding/Rukon/docs/epics/epic-7-mobile-ai-assistant.md)
**Scope**: Offline-first mobile app, AI RAG assistant, Meeting management, Automated reporting

**Business Value**: Field productivity dengan offline access, AI reduces time spent searching for information.

**Key Deliverables**:
- React Native/Flutter mobile app
- Offline sync mechanism
- Site photo capture dengan GPS tagging
- QR code scanning
- AI document search (RAG)
- Auto-generated Weekly/Monthly reports

#### [Epic 8: Security, Compliance & Asset Lifecycle](file:///d:/Coding/Rukon/docs/epics/epic-8-security-compliance-lifecycle.md)
**Scope**: Sensitivity triage, Redaction, Enhanced audit trail, Asset Twin (AIM), Maintenance scheduler, Risk register, HazMat mapping

**Business Value**: ISO 19650-3/5/6/7 compliance, smooth handover to operations, circular economy planning.

**Key Deliverables**:
- Sensitivity classification system
- Redaction tools (2D & 3D)
- Asset Information Model (AIM)
- Maintenance scheduler dengan work orders
- Handover wizard (PIM → AIM)
- Visual safety tagging
- Material passport untuk deconstruction

---

## Epic Dependencies Graph

```
Epic 1 (Core CDE)
  ├─→ Epic 2 (Strategic Planning)
  ├─→ Epic 3 (Design Collaboration)
  │     └─→ Epic 6 (Advanced BIM)
  ├─→ Epic 4 (Construction Monitoring)
  │     ├─→ Epic 6 (4D/5D integration)
  │     └─→ Epic 7 (Mobile reporting)
  ├─→ Epic 5 (HSE)
  │     └─→ Epic 7 (Mobile inspections)
  ├─→ Epic 6 (Advanced BIM)
  │     └─→ Epic 8 (Visual safety)
  └─→ Epic 8 (Security & AIM)
```

## ISO 19650 Coverage Matrix

| ISO Part | Epic(s) | Coverage |
|----------|---------|----------|
| ISO 19650-1 | Epic 1 | ✅ Core CDE workflows, Information containers |
| ISO 19650-2 | Epic 2, 3, 4 | ✅ Delivery phase: OIR/EIR, BEP, Collaboration, Documentation |
| ISO 19650-3 | Epic 8 | ✅ Operational phase: AIM, Maintenance |
| ISO 19650-4 | Epic 6 | ✅ Information exchange: Quality gates, BCF |
| ISO 19650-5 | Epic 8 | ✅ Security: Triage, Redaction, Audit |
| ISO 19650-6 | Epic 5, 8 | ✅ Health & Safety: Risk register, Visual safety |
| ISO 19650-7 | Epic 8 | ✅ Deconstruction: HazMat, Material passport |

---

## Next Steps

**For Scrum Master (SM) Agent**:
1. Select an Epic to begin (recommend starting with **Epic 1**)
2. Shard Epic into User Stories
3. Create Story files in `docs/stories/epic-1/`
4. Define Acceptance Criteria, Tasks, dan Technical Notes per Story

**For Development Team**:
1. Wait for SM to prepare Stories
2. Estimate story points
3. Plan Sprint 1 dengan top-priority stories
4. Begin Development Cycle sesuai BMad workflow

---

**Created**: 2025-12-01  
**Created by**: PO Agent  
**Total Epics**: 8  
**Status**: ✅ Epic Sharding Complete
