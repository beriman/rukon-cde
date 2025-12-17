# Story 6.9: 5D Reporting & Analysis

## Description
Generate exportable reports for Project Cost, Cash Flow, and Budget tracking. This story extends the 5D Cost integration by allowing users to extract data for external use (PDF/Excel) and viewing summary metrics.

## User Stories
- As a Project Manager, I want to export the Cash Flow S-Curve and data table as a PDF report.
- As a Quantity Surveyor, I want to download the daily/monthly cash flow data as a CSV/Excel file for further analysis.
- As a Stakeholder, I want to see a summary dashboard indicating Total Budget, Peak Monthly Spend, and Project Duration.

## Acceptance Criteria
- [ ] **Backend**: API Endpoint to export Cash Flow data as CSV.
- [ ] **Backend**: API Endpoint to generate a PDF summary report (optional: start with HTML/JSON return if PDF lib too heavy, but target PDFUrl).
- [ ] **Frontend**: "Export CSV" and "Export PDF" buttons in the Cost (5D) tab.
- [ ] **Frontend**: Metric Cards above the chart: "Total Budget", "Peak Spend", "Duration".
- [ ] **frontend**: Data Table view below the chart showing monthly breakdown.

## Technical Tasks
- [ ] **Backend**:
    - Update `CashFlowService` to format data for CSV/PDF.
    - Implement `SimulationController.exportCashFlowCsv`.
    - Implement `SimulationController.exportCashFlowPdf` (or simple summary).
- [ ] **Frontend**:
    - Add `ExportMenu` component in `SimulationPage` (Cost Tab).
    - Add `CostSummaryCards` component.
    - Add `CostTable` component (showing monthly aggregation of daily data).

## Dependencies
- Story 6.8 (Cash Flow Simulation) - Completed.
- Story 6.5 (5D Cost) - Completed.

## QA Risks
- **Data Consistency**: CSV data must match the Chart visualization.
- **Performance**: Generating large CSVs for long projects.

## QA Results
- (To be filled during QA Phase)
