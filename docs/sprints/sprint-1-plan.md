# Sprint 1 Plan: Foundation & DevOps

**Sprint Goal**: Establish the core platform foundation (Auth, Multi-tenancy) and enable automated delivery (CI/CD, IaC).
**Duration**: 2 Weeks
**Total Story Points**: 31 Points
**Focus**: Epic 1 (Core CDE)

---

## 1. Selected User Stories

### A. Core Foundation (21 Points)
| ID | Story | Points | Priority | Assignee |
|----|-------|--------|----------|----------|
| **1.1** | **User Registration** | 5 | P0 | Backend |
| **1.2** | **User Login & JWT** | 5 | P0 | Backend |
| **1.5** | **Organization Creation** | 3 | P0 | Fullstack |
| **1.7** | **Multi-Tenancy Isolation** | 8 | P0 | Tech Lead |

### B. DevOps Enablers (10 Points)
| ID | Story | Points | Priority | Assignee |
|----|-------|--------|----------|----------|
| **1.23** | **CI/CD Pipeline** | 5 | P0 | DevOps |
| **1.24** | **Infrastructure as Code** | 5 | P0 | DevOps |

---

## 2. Technical Tasks Breakdown

### 1.1 & 1.2: Authentication (Backend)
- [ ] Implement `AuthModule` in NestJS.
- [ ] Setup `User` model in Prisma.
- [ ] Implement `bcrypt` password hashing.
- [ ] Implement JWT strategy (Access Token + Refresh Token).
- [ ] Create API endpoints: `/auth/register`, `/auth/login`, `/auth/refresh`.

### 1.5 & 1.7: Multi-Tenancy (Core)
- [ ] Implement `Organization` model in Prisma.
- [ ] Implement `OrganizationUser` (Membership) model.
- [ ] **Critical**: Implement Prisma Middleware / Extension for Row-Level Security (RLS) to enforce `orgId` filtering automatically.
- [ ] Create API endpoints: `/orgs` (Create, List).

### 1.23: CI/CD (DevOps)
- [ ] Configure GitHub Actions for:
  - Linting & Formatting check.
  - Unit Tests (`npm run test`).
  - Build verification (`npm run build`).
  - Security Audit (`npm audit`).
- [ ] Setup Docker image build & push to registry (GHCR/ECR).

### 1.24: Infrastructure (DevOps)
- [ ] Finalize Terraform setup for:
  - VPC & Networking.
  - RDS (PostgreSQL).
  - S3 Bucket (Storage).
  - EKS/ECS or App Runner (Compute).

---

## 3. Definition of Done (DoD)
- [ ] Code compiles and passes all linting checks.
- [ ] Unit tests written and passing (>80% coverage for core logic).
- [ ] API endpoints documented in Swagger/OpenAPI.
- [ ] Feature verified in local Docker environment.
- [ ] Pull Request reviewed by at least 1 peer.
- [ ] CI pipeline passes (Green).

---

## 4. Risks & Mitigations
- **Risk**: Multi-tenancy implementation (Story 1.7) is complex and critical.
  - *Mitigation*: Tech Lead to prioritize this task first. Create a "Proof of Concept" for Prisma Middleware before full implementation.
- **Risk**: High story points (31) for first sprint.
  - *Mitigation*: Stories 1.23 & 1.24 can be parallelized. If velocity is low, move Story 1.5 to Sprint 2.
