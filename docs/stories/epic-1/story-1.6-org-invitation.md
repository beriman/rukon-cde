# Story 1.6: Organization User Invitation

**Epic**: Epic 1 - Core CDE Foundation & Multi-Tenancy  
**Story ID**: `story-1.6`  
**Story Points**: 5  
**Priority**: P1 (High)  
**Sprint**: Sprint 5 (Weeks 9-10)

## User Story

**As an** Organization Admin  
**I want to** invite users ke organization saya via email  
**So that** team members dapat collaboration di platform

## Acceptance Criteria

- [x] Org Admin dapat send invitation via email
- [x] Invitation email berisi signup link dengan pre-filled organization
- [x] **Scenario 1 (New User)**: Recipient klik link -> Register -> Auto-assigned ke organization
- [x] **Scenario 2 (Existing User)**: Recipient klik link -> Login -> Auto-added ke organization baru (Multi-org support)
- [x] Invitation link valid selama 7 days
- [x] Admin dapat resend atau revoke invitation
- [x] Invitation cannot be used twice

## Technical Tasks

- [x] Create `Invitation` model (userId, organizationId, email, token, expiresAt)
- [x] Implement `POST /api/organizations/:id/invitations`
- [x] Implement `GET /api/invitations/:token/verify`
- [x] Implement `POST /api/auth/register-from-invitation`
- [x] Send invitation email dengan link
- [ ] Frontend: invitation page dengan auto-fill organization

## API Contract

```json
POST /api/organizations/:orgId/invitations
{
  "email": "newuser@example.com",
  "role": "VIEWER"
}

Response:
{
  "id": "uuid",
  "email": "newuser@example.com",
  "invitationLink": "https://rukon.app/invite/token-here",
  "expiresAt": "2025-12-08T10:00:00Z"
}
```

## Dependencies
- **Depends on**: Story 1.1 (Registration), Story 1.5 (Organization)

---

**Created**: 2025-12-01  
**Created by**: SM Agent  
**Status**: 📋 Ready for Development
