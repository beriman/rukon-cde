# Directive: Story Implementation & QA Cycle

**ID**: DIR-004
**Layer**: Directive (What to do)
**Trigger**: User requests to "implement stories" or "continue development".

## 1. Objective
To systematically implement user stories from the backlog, ensure they meet acceptance criteria through rigorous QA, and only proceed when quality standards are met (Score ≥ 90/100).

## 2. Roles (Virtual Hats)
The Agent acts as both:
*   **Developer Agent**: Writes code, implements features, fixes bugs.
*   **QA Agent**: Reviews code, tests functionality against Acceptance Criteria (AC), calculates scores.

## 3. Workflow Steps

### Phase 1: Selection
1.  **Scan**: Read `docs/stories` and `docs/sprints` to identify the next priority story (Status: Ready/Todo/Sprint Backlog).
2.  **Lock**: Announce the selected story to the User.
3.  **Analyze**: Read the Story .md file carefully, noting all Acceptance Criteria and Technical Tasks.

### Phase 2: Development (Developer Agent)
1.  **Plan**: If complex, create a mini-implementation plan.
2.  **Implement**: Write the code (Backend/Frontend/DB).
3.  **Verify (Self-Check)**: Ensure code builds and basic paths work.
4.  **Mark Tasks**: Check `[x]` on Technical Tasks in the story file as you go.

### Phase 3: QA Review (QA Agent)
*Trigger*: When Development is marked "Complete" by Developer.

1.  **Review Code**: Read the changed files. Quality check for:
    *   Clean Code principles (naming, structure).
    *   Security (validations, auth guards).
    *   Performance (indexes, efficient queries).
2.  **Verify AC**: Check each Acceptance Criteria from the Story file.
    *   *Pass*: Feature works as described.
    *   *Fail*: Bug or missing functionality.
3.  **Scoring**: Calculate `Quality Score` (0-100).
    *   **100**: Perfect. All AC passed, tests written, code clean.
    *   **90-99**: Minor nits (comments, formatting) but functional.
    *   **< 90**: Functional bugs, missing AC, or security risks.

### Phase 4: Annealing Loop
*   **If Score < 90**:
    1.  **Report**: QA lists specific "Defects" or "Feedback".
    2.  **Fix**: Developer switches back, fixes the defects.
    3.  **Re-Review**: QA reviews **only** the fixes and re-scores.
    4.  *Repeat until Score ≥ 90.*

*   **If Score ≥ 90**:
    1.  **Finalize**: Mark Story as `Done` in documentation.
    2.  **Commit/Notify**: Inform User of completion.
    3.  **Next**: Return to Phase 1 (Selection) for the next story.

## 4. Output Format (QA Report)
When performing a review, generate a brief report:
```markdown
## QA Review: [Story Name]
**Pass**: [List of passed AC]
**Fail**: [List of failed AC]
**Score**: [X]/100
**Feedback**:
- [ ] Fix 1...
- [ ] Fix 2...
```

## 5. Exit Criteria
The workflow for a specific story ends ONLY when the QA Assurance Score is **90 or higher**.
