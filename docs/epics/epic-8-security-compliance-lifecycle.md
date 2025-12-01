# Epic 8: Security, Compliance & Asset Lifecycle (ISO 19650-3/5/6/7)

**Epic ID**: `epic-8`  
**Priority**: P2 (Medium - Compliance)  
**Estimated Effort**: Medium (4-6 weeks)  
**Target Phase**: Phase 3-4

## Description

Implementasi security features sesuai ISO 19650-5, operational phase tools (ISO 19650-3), health & safety features (ISO 19650-6), dan deconstruction planning (ISO 19650-7). Termasuk sensitivity triage, redaction tools, audit trail, Asset Information Model (AIM), risk register, dan HazMat mapping.

## Business Value

- **Security**: Melindungi sensitive data dari unauthorized access
- **Compliance**: Memenuhi ISO 19650 Parts 3, 5, 6, 7
- **Asset Lifecycle**: Smooth transition dari construction ke operations
- **Future-Proof**: Deconstruction planning untuk circular economy

## Functional Requirements (From PRD)

### 3.3 Operational Phase (ISO 19650-3)
- Asset Twin: Live AIM database
- Trigger Events: Maintenance scheduler, issue reporting
- Handover Wizard: PIM to AIM migration

### 3.5 Security & Compliance (ISO 19650-5)
- Triage System: Mandatory sensitivity check
- Redaction Tools: Obscure sensitive elements
- Audit Trail: Immutable action logs
- Watermarking: Dynamic overlay on viewers

### 3.6 Health & Safety (ISO 19650-6)
- Risk Register: Risks linked to model locations
- Visual Safety: 3D tagging of hazardous areas

### 3.7 Deconstruction (ISO 19650-7)
- HazMat Mapping: Layer untuk hazardous materials
- Material Passport: Recyclability dan salvage value metadata

## User Stories (High-Level)

1. **Sensitivity Triage**
   - [ ] Saat upload file, user prompted untuk classify sensitivity level
   - [ ] Levels: Public, Internal, Confidential, Highly Confidential
   - [ ] Access permissions auto-adjusted based on classification
   - [ ] Audit log records classification decisions

2. **Redaction Tools**
   - [ ] User dapat select elements di 3D viewer untuk redaction
   - [ ] Redacted elements appear as bounding boxes (no geometry detail)
   - [ ] Redacted 2D drawings blur specified areas
   - [ ] Redacted versions exported for sharing

3. **Dynamic Watermarking**
   - [ ] All document/model viewers display watermark overlay
   - [ ] Watermark includes: User name, Date/Time, "Confidential"
   - [ ] Screenshot detection: Watermark visible on captures
   - [ ] Configurable per organization

4. **Enhanced Audit Trail**
   - [ ] Every user action logged: View, Download, Delete, Share, Edit
   - [ ] Searchable by: User, Action type, Date range, Entity
   - [ ] Export audit logs for compliance reporting
   - [ ] Immutable storage (append-only database)

5. **Asset Twin (AIM)**
   - [ ] Import PIM (Project Information Model) to AIM at handover
   - [ ] AIM includes: As-built drawings, O&M manuals, Warranty docs
   - [ ] Live data integration: IoT sensors, BMS data
   - [ ] Asset register dengan location, specs, maintenance history

6. **Maintenance Scheduler**
   - [ ] Define maintenance tasks per asset type (e.g., HVAC filter every 3 months)
   - [ ] Auto-generate work orders based on schedule
   - [ ] Trigger events: Time-based, condition-based, breakdown
   - [ ] Track completion dengan technician sign-off

7. **Handover Wizard**
   - [ ] Step-by-step process untuk migrate data PIM → AIM
   - [ ] Checklist: As-built model, COBie data, O&M docs, Training records
   - [ ] Validation checks before handover completion
   - [ ] Generate Handover Report

8. **Risk Register (ISO 19650-6)**
   - [ ] Database of project risks dengan severity ratings
   - [ ] Risks linked to 3D model locations (e.g., confined space at Basement Level)
   - [ ] Risk categories: Safety, Schedule, Cost, Quality
   - [ ] Mitigation measures tracked

9. **Visual Safety Tagging**
   - [ ] Tag hazardous areas di 3D viewer (Fall risk, Overhead load, etc.)
   - [ ] Visual indicators: Red zones, Warning icons
   - [ ] Safety information displayed on hover
   - [ ] Export safety plan dengan tagged model

10. **HazMat Mapping (ISO 19650-7)**
    - [ ] Tag elements containing hazardous materials (Asbestos, Lead paint)
    - [ ] HazMat layer dapat toggled on/off di viewer
    - [ ] Material Safety Data Sheets (MSDS) linked to elements
    - [ ] Removal plan dengan sequencing

11. **Material Passport**
    - [ ] Each element has metadata: Material type, Recyclability %, Salvage value
    - [ ] Search elements by recyclability untuk deconstruction planning
    - [ ] Generate Material Inventory report
    - [ ] Export to Madaster platform (circular economy)

## Acceptance Criteria

- [ ] Sensitivity classification enforced untuk all file uploads
- [ ] Redaction tools preserve original file (non-destructive)
- [ ] Audit trail tamper-proof (cryptographic hashing)
- [ ] AIM database supports 10,000+ assets per project
- [ ] Risk register accessible via mobile app untuk field teams

## Technical Notes

### Security Implementation
- **Encryption at Rest**: AES-256 for S3 objects
- **TLS 1.3**: All API communication
- **Access Logs**: CloudWatch atau ELK stack
- **RBAC**: CASL with dynamic rules

### Audit Trail Storage
- Append-only database table (no UPDATE/DELETE)
- Optional: Blockchain integration untuk immutability proof
- Log retention: Minimum 7 years (regulatory requirement)

### AIM Database Schema
```prisma
model Asset {
  id              String   @id @default(uuid())
  projectId       String
  assetType       String   // HVAC, Pump, Door, etc.
  location        String
  specifications  Json
  installDate     DateTime
  warrantyExpiry  DateTime?
  maintenanceTasks MaintenanceTask[]
  documents       String[]  // File IDs
}

model MaintenanceTask {
  id          String   @id @default(uuid())
  assetId     String
  asset       Asset    @relation(fields: [assetId], references: [id])
  taskType    String   // Preventive, Corrective, Breakdown
  frequency   String?  // "Every 3 months"
  lastDone    DateTime?
  nextDue     DateTime?
  status      TaskStatus
}
```

## Dependencies

- Epic 1 (Core CDE) - Required
- Epic 6 (IFC Viewer) untuk visual safety tagging
- Epic 4 (Asset tracking) untuk lifecycle data

## Risks

| Risk | Mitigation |
|------|------------|
| Over-classification (everything marked Confidential) | Training, default to Internal, audit overuse |
| AIM data maintenance burden | Auto-population from IoT, mobile data capture |
| Material passport data availability | Partner dengan manufacturers, fallback to generic data |

---

**Related Epics**: Epic 1, Epic 4, Epic 6  
**Updated**: 2025-12-01
