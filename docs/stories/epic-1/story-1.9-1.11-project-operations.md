# Stories 1.9 - 1.11: Project Operations

## Story 1.9: Project Listing & Search
**Story Points**: 3 | **Priority**: P1 | **Sprint**: Sprint 2

### User Story
**As a** user, **I want to** view dan search all projects dalam organization saya, **so that** saya dapat quickly find projects I need to work on.

### Acceptance Criteria
- [ ] User dapat view list projects dalam organizationnya
- [ ] Pagination support (50 projects per page)
- [ ] Search by project name atau description
- [ ] Filter by status (ACTIVE | ARCHIVED)
- [ ] Sort by name, createdAt, updatedAt

### API: `GET /api/projects?search=MRT&status=ACTIVE&page=1&limit=50`

---

## Story 1.10: Project Details & Updates
**Story Points**: 3 | **Priority**: P1 | **Sprint**: Sprint 5

### User Story
**As a** project member, **I want to** view dan update project details, **so that** project information tetap up-to-date.

### Acceptance Criteria
- [ ] User dapat view project details (name, description, members, file count, etc.)
- [ ] User dengan role ≥ INFORMATION_MANAGER dapat update project
- [ ] Updatable fields: name, description
- [ ] Updates logged di audit trail

### API: `GET /api/projects/:id`, `PATCH /api/projects/:id`

---

## Story 1.11: Project Archival
**Story Points**: 2 | **Priority**: P2 | **Sprint**: Sprint 5

### User Story
**As an** Information Manager, **I want to** archive completed projects, **so that** active project list tetap clean.

### Acceptance Criteria
- [ ] Only INFORMATION_MANAGER+ dapat archive projects
- [ ] Archived projects read-only (no new file uploads)
- [ ] Archived projects hidden from default listing
- [ ] Can filter to view archived projects
- [ ] Project dapat di-reactivate if needed

### API: `PATCH /api/projects/:id/archive`, `PATCH /api/projects/:id/reactivate`

---

**Created**: 2025-12-01  
**Created by**: SM Agent  
**Status**: 📋 Ready for Development
