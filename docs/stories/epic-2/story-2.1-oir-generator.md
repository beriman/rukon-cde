# Story 2.1: OIR Generator (Organizational Information Requirements)

**Epic**: Epic 2 - ISO 19650-2 Strategic Planning & Delivery  
**Story ID**: `story-2.1`  
**Story Points**: 5  
**Priority**: P1 (High)  
**Sprint**: Sprint 6 (Weeks 11-12)

## User Story

**As an** Appointing Party (Owner),  
**I want to** generate Organizational Information Requirements (OIR) document using a standard template,  
**So that** I can define my organization's high-level information needs for asset management and compliance.

## Acceptance Criteria

### Functional
- [ ] User can select "Create OIR" from Strategic Planning menu
- [ ] System provides a pre-filled OIR template based on ISO 19650-1/2
- [ ] **Indonesian Context**: Template aligns with **SNI ISO 19650-1:2019** and **PUPR Regulation No. 9/2021**
- [ ] Template includes standard sections: Strategic Objectives, Asset Management Policy, Regulatory Requirements
- [ ] User can edit text content, add/remove sections
- [ ] User can save draft OIR
- [ ] User can export OIR to PDF and DOCX
- [ ] **Localization**: Template available in Indonesian language (default) and English

### Non-Functional
- [ ] Editor supports rich text (bold, lists, tables)
- [ ] Auto-save every 30 seconds

## Technical Tasks

### Backend
- [ ] Create `DocumentTemplate` seed data for OIR (Indonesian & English)
- [ ] Implement `POST /api/documents/generate` (from template)
- [ ] Implement `GET /api/documents/:id` (retrieve content)
- [ ] Implement `PATCH /api/documents/:id` (save content)
- [ ] Implement PDF/DOCX export service using **robust library** (e.g., `docx` or `pdfmake`) to handle complex formatting
- [ ] **Testing**: Implement validation test to parse generated PDF and verify structure

### Frontend
- [ ] Create Rich Text Editor component (e.g., using Tiptap or Quill)
- [ ] Build OIR creation wizard (Select Template -> Edit -> Export)
- [ ] Implement Auto-save hook

## API Contract

```json
POST /api/documents
{
  "type": "OIR",
  "projectId": "uuid", // Optional if OIR is org-level
  "templateId": "template-uuid",
  "name": "OIR PT Waskita Karya 2025"
}

Response:
{
  "id": "doc-uuid",
  "content": { ...json_content... },
  "status": "DRAFT"
}
```

## Dependencies
- **Depends on**: Epic 1 (Auth & Project context)
- **Blocks**: Story 2.2 (PIR often references OIR)
