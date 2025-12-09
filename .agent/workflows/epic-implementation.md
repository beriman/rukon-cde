---
description: Complete epic development cycle with full automation
---

# Epic Implementation Workflow

// turbo-all

## Phase 1: Epic Analysis & Planning

1. Scan epic directory untuk identify semua stories
```bash
ls docs/stories/epic-*
```

2. Read epic README dan requirements
```bash
cat docs/stories/epic-1/README.md
```

3. Identify next priority story (Status: Ready/Todo)
   - Check story-*.md files
   - Sort by priority (P0 > P1 > P2)
   - Filter by status

4. Create implementation task breakdown
   - Generate task.md artifact
   - Map acceptance criteria to technical tasks

## Phase 2: Story Development Cycle

5. Execute story development workflow untuk each story
```bash
# This triggers the story-dev-qa.md workflow
/story-dev-qa
```

6. Track progress dengan story tracker
```bash
python execution/story_progress_tracker.py
```

## Phase 3: Integration & Testing

7. Run full test suite setelah semua stories complete
```bash
npm test
```

8. Check test coverage
```bash
npm run test:coverage
```

9. Run API endpoint tests
```bash
python execution/api_endpoint_tester.py
```

10. Code quality check untuk entire epic changes
```bash
python execution/code_quality_checker.py apps/
```

### Phase 4.5: Epic Review & Polish (New)
11. Review all stories for deferred items
    - Check for unchecked boxes in story-*.md
    - Implement postponed features (e.g. Export PDF, Seed Data)
    - Ensure UX consistency

## Phase 4: Deployment Preparation

11. Validate deployment readiness
```bash
python execution/deployment_validator.py --env staging
```

12. Generate release notes dari completed stories
   - Aggregate all story summaries
   - List new features
   - Document breaking changes

13. Create walkthrough artifact
   - Screenshots of new features
   - Test results
   - Deployment checklist

## Phase 5: Epic Completion

14. Update epic SUMMARY.md dengan completion status

15. Mark epic as DONE in documentation

16. Notify user dengan epic completion report

## Exit Criteria

- ✅ All P0 and P1 stories completed
- ✅ Test coverage ≥ 80%
- ✅ Code quality score ≥ 85
- ✅ All acceptance criteria met
- ✅ Deployment validation passed

## Error Handling

Jika ada error di any phase:
1. Trigger `/error-recovery` workflow
2. Log error ke learning database
3. Attempt automated fix
4. Re-run failed step
5. If persists, escalate to user
