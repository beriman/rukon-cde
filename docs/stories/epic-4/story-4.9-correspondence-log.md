# Story 4.9: Correspondence Log (Site Memos/SI)

**Epic**: Epic 4 - Construction Monitoring & Document Control  
**Story ID**: `story-4.9`  
**Story Points**: 3  
**Priority**: P1 (High)  
**Sprint**: Sprint 13 (Weeks 25-26)

## User Story

**As a** Document Controller,  
**I want to** manage Site Memos and Site Instructions (SI) in a centralized log,  
**So that** all formal communication is traceable and searchable.

## Acceptance Criteria

### Functional
- [ ] **Log Entry**: Create new entry with: Date, From (Sender), To (Recipient), Subject, Reference No.
- [ ] **Attachments**: Upload PDF/Images related to the memo
- [ ] **Numbering**: Auto-generate Reference No. based on project config (e.g., `PROJ-SI-001`)
- [ ] **Search**: Full-text search on Subject and Reference No.
- [ ] **Indonesian Context**: Support types: "Surat Instruksi (SI)", "Memo Lapangan", "Berita Acara"

### Security
- [ ] **Immutable**: Log entries cannot be deleted after 24 hours (only "Void" status allowed)

## Technical Tasks

### Backend
- [ ] Create `Correspondence` model
- [ ] Implement Full-Text Search (PostgreSQL `tsvector` or simple `ILIKE` for MVP)

### Frontend
- [ ] Data Grid with filtering and sorting
- [ ] PDF Viewer for attachments

## Dependencies
- **Depends on**: Epic 1 (File Upload)
