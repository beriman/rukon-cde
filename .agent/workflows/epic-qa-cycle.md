---
description: Accelerated QA cycle for validating an entire Epic using BMad + DOE standards.
---

# Epic QA Cycle (Bulk Verification)

// turbo-all

## Phase 1: Context & Discovery

1. **Read Epic Documentation**:
   - Locate and read the main epic file in `docs/epics/epic-{id}-*.md`.
   ```bash
   # Example
   ls docs/epics/epic-*.md
   ```

2. **List Associated Stories**:
   - Find all story definitions for this epic.
   ```bash
   ls docs/stories/epic-{id}/*.md
   ```

## Phase 2: Efficient Execution (DOE)

3. **Run Automated Tests (Backend)**:
   - Execute tests specifically for the modules related to this Epic.
   - *Example: If Epic 6, run tests for simulation, loin, bcf.*
   ```bash
   npm run test:api
   ```

4. **Verify Frontend Build**:
   - Ensure no build errors exist.
   ```bash
   npm run build
   ```

5. **Code Quality Check**:
   - Run the DOE quality checker.
   ```bash
   python execution/code_quality_checker.py apps/
   ```

## Phase 3: BMad Quality Gates

6. **Risk & Gate Review**:
   - Check existing BMad assessments for any unresolved high risks.
   ```bash
   # Check if any recent assessments have high risk
   grep -r "Risk score" docs/qa/assessments/ | grep -E "[7-9]|10"
   ```

## Phase 4: Documentation Synchronization (CRITICAL)

7. **Synchronize Story Files (Batch Update)**:
   - **Instructions**: You MUST verify that the work is actually done before checking.
   - For every `story-*.md` file in the epic folder:
     - Use `multi_replace_file_content` to change ALL `[ ]` to `[x]` in the **Acceptance Criteria** and **Technical Tasks** sections.

8. **Synchronize Master Epic File**:
   - **Instructions**: This is the most important step for high-level tracking.
   - Open the main epic file (`docs/epics/epic-{id}-*.md`).
   - Use `multi_replace_file_content` to change ALL `[ ]` to `[x]` for:
     - The **User Stories** list.
     - The **Acceptance Criteria** list.

## Phase 5: Final Reporting

9. **Generate Epic QA Report**:
   - Create a summary report at `docs/qa/reports/epic-{id}-qa-summary.md`.
   - Content should include:
     - Date of run.
     - Status of Tests (Pass/Fail).
     - Confirmation that documentation is synchronized.
     - BMad/DOE Quality Score (Average of stories or Global score).

## Phase 6: Completion Loop / Self-Correction
This phase ensures that recommendations found in the summary are acted upon immediately.

10. **Read QA Summary**:
    - Agent reads the generated `epic-[N]-qa-summary.md`.

11. **Analyze Recommendations**:
    - Identify "High" priority recommendations.
    - For each recommendation that is a specific, actionable code fix (e.g., "Fix build error", "Add missing test"):
      - **Execute the fix** immediately.
      - **Verify** the fix (run build/test).
      - **Update** the QA summary to mark it as resolved.

12. **Final Status**:
    - If critical issues were fixed, re-run `Phase 4: Final Verification` to ensure no regressions.

## Exit Criteria
- ✅ All Tests Passed.
- ✅ Build Successful.
- ✅ All Stories in docs/stories marked `[x]`.
- ✅ Main Epic file in docs/epics marked `[x]`.
- ✅ All critical QA recommendations addressed.
