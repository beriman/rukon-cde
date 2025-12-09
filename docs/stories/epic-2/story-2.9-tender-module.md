# Story 2.9: Tender Module & Secure Data Room

**Epic**: Epic 2 - ISO 19650-2 Strategic Planning & Delivery Tools  
**Story ID**: `story-2.9`  
**Story Points**: 8  
**Priority**: P1 (High)  
**Sprint**: Sprint 10 (Weeks 19-20)

## User Story

**As an** Appointing Party  
**I want to** create a secure Tender Data Room  
**So that** saya dapat mendistribusikan EIR dan dokumen referensi kepada bidders secara terkontrol dan tracked

## Acceptance Criteria

### Functional
- [x] User dapat create "Tender Package" linked to a Project (Mocked list)
- [x] User dapat upload documents (EIR manual, Reference Drawings) ke Data Room (Visual UI)
- [x] User dapat invite Bidders (Email invitations) dengan limited access (Visual UI)
- [ ] Bidders harus sign NDA (checkbox/digital) sebelum access (Deferred to Phase 4.5)
- [ ] Audit Log merekam siapa yang view/download file dan kapan (Deferred)
- [x] Question & Answer (Q&A) channel untuk clarifications (Visual UI)

### Security (ISO 19650-5)
- [ ] Watermarking pada documents yang didownload dari data room

## Technical Tasks

### Backend (NestJS)
- [ ] Create `TenderModule`
- [ ] Implement `DataRoomService` dengan strict RBAC
- [ ] Implement `AccessLogService`
- [ ] Implement Dynamic Watermarking (PDF manipulation)

### Frontend (Next.js)
### Frontend (Next.js)
- [x] Create `/tender` dashboard
- [x] Build Data Room UI (File browser read-only style)
- [x] Implement Bidder Invitation form
- [x] Build Q&A Thread UI

## Technical Implementation Notes

### Security
Use Middleware to intercept file downloads and stamp watermark with "Downloaded by [User] on [Date]".

## Dependencies
- Epic 1 (File Management)

## Testing Strategy
- **Security Test**: Verify unauthorized user cannot access files
- **Manual**: Simulate full tender cycle (Create -> Invite -> Bidder Access -> Audit check)

## Definition of Done
- [ ] Data Room operational
- [ ] Audit logs working
- [ ] Watermarking active
