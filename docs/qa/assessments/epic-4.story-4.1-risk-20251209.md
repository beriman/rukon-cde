# Risk Assessment: Story 4.1 (Technical Monitoring Dashboard)

**Date**: 2025-12-09
**Assessor**: BMad QA Agent (Simulated)
**Context**: Initial implementation of Epic 4 (Construction Monitoring).

## 1. Technical Risks
- **[Medium] Data Model Complexity**: The relationship between `WorkPackages`, `ProgressUpdates`, and the future `Schedule` (4D) / `Cost` (5D) is critical. If we design `WorkPackages` too loosely now, it might be hard to link to `TaskDeliverables` or `ScheduleTasks` later.
  - *Mitigation*: Design `WorkPackage` with a nullable `scheduleTaskId` and `bqItemId` for future linking. Ensure the ID structure allows for hierarchical mapping.
- **[Low] Performance**: Aggregating progress from thousands of items for the S-Curve might be slow.
  - *Mitigation*: Implement database indexing on `projectId` and `date`. Consider a summarized `DailyProjectProgress` table if real-time aggregation is too slow (Materialized View approach).

## 2. Integration Risks
- **[High] Absent S-Curve Data Sources**: The requirements mention "S-Curve". An S-Curve requires *Planned* vs *Actual*. We currently don't have a Schedule module (Epic ?) or Cost module.
  - *Mitigation*: For this story, scope it to **Actual Progress only**. Or, allow manual entry of "Planned %" for the week. Alternatively, create a mock `Schedule` model to store baseline data. **Decision**: Allow manual "Planned" curve entry for now, or derived from a simple linear distribution if start/end dates are known.
- **[Medium] Frontend Complexity**: Recharts or similar for S-Curves can be tricky with dual axes (Time vs $ or %).
  - *Mitigation*: allocate sufficient time for UI components.

## 3. Data Risks
- **[Low] Data Integrity**: Ensuring progress doesn't exceed 100% or regress without reason.
  - *Mitigation*: Validation logic in Service layer.

## 4. Security Risks
- **[Low] Access Control**: Only Contractors should edit, Owner/MK should approve.
  - *Mitigation*: Use RBAC Guards (`Roles.CONTRACTOR` etc).

## Recommendations
1.  **Scope**: Focus on **recording Actual Progress** first. The "S-Curve" visualization might be limited to "Actual" until the Scheduling module is built.
2.  **Model**: Create a robust `WorkPackage` entity that helps breakdown the project even if detailed Schedule isn't there.
