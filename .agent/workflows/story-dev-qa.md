---
description: Development & QA cycle for one story with automated testing
---

# Story Development & QA Workflow

// turbo-all

## Phase 0: Pre-Development QA (BMad - Optional for High-Risk Stories)

**NEW: BMad Risk Assessment**

0a. Run BMad risk profile (for P0/high-risk stories)
```bash
@qa *risk docs/stories/epic-1/story-{id}.md
# Or via wrapper:
python execution/bmad_task_wrapper.py --task risk --story docs/stories/epic-1/story-{id}.md
```

Output: `docs/qa/assessments/story-{id}-risk-{date}.md`

Review risk assessment:
- Risk score ≥9: CRITICAL - Must address before dev
- Risk score ≥6: HIGH - Create mitigation plan
- Risk score <6: ACCEPTABLE - Proceed with caution

0b. Run BMad test design (for all stories)
```bash
@qa *design docs/stories/epic-1/story-{id}.md
# Or via wrapper:
python execution/bmad_task_wrapper.py --task design --story docs/stories/epic-1/story-{id}.md
```

Output: `docs/qa/assessments/story-{id}-test-design-{date}.md`

Use test design to guide:
- Which tests to write (unit/integration/e2e)
- Test priorities (P0/P1/P2)
- Test data requirements
- Mock strategies

## Phase 1: Story Analysis

1. Read story file untuk selected story
```bash
cat docs/stories/epic-1/story-{id}.md
```

2. Extract acceptance criteria checklist

3. Extract technical tasks checklist

4. Identify dependencies (depends on which stories)

## Phase 2: Backend Development

5. Jika perlu database changes:
```bash
# Generate Prisma migration
npx prisma migrate dev --create-only --name {story_name}
```

6. Review generated migration file

7. Apply migration
```bash
npx prisma migrate dev
```

8. Implement backend code (Controllers, Services, DTOs)
   - Create/modify files in apps/api/src
   - Follow directive: api-development.md
   - Add proper RBAC guards
   - Implement validation

9. Write unit tests untuk backend
```bash
npm run test:api -- {service_name}
```

## Phase 3: Frontend Development

10. Implement frontend pages/components
    - Create/modify files in apps/web
    - Follow directive: frontend-development.md
    - Implement API integration
    - Add loading & error states

11. Test frontend manually di browser
```bash
# User runs this in separate terminal
# npm run dev
```

12. Verify responsive design

## Phase 4: Integration Testing

13. Write integration tests
```bash
npm run test:e2e -- {test_name}
```

14. Run all tests untuk affected areas
```bash
npm test
```

15. Check test coverage
```bash
npm run test:coverage
```

## Phase 4.5: Mid-Development QA Check (BMad - Optional)

**NEW: BMad Requirements Tracing** (for complex stories)

15a. Verify test coverage mid-development
```bash
@qa *trace docs/stories/epic-1/story-{id}.md
# Or via wrapper:
python execution/bmad_task_wrapper.py --task trace --story docs/stories/epic-1/story-{id}.md
```

Output: `docs/qa/assessments/story-{id}-trace-{date}.md`

Checks:
- Every AC has corresponding tests
- Traceability matrix complete
- Identifies coverage gaps early

**NEW: BMad NFR Assessment** (for performance/security critical)

15b. Check non-functional requirements
```bash
@qa *nfr docs/stories/epic-1/story-{id}.md
# Or via wrapper:
python execution/bmad_task_wrapper.py --task nfr --story docs/stories/epic-1/story-{id}.md
```

Output: `docs/qa/assessments/story-{id}-nfr-{date}.md`

Validates:
- Security implementation
- Performance benchmarks
- Reliability patterns
- Code maintainability

## Phase 5: Quality Assurance

16. Run code quality checker
```bash
python execution/code_quality_checker.py apps/
```

17. Verify all acceptance criteria
    - Check each AC dari story file
    - Mark completed ones
    - Identify any gaps

18. Calculate QA score (0-100)
    - All AC passed: 100
    - Minor issues: 90-99
    - Functional bugs: <90

**NEW: BMad Comprehensive Review** (recommended for all stories)

18a. Run BMad QA review
```bash
@qa *review docs/stories/epic-1/story-{id}.md
# Or via wrapper:
python execution/bmad_task_wrapper.py --task review --story docs/stories/epic-1/story-{id}.md
```

Performs:
- Requirements traceability analysis
- Test level assessment
- Coverage gap identification
- Active refactoring (improves code)
- Generates quality gate decision

Output:
- QA Results section in story file
- Quality gate file: `docs/qa/gates/story-{id}-{slug}.yml`

18b. Check combined quality gate
```bash
python execution/bmad_task_wrapper.py --task gate --story docs/stories/epic-1/story-{id}.md
```

Combined criteria:
- BMad gate: PASS/CONCERNS/FAIL
- DOE QA score: ≥90
- Code quality: ≥85
- Test coverage: ≥80%
- Risk score: <6

## Phase 6: Annealing Loop

19. **IF QA Score < 90**:
    - List specific defects
    - Return to appropriate phase (Backend/Frontend/Testing)
    - Fix defects
    - Re-run QA (goto step 16)
    - Repeat until score ≥ 90

20. **IF QA Score ≥ 90**:
    - Mark story as DONE
    - Update story file dengan completion status
    - Commit changes
    - Proceed to next story

## Phase 7: Documentation & Completion Updates

21. **CRITICAL: Update Story & Epic Files**:
    - You MUST use `multi_replace_file_content` to mark checkboxes as completed.
    - **Story File**: Mark all technical tasks `[x]` and Acceptance Criteria `[x]`.
    - **Epic File**: Mark the corresponding User Story in the main Epic file as `[x]`.
    - verification: Read the file back to ensure `[x]` is present.

22. Generate QA report artifact:
```markdown
## QA Review: Story {id}
**Passed AC**: {list}
**Score**: {score}/100
**Test Coverage**: {percentage}%
**Code Quality**: {score}/100
```

## Phase 8: Completion Loop

23. Check for "Next Steps" in the QA Report or current context.
24. **IF "Next Steps" exist**:
    - Execute the first item in "Next Steps" sequentially.
    - **Verify** the result of the action.
    - Update the QA Report (mark item as done or removed).
    - **LOOP**: GOTO Step 23.
25. **ELSE (All Next Steps Completed)**:
    - **Identify Next Story**: Look for the next pending story in the current Epic (e.g., `story-X.X+1.md`).
    - **Auto-Advance**: If found, print the command to start the next story immediately.
      ```bash
      # Auto-start next story
      /bmad-story-cycle {next-story-file}
      ```
    - Proceed to Exit Criteria.

## Exit Criteria

**Enhanced with BMad Quality Gates**:

- ✅ **BMad Quality Gate**: PASS (or CONCERNS with justification)
- ✅ **DOE QA Score**: ≥ 90
- ✅ **DOE Code Quality**: ≥ 85
- ✅ **DOE Test Coverage**: ≥ 80%
- ✅ **BMad Risk Score**: < 6 (or mitigated)
- ✅ All acceptance criteria met
- ✅ All tests passing
- ✅ P0 tests from test design completed

## Error Handling

Jika error terjadi:
1. Run error recovery workflow
2. Log ke learning database
3. Attempt automated fix
4. Continue from last successful step
