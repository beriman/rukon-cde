# Story 2.1: OIR Generator (Organizational Information Requirements)

**Epic**: Epic 2 - ISO 19650-2 Strategic Planning & Delivery Tools  
**Story ID**: `story-2.1`  
**Story Points**: 5  
**Priority**: P0 (Critical)  
**Sprint**: Sprint 6 (Weeks 11-12)

## User Story

**As an** Appointing Party (Client/Owner)  
**I want to** generate Organizational Information Requirements (OIR) menggunakan standardized templates  
**So that** saya dapat mendefinisikan kebutuhan informasi level organisasi sesuai ISO 19650-1 tanpa memulai dari nol

## Acceptance Criteria

### Functional
### Functional
- [x] User dapat mengakses menu "Strategic Planning" > "OIR"
- [x] System menyediakan predefined OIR templates dalam Bahasa Indonesia dan English
- [x] User dapat mengisi form wizard untuk customize template (Company Goals, Strategic Assets, etc.)
- [ ] Editor mendukung rich text formatting untuk section content
- [x] User dapat menyimpan draft OIR
- [ ] User dapat export OIR final ke format PDF dan DOCX
- [x] System men-generate unique Document ID otomatis (e.g., ORG-OIR-001)

### Non-Functional
- [ ] Template load time < 1s
- [ ] Export generation time < 3s
- [ ] UI intuitif dengan guidance tips untuk setiap section ISO 19650

## Technical Tasks

### Backend (NestJS)
### Backend (NestJS)
- [x] Create `PlanningModule` dan `PlanningController`
- [x] Implement `TemplateService` untuk manage `DocumentTemplate` (Integrated in PlanningService)
- [ ] Create seed data untuk OIR Templates (ID & EN)
- [x] Implement endpoint `GET /api/planning/templates?type=OIR`
- [x] Implement endpoint `POST /api/planning/documents` untuk save draft/final
- [ ] Implement PDF/DOCX generation service (using `pdfmake` or `docx`)

### Frontend (Next.js)
### Frontend (Next.js)
- [x] Create `/planning/oir` page
- [x] Build `TemplateSelector` component (Integrated in Wizard)
- [x] Implement `OIRWizard` component dengan step-by-step form
- [ ] Integrate Rich Text Editor (e.g., Tiptap/Quill) untuk customize content
- [ ] Implement PDF preview viewer
- [ ] Add Export/Download buttons

### Database
- [x] Create `DocumentTemplate` model di Prisma Schema
- [x] Create `PlanningDocument` model untuk menyimpan instance documents

## Technical Implementation Notes

### Database Schema (Prisma)
```prisma
enum TemplateType {
  OIR
  PIR
  AIR
  EIR
  BEP
  TIDP
  MIDP
}

model DocumentTemplate {
  id        String       @id @default(uuid())
  type      TemplateType
  language  String       @default("id") // 'id' | 'en'
  name      String
  content   Json         // Structure with default texts
  version   String       @default("1.0")
  createdAt DateTime     @default(now())
  updatedAt DateTime     @updatedAt
}

model PlanningDocument {
  id             String           @id @default(uuid())
  projectId      String?
  organizationId String
  type           TemplateType
  title          String
  content        Json             // User answers/customized content
  status         String           // DRAFT, FINAL
  createdBy      String
  createdAt      DateTime         @default(now())
  updatedAt      DateTime         @updatedAt
}
```

### JSON Structure for Template Content
```json
{
  "sections": [
    {
      "id": "strategic_objectives",
      "title": "Tujuan Strategis Organisasi",
      "helpText": "Jelaskan tujuan bisnis jangka panjang...",
      "defaultContent": "Organisasi bertujuan untuk..."
    },
    {
      "id": "asset_management_policy",
      "title": "Kebijakan Manajemen Aset",
      "defaultContent": "Sesuai dengan ISO 55000..."
    }
  ]
}
```

## Dependencies
- Epic 1 (Organization Management)

## Testing Strategy
- **Unit Test**: Test template parsing dan PDF generation logic
- **Integration Test**: Test flow save dan retrieve document
- **Manual**: Verify template content correctness (Indonesian context)

## Definition of Done
- [ ] Schema update applied
- [ ] OIR Template seeds created (ID & EN)
- [ ] Wizard UI functional
- [ ] Export to PDF works
- [ ] Unit & Integration tests passed
