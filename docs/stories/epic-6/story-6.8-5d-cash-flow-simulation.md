# Story 6.8: 5D Cash Flow Simulation

## Description
This story integrates **Cost (5D)** with **Time (4D)** to create a **Cash Flow Simulation**.
It allows users to visualize how project costs are distributed over the construction schedule (S-Curve) and monthly spending.

## Dependencies
- **Story 6.6**: 4D Schedule (Schedule, ScheduleTask) - **DONE**
- **Story 6.5**: 5D Cost (BillOfQuantities, BoQItem) - **Pending Verification/Implementation**
    - *Note*: `CostService` exists but schema validation is needed.

## User Stories
1. **As a Project Manager**, I want to view a "Cash Flow S-Curve" to see cumulative planned cost vs time.
2. **As a Quantity Surveyor**, I want to link BoQ Costs to Schedule Tasks (via Elements) to automate cash flow calculation.
3. **As a Manager**, I want to see "Monthly Projected Spend" based on the schedule.

## Acceptance Criteria
- [ ] **Schema Verified**: `BillOfQuantities`, `BoQItem`, and `CostMapping` models exist and are correct.
- [ ] **Data Linking**: System can calculate `Task Cost` = Sum of (Mapped Elements * Cost).
- [ ] **Backend API**: 
    - `GET /simulation/cash-flow/:scheduleId` returns time-series data (Date, DailyCost, CumulativeCost).
- [ ] **Frontend**:
    - **Cash Flow Chart**: Line chart (S-Curve) overlaying the timeline.
    - **Monthly Bar Chart**: Bar chart showing cost per month.
    - **Integration**: Chart updates as `TimelinePlayer` moves (optional, or static chart).

## Technical Tasks
### Phase 1: Database & Foundation (5D)
- [ ] Verify `BillOfQuantities` and `BoQItem` in `schema.prisma`. Add if missing.
- [ ] Verify `CostMapping` (BoQItem <-> Element or BoQItem <-> Task).
    - *Strategy*: Link BoQ Item -> Element (via GUID). Schedule Task -> Element (via GUID).
    - *Calculation*: Task Cost = Sum(Element Costs linked to this Task).

### Phase 2: Backend (Cash Flow Engine)
- [ ] Implement `CostService.calculateCashFlow(scheduleId)`.
    - Logic:
        1. Fetch Schedule with Tasks.
        2. For each Task, find linked Elements.
        3. For each Element, find linked Cost (BoQItem).
        4. Distribute Cost over Task Duration (Linear distribution).
        5. Aggregate Daily Costs across all tasks.
        6. Generate Cumulative Sum.
- [ ] Create Endpoint `GET /simulation/:scheduleId/cash-flow`.

### Phase 3: Frontend (Visualization)
- [ ] Install `recharts` (if not present) for S-Curve.
- [ ] Create `CashFlowPanel` component.
- [ ] Integrate into `SimulationPage` (New Tab or Overlay?).
    - *Decision*: New Tab "Cost Analysis" or Bottom Panel overlay. Let's do **Bottom Panel Overlay** next to Timeline.

## QA Risks
- **Missing Data**: Tasks without links or Elements without costs -> Zero value.
- **Performance**: Aggregating costs for 10,000 elements over 1,000 days.
- **Currency**: Assumes single currency for MVP.
