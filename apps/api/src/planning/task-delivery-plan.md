# detailed plan for task delivery implementation

## Goal
Implement backend support for `TaskDeliveryPlan` (TIDP Items) to enable date synchronization and granular updates.

## Changes
1.  **Schema Verification**: Ensure `TaskDeliveryPlan` has `startDate`, `endDate`, `project`, `documentId` etc.
2.  **Service**: Create `TaskDeliveryService` with `updateTask(id, dto)`.
3.  **Controller**: Create `TaskDeliveryController` with `PATCH /tasks/:id`.
4.  **Module**: Register new service and controller in `PlanningModule`.

## Verification
-   Test `PATCH /planning/tasks/:id` with start/end dates.
