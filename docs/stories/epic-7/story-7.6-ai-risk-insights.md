# Story 7.6: AI Assistant - Risk Insights

**Epic**: Epic 7: Mobile Field App & AI Assistant
**Status**: Done
**Priority**: Low
**Estimation**: 5 Points

## User Story
**As a** Project Director,
**I want to** receive proactive risk alerts from the AI based on project data,
**So that** I can address potential delays or issues before they become critical.

## Acceptance Criteria
- [ ] AI periodically analyzes late tasks, open high-priority issues (BCF), and external factors (Weather).
- [ ] System generates a "Risk Report" or "Daily Insight" summary.
- [ ] Alerts are pushed to the user's dashboard or mobile app.
- [ ] Insights include actionable recommendations.

## Technical Tasks
- [ ] **Backend**: Create scheduled "Insight Generator" job.
- [ ] **Backend**: Aggregate data from Schedule, BCF, and Weather APIs.
- [ ] **Backend**: prompt engineering for risk analysis.
- [ ] **Frontend**: Create "Insights/Alerts" widget on Dashboard.

## Dependencies
- Epic 4 (Schedule Data)
- Epic 6 (BCF Data)

## Risks
- **Noise**: Too many false alarms causing user to ignore alerts.
