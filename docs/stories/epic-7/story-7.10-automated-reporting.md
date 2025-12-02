# Story 7.10: Automated Reporting (Weekly/Monthly)

**Epic**: Epic 7 - Mobile AI Assistant  
**Story ID**: `story-7.10`  
**Story Points**: 8  
**Priority**: P0 (Critical)  
**Sprint**: Sprint 26 (Weeks 51-52)

## User Story

**As a** Project Manager,  
**I want to** generate a comprehensive project report with one click,  
**So that** I save hours of manual data compilation every week.

## Acceptance Criteria

### Functional
- [ ] **One-Click**: Generate report by selecting report type (Weekly/Monthly)
- [ ] **Data Sources**: Auto-compile: S-Curve (Epic 6), HSE Stats (Epic 5), Document Status (Epic 1), Progress Photos (Epic 7)
- [ ] **Preview**: Show report preview before generating final PDF
- [ ] **Export**: Export to PDF/DOCX with company logo and branding
- [ ] **Indonesian Context**: Support "Laporan Mingguan/Bulanan" template

### Performance
- [ ] Generate 20-page report in < 30 seconds

## Technical Tasks

### Backend
- [ ] Implement Report Aggregation Service
- [ ] PDF Generation using `puppeteer` or `pdfkit`

## Dependencies
- **Depends on**: Epic 4 (Progress), Epic 5 (HSE), Epic 6 (S-Curve)
