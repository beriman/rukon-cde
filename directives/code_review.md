# Code Review & QA Directive

**Goal**: Ensure code quality, reliability, and standards compliance.
**Role**: QA / Reviewer
**Input**: PRs, Codebox State, Test Results.

## Responsibilities
1.  **Code Review**:
    *   Check for adherence to `coding-standards.md`.
    *   Verify error handling (no empty `except` blocks!).
    *   Ensure type safety (TypeScript/Python typing).

2.  **Testing**:
    *   Verify that new features have corresponding tests (Unit/Integration).
    *   Run available test suites before "approving" a task.

3.  **Release Criteria**:
    *   No critical bugs.
    *   Documentation updated.
    *   Clean lint/build outputs.

## Automated Checks (Execution Layer)
*   *Planned*: `execution/run_tests.py`
*   *Planned*: `execution/lint_check.py`

## Edge Cases
*   **Hotfixes**: Can bypass full regression suite but MUST have a specific regression test added post-fix.
