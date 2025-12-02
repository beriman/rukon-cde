# Story 5.8: Personnel Management (Safety Cards & Training)

**Epic**: Epic 5 - HSE Management & Safety Monitoring  
**Story ID**: `story-5.8`  
**Story Points**: 5  
**Priority**: P1 (High)  
**Sprint**: Sprint 18 (Weeks 35-36)

## User Story

**As a** HSE Admin,  
**I want to** track personnel qualifications and training history,  
**So that** only competent workers are allowed to perform high-risk tasks.

## Acceptance Criteria

### Functional
- [ ] **Profile**: Worker profile with Photo, ID, Role, Company
- [ ] **Certifications**: Track SIO (Surat Izin Operator), SILO (Surat Izin Layak Operasi), K3 Expert Certs
- [ ] **Expiry Tracking**: Auto-alert 30 days before certification expires
- [ ] **Training Log**: Record attendance in Induction, TBM, and specific training
- [ ] **Indonesian Context**: "SIO/SILO" tracking is mandatory for heavy equipment operators
- [ ] **ID Card**: Generate "Safety Passport" QR Code

### Security
- [ ] **Privacy**: Encrypt sensitive personal data (NIK, Medical records)

## Technical Tasks

### Backend
- [ ] Create `Worker` and `Certification` models
- [ ] Implement Expiry Notification Job

### Frontend
- [ ] Worker Database with Expiry Status indicators (Red/Yellow/Green)
- [ ] ID Card Generator

## Dependencies
- **Depends on**: None
