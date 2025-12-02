# Story 5.10: Internal Audits (ISO 45001)

**Epic**: Epic 5 - HSE Management & Safety Monitoring  
**Story ID**: `story-5.10`  
**Story Points**: 8  
**Priority**: P2 (Medium)  
**Sprint**: Sprint 18 (Weeks 35-36)

## User Story

**As a** Lead Auditor,  
**I want to** schedule and conduct internal HSE audits,  
**So that** we maintain compliance with ISO 45001 and SMK3.

## Acceptance Criteria

### Functional
- [ ] **Audit Schedule**: Plan audits (Annual/Quarterly)
- [ ] **Checklist**: Standard audit checklist for ISO 45001 clauses
- [ ] **Findings**: Log NC (Non-Conformance) Major/Minor and OFI (Opportunity for Improvement)
- [ ] **CAP**: Corrective Action Plan tracking until closure
- [ ] **Indonesian Context**: "Audit SMK3 (Sistem Manajemen K3)" compliance
- [ ] **Report**: Generate Audit Report

## Technical Tasks

### Backend
- [ ] Create `Audit`, `AuditFinding`, `CAP` models
- [ ] Implement Audit Status Workflow

### Frontend
- [ ] Audit Runner (similar to Inspection but more detailed)
- [ ] CAP Tracking Dashboard

## Dependencies
- **Depends on**: Story 5.4 (Inspection logic reuse)
