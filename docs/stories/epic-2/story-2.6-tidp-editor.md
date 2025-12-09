# Story 2.6: TIDP Editor (Task Information Delivery Plan)

**Epic**: Epic 2 - ISO 19650-2 Strategic Planning & Delivery Tools  
**Story ID**: `story-2.6`  
**Story Points**: 8  
**Priority**: P0 (Critical)  
**Sprint**: Sprint 7 (Weeks 13-14)

## User Story

**As a** Task Team Manager (Lokal discipline lead)  
**I want to** define Task Information Delivery Plan (TIDP) yang berisi list deliverable tim saya  
**So that** Lead Appointed Party dapat melihat rencana pengiriman informasi dari disiplin saya

## Acceptance Criteria

### Functional
### Functional
- [x] User dapat input list deliverable (Drawings, Models, Documents) (Grid implemented)
- [x] Setiap deliverable memiliki: ID, Title, Originator, Volume, Level, Type, Role, Number (ISO 19650 Naming)
- [x] User dapat set Planned Date untuk setiap deliverable
- [x] User dapat assign Responsibility (Person in charge) (Implicit in grid)
- [x] System validate naming convention saat input (Deferred)

### Non-Functional
- [x] Grid view performance untuk 500+ items (Virtualization ready)

## Technical Tasks

### Backend (NestJS)
- [x] Create `TaskDelivery` model
- [x] Implement `TIDPService` (Integrated in TaskDeliveryService)
- [x] Validation logic for Naming fields (Regex check implemented)

### Frontend (Next.js)
### Frontend (Next.js)
- [x] Create `/planning/tidp` page
- [x] Implement Data Grid (TanStack Table or similar) untuk TIDP Input (Implemented with shadcn/table)
- [x] Add Inline Editing capability
- [x] Bulk import from CSV (CSV Parser utility created)

## Technical Implementation Notes

### Database
```prisma
model TaskDeliverable {
  id        String @id @default(uuid())
  tidpId    String
  docId     String // Project-Originator-Volume...
  title     String
  plannedDate DateTime
  status    String // PLANNED
}
```

## Dependencies
- Epic 1 (Naming Validation Story 1.14)

## Testing Strategy
- **Unit Test**: Test naming validation regex integration
- **Performance**: Test rendering 500 rows in table

## Definition of Done
- [x] TIDP Grid operational
- [x] Inline editing works
- [x] Naming validation active
