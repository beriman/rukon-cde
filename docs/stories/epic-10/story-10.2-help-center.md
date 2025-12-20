# Story 10.2: Help Center & Video Tutorials

**Epic**: Epic 10: User Onboarding & Training
**Status**: Done
**Priority**: Medium
**Estimation**: 3 Points

## User Story
**As a** User,
**I want to** access a searchable help center with articles and videos,
**So that** I can learn features on my own without contacting support.

## Acceptance Criteria
- [x] Searchable knowledge base
- [x] 10+ help articles published
- [x] 8 tutorial videos defined
- [x] Category-based navigation
- [x] Video player modal
- [x] Floating help button

## Technical Tasks
- [x] **Data**: helpData.ts with articles and categories
- [x] **Component**: HelpCenter page
- [x] **Component**: VideoTutorials (card + modal)
- [x] **Component**: HelpButton (floating)
- [x] **Content**: 10 help articles

## Articles Created (10)
| # | Title | Category | Video |
|---|-------|----------|-------|
| 1 | Quick Start Guide | Getting Started | ✅ |
| 2 | What is a CDE? | Getting Started | - |
| 3 | Uploading Documents | Documents | ✅ |
| 4 | Managing Revisions | Documents | - |
| 5 | Approval Workflows | Workflows | ✅ |
| 6 | Viewing IFC Models | 3D Viewer | ✅ |
| 7 | Creating BCF Issues | 3D Viewer | - |
| 8 | Generating Reports | Reports | ✅ |
| 9 | Logging Incidents | HSE | - |
| 10 | AI Assistant Guide | Getting Started | ✅ |

## Videos Defined (8)
- Getting Started with Rukon CDE
- Uploading Documents
- Setting Up Approval Workflows
- Navigating the 3D Viewer
- Creating BCF Issues
- Generating Reports
- HSE Incident Reporting
- Using the AI Assistant

## Files Created
- `components/help/helpData.ts`
- `components/help/HelpCenter.tsx`
- `components/help/VideoTutorials.tsx`
- `components/help/HelpButton.tsx`
- `components/help/index.ts`
