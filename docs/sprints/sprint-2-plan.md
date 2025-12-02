# Sprint 2 Plan: Project Management & Frontend Integration

**Sprint Goal**: Enable users to create/manage projects and folders, and connect the Frontend to the Backend.
**Duration**: 2 Weeks
**Total Story Points**: 23 Points
**Focus**: Epic 1 (Core CDE) & Tech Debt

---

## 1. Selected User Stories

### A. Tech Debt & Quality (5 Points)
| ID | Task | Points | Priority | Assignee |
|----|------|--------|----------|----------|
| **TD-1** | **Strict Validation** (DTOs) | 2 | P0 | Backend |
| **TD-2** | **Config Service** | 1 | P1 | Backend |
| **TD-3** | **Unit Tests** (Auth/Org) | 2 | P1 | QA/Dev |

### B. Project Management (13 Points)
| ID | Story | Points | Priority | Assignee |
|----|-------|--------|----------|----------|
| **1.8** | **Project Creation** | 5 | P0 | Fullstack |
| **1.9** | **Project Listing** | 3 | P1 | Frontend |
| **1.12** | **Folder Management** | 5 | P0 | Backend |

### C. Frontend Integration (5 Points)
| ID | Task | Points | Priority | Assignee |
|----|------|--------|----------|----------|
| **FE-1** | **Auth Integration** (NextAuth/Custom) | 5 | P0 | Frontend |

---

## 2. Technical Tasks Breakdown

### Tech Debt (Backend)
- [ ] Install `class-validator` & `class-transformer`.
- [ ] Create DTOs for Auth (`RegisterDto`, `LoginDto`) and Org (`CreateOrgDto`).
- [ ] Refactor Controllers to use DTOs instead of `any`.
- [ ] Implement `ConfigService` for `JWT_SECRET` and `DATABASE_URL`.

### Frontend Integration (Next.js)
- [ ] Setup Axios/Fetch wrapper with Interceptors (for JWT).
- [ ] Create `useAuth` hook (Zustand) for state management.
- [ ] Build **Login Page** (`/login`) & **Register Page** (`/register`).
- [ ] Build **Dashboard Layout** (Sidebar, Header).

### Project Management (Fullstack)
- [ ] **Backend**:
  - Create `ProjectsModule`, `ProjectsService`, `ProjectsController`.
  - Implement `POST /projects` (Create Project + Default Folders).
  - Implement `GET /projects` (List by Org).
- [ ] **Frontend**:
  - Create **Create Project Modal/Page**.
  - Create **Project List View** (Card/Table).

### Folder Management (Backend)
- [ ] Create `FoldersModule`.
- [ ] Implement `Folder` model in Prisma (Self-referencing relation).
- [ ] Implement `POST /folders` (Create Subfolder).
- [ ] Implement `GET /projects/:id/folders` (Tree Structure).

---

## 3. Definition of Done (DoD)
- [ ] Tech Debt: All API endpoints validate input using DTOs.
- [ ] Frontend: User can Login, View Dashboard, Create Project.
- [ ] Backend: Project creation automatically generates CDE folders (WIP, Shared, Published, Archived).
- [ ] Tests: Unit tests for ProjectService > 80% coverage.

---

## 4. Risks & Mitigations
- **Risk**: Frontend/Backend integration issues (CORS, Cookies).
  - *Mitigation*: Setup Proxy in Next.js or configure CORS correctly in NestJS early.
- **Risk**: Complex Folder Tree recursion.
  - *Mitigation*: Use Prisma `include` for simple depth, or raw SQL CTE if performance needed. Start simple.
