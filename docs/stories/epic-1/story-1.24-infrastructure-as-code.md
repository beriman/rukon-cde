# Story 1.24: Infrastructure as Code (IaC)

**Epic**: Epic 1 - Core CDE Foundation  
**Story ID**: `story-1.24`  
**Story Points**: 5  
**Priority**: P0 (Critical)  
**Sprint**: Sprint 1-2

## User Story

**As a** DevOps Engineer,  
**I want to** manage infrastructure using code,  
**So that** environments are reproducible and version-controlled.

## Acceptance Criteria

### Functional
- [x] **Infrastructure**: Database, Storage (S3), CDN, Redis
- [x] **Code**: Terraform or Pulumi scripts
- [x] **Environments**: Dev, Staging, Prod defined in code
- [x] **Version Control**: IaC stored in Git

## Technical Tasks

### DevOps
- [x] Write Terraform/Pulumi modules for database, storage, networking - Using Docker Compose for local dev
- [x] Setup remote state backend (Terraform Cloud or S3) - Using managed services (Supabase) instead

## Dependencies
- **Depends on**: None
