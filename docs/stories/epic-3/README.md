# Epic 3: Design Collaboration Suite

## Overview
**Epic ID**: `epic-3`
**Focus**: Design Collaboration, Workspaces, Reference Management, and Markup Tools.
**Objective**: Build a robust environment for multi-disciplinary teams (Arch, Struct, MEP) to collaborate securely using ISO 19650 "WIP" and "Shared" states.

## User Personas
1.  **Lead Appointed Party**: Need to coordinate references and check design conflicts.
2.  **Appointed Party (Task Teams)**: Need private workspaces to work on models before sharing.

## Key Features
1.  **Discipline Workspaces**: Private folder isolation (Architecture, Structure, MEP) with rigid permission gates.
2.  **Reference Management (XREFs)**: Ability to "link" shared models from other teams without duplication.
3.  **Design Review (Markup)**: 2D/3D annotation tools for "Check/Review/Approve" workflows.
4.  **Clash Avoidance**: Pre-checking models against shared references.
5.  **Model Federation**: Merging multiple discipline models into a single view.

## Story Breakdown (Preliminary)
- **Story 3.1**: Discipline Workspaces & WIP Isolation
- **Story 3.2**: Reference Management System (XREF Linkage)
- **Story 3.3**: 2D Drawing Markup & Redlining Tools
- **Story 3.4**: 3D Model Federation & Basic Clash Check
- **Story 3.5**: Issue Management (BCF-lite integration)

## Technical Architecture
- **Backend**: `DesignModule` in NestJS.
- **Database**: New relations for `ModelReference`, `ClashResult`, `MarkupLayer`.
- **Frontend**: Extension of `IFCViewer` and new `MarkupToolbar` using `fabric.js` or similar for 2D.
