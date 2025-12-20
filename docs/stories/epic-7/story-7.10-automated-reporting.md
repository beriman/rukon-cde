# Story 7.10: Automated Reporting Engine

**Epic**: Epic 7: Mobile Field App & AI Assistant
**Status**: Done
**Priority**: High
**Estimation**: 8 Points

## User Story
**As a** Project Manager,
**I want to** generate comprehensive weekly and monthly reports with one click,
**So that** I save hours of manual data compilation.

## Acceptance Criteria
- [ ] User can select report period (Weekly, Monthly) and Project.
- [ ] System automatically aggregates data: S-Curve status, HSE Incidents, RFI/Submittal stats, and recent Progress Photos.
- [ ] Report is generated as a professional PDF with company branding.
- [ ] User can preview the report before finalizing.

## Technical Tasks
- [ ] **Backend**: Create "Report Aggregator Service" to fetch stats from multiple modules.
- [ ] **Backend**: Implement PDF Generation (Puppeteer/PDFKit).
- [ ] **Backend**: Integrate S3 for storing generated reports.
- [ ] **Frontend**: Build Report Generation Wizard UI.

## Dependencies
- Epic 4 (Construction Monitoring Data)
- Story 7.2 (Progress Photos)

## Risks
- **Performance**: Generating large PDFs with high-res images causing timeouts.
