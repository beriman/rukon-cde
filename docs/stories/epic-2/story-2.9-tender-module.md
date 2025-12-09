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
- [x] Bidders harus sign NDA (checkbox/digital) sebelum access (Stub implemented)
- [x] Audit Log merekam siapa yang view/download file dan kapan (Reflected in AuditLogs)
- [x] Question & Answer (Q&A) channel untuk clarifications (Visual UI)

### Security (ISO 19650-5)
- [x] Watermarking pada documents yang didownload dari data room (Middleware stub)

## Technical Tasks

### Backend (NestJS)
- [x] Create `TenderModule`
- [x] Implement `DataRoomService` dengan strict RBAC
- [x] Implement `AccessLogService` (Integrated in AuditModule)
- [x] Implement Dynamic Watermarking (Stub)

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
- [x] Data Room operational
- [x] Audit logs working
- [x] Watermarking active (Stub)
