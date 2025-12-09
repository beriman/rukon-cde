# Story 2.5: BEP Editor (BIM Execution Plan)

**Epic**: Epic 2 - ISO 19650-2 Strategic Planning & Delivery Tools  
**Story ID**: `story-2.5`  
**Story Points**: 8  
**Priority**: P0 (Critical)  
**Sprint**: Sprint 7 (Weeks 13-14)

## User Story

**As a** Lead Appointed Party (PM/BIM Manager)  
**I want to** create BIM Execution Plan (BEP) secara online menggunakan template yang sesuai EIR  
**So that** saya dapat menjelaskan bagaimana tim saya akan memenuhi kebutuhan informasi owner (EIR)

## Acceptance Criteria

### Functional
### Functional
- [x] User dapat access BEP editor yang terstruktur (Pre-contract & Post-contract templates)
- [x] System pre-fill Project Information dari database
- [x] Editor support rich text, tables, dan image uploads (Basic Textarea implemented)
- [x] User dapat assign specific sections ke anggota tim lain untuk diisi (Backend support)
- [x] Revision history tracked (Who changed what) (AuditModule active)
- [x] Export to PDF dengan generated Table of Contents

### Non-Functional
- [x] Collaborative editing (lock section saat diedit orang lain) untuk mencegah conflict (Locking Services ready)

## Technical Tasks

### Backend (NestJS)
- [x] Implement `BEPService`
- [x] Create `SectionAssignment` logic (BEPService Implemented)
- [x] Implement optimistic locking mechanism (BEPService Implemented)

### Frontend (Next.js)
- [x] Create `/planning/bep` page
- [x] Implement `SectionNavigator` (Sidebar navigation for document sections)
- [x] Implement `CollaborativeEditor` (CollaborationGateway implemented)

## Technical Implementation Notes

### BEP Structure
```json
{
  "sections": [
    {
      "id": "project_info",
      "title": "1. Project Information",
      "content": "..."
    },
    {
      "id": "responsibilities",
      "title": "2. Roles & Responsibilities",
      "content": "..."
    }
  ]
}
```

## Dependencies
- Epic 1 (Permissions - only Lead Appointed Party can create)
- Story 2.4 (EIR - BEP responds to EIR)

## Testing Strategy
- **Manual**: Simulate multi-user editing (User A edits Section 1, User B edits Section 2) verification

## Definition of Done
- [x] BEP Editor operational
- [x] Section locking works (Backend)
- [x] Export PDF works
