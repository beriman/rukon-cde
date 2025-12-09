---
description: Complete story lifecycle combining BMad planning with DOE automation
---

# BMad Story Cycle - Hybrid Workflow

**Integration**: BMad Method + DOE Framework  
**Purpose**: Best-of-both-worlds story development cycle

// turbo-all

## Phase 1: Story Creation (BMad SM Agent)

### Use BMad SM for Structured Story Creation

1. **Activate BMad SM Agent**
```bash
# In your IDE, activate the SM (Scrum Master) agent
@sm *help
# or
/sm *help
```

2. **Create Story from Epic**
```bash
@sm *draft
```

This will:
- Read epic requirements from `.bmad-core/epics/`
- Read architecture from `docs/architecture/`
- Interactively elicit story details
- Generate structured story YAML file
- Save to `docs/stories/epic-X/story-X.X.md`

3. **Story Draft Checklist**
```bash
@sm *story-checklist
```

Validates:
- [ ] User story follows proper format
- [ ] Acceptance criteria are clear and testable
- [ ] Technical tasks are well-defined
- [ ] Dependencies documented
- [ ] Estimates provided

---

## Phase 2: Risk Assessment & Test Planning (BMad QA Agent)

### Use BMad QA for Proactive Quality Planning

4. **Assess Implementation Risks**
```bash
@qa *risk {story-file}
```

Output: `docs/qa/assessments/epic-X.story-X-risk-YYYYMMDD.md`

Identifies:
- Technical risks (complexity, unknowns)
- Security risks (auth, data exposure)
- Performance risks (scalability, load)
- Data risks (migration, integrity)
- Mitigation strategies

5. **Create Test Strategy**
```bash
@qa *design {story-file}
```

Output: `docs/qa/assessments/epic-X.story-X-test-design-YYYYMMDD.md`

Defines:
- Test scenarios for each AC
- Test levels (unit/integration/e2e)
- Priority (P0/P1/P2)
- Test data requirements
- Mock strategies

---

## Phase 3: Development (Hybrid: BMad Dev + DOE Automation)

### Database Changes (DOE Workflow)

6. **If story requires database changes**:
```bash
# DOE automation for database
python execution/db_migration_auto.py --validate
python execution/db_migration_auto.py --generate "story_X_X_changes"
```

Auto-validates schema and generates migration.

### Backend Development (DOE + BMad)

7. **Activate BMad Dev Agent**
```bash
@dev *develop-story
```

Dev agent will:
- Read story tasks sequentially
- Implement backend code
- **Enhanced with DOE**: Auto-run database scripts
- **Enhanced with DOE**: Auto-run tests (turbo mode)
- **CRITICAL: Update task checkboxes in story-X.X.md as you complete them**

8. **API Development** (follows DOE directive)
- Use directive: `directives/api-development.md`
- Implement Controllers, Services, DTOs
- Add RBAC guards
- Ensure multi-tenancy isolation

### Frontend Development (DOE + BMad)

9. **UI Implementation** (follows DOE directive)
- Use directive: `directives/frontend-development.md`
- Create Next.js pages/components
- Integrate with API
- Add loading/error states

### Automated Testing (DOE Turbo Mode)

10. **Test Execution** (auto-approved)
```bash
# These run automatically in turbo mode
npm test
npm run test:coverage
npm run lint
```

---

## Phase 4: Mid-Development QA Check (BMad QA - Optional)

### For High-Risk Stories

11. **Verify Test Coverage**
```bash
@qa *trace {story-file}
```

Output: `docs/qa/assessments/epic-X.story-X-trace-YYYYMMDD.md`

Ensures:
- Every AC has corresponding tests
- Traceability matrix complete
- Coverage gaps identified

12. **Check Quality Attributes**
```bash
@qa *nfr {story-file}
```

Output: `docs/qa/assessments/epic-X.story-X-nfr-YYYYMMDD.md`

Validates:
- Security implementation
- Performance benchmarks
- Reliability patterns
- Code maintainability

---

## Phase 5: Review & Quality Assurance (Hybrid)

### DOE Code Quality Check

13. **Automated Quality Analysis**
```bash
# Auto-runs in turbo mode
python execution/code_quality_checker.py apps/
```

Checks:
- ESLint compliance
- Code complexity
- Security patterns
- Naming conventions
- Quality score (0-100)

### BMad Comprehensive Review

14. **Activate BMad QA Agent**
```bash
@qa *review {story-file}
```

Performs:
- Requirements traceability analysis
- Test level assessment
- Coverage gap identification
- **Active refactoring** (improves code directly)
- Generates quality gate decision

Output:
- Updated story file with QA results
- Quality gate file: `docs/qa/gates/epic-X.story-X-{slug}.yml`

---

## Phase 6: Quality Gate Decision (BMad + DOE Combined)

### Combined Quality Criteria

15. **Check Combined Metrics**

| Criteria | Source | Threshold |
|----------|--------|-----------|
| BMad Gate | BMad QA | PASS |
| QA Score | DOE | ≥ 90 |
| Code Quality | DOE | ≥ 85 |
| Test Coverage | DOE | ≥ 80 |
| Risk Level | BMad | < 6 |

**If ALL criteria met**: ✅ **APPROVED** → Go to Phase 7

**If ANY criteria failed**:

16. **Automatic Error Recovery** (DOE)
```bash
# DOE workflow triggers automatically
/error-recovery
```

Or manually:
```bash
@dev Apply fixes based on QA feedback
```

Then loop back to Phase 5 (re-review).

---

## Phase 7: Finalization

### BMad Story Completion

17. **Update Quality Gate** (if fixes applied)
```bash
@qa *gate {story-file}
```

Updates gate status based on latest review.

### DOE Progress Tracking

18. **Update Progress**
```bash
python execution/story_progress_tracker.py --epic epic-X
```

Shows:
- Epic completion percentage
- Story status
- Next recommended story

### Mark Story Complete

19. **Final Steps**:
- [ ] All tasks checked `[x]` in story file
- [ ] Quality gate: PASS
- [ ] All tests passing
- [ ] Code committed
- [ ] Story status: "✅ Complete"

---

## Exit Criteria

**Story is DONE when**:
- ✅ BMad quality gate: PASS
- ✅ DOE QA score: ≥ 90
- ✅ DOE code quality: ≥ 85
- ✅ Test coverage: ≥ 80%
- ✅ All acceptance criteria met
- ✅ No P0 risks unmitigated
- ✅ All regression tests passing

---

## Error Handling

**If errors occur at any phase**:

1. **DOE Error Recovery** (automated)
```bash
/error-recovery
```

2. **BMad QA Guidance** (structured fixes)
```bash
@dev *review-qa
# Applies fixes from QA review
```

3. **Learning Capture**:
- DOE logs error to learning database
- BMad captures in QA assessment
- Both systems learn for future stories

---

## Slash Commands Quick Reference

### Story Creation
```bash
/bmad-story-cycle        # This full workflow
@sm *draft               # BMad: Create story
@sm *story-checklist     # BMad: Validate draft
```

### Quality Assurance
```bash
@qa *risk {story}        # BMad: Risk assessment
@qa *design {story}      # BMad: Test strategy
@qa *trace {story}       # BMad: Coverage check
@qa *nfr {story}         # BMad: NFR validation
@qa *review {story}      # BMad: Full review
@qa *gate {story}        # BMad: Update gate
```

### Development
```bash
@dev *develop-story      # BMad: Implement story
/database-migration      # DOE: DB automation
/testing-deployment      # DOE: Test & deploy
/error-recovery          # DOE: Auto-fix errors
```

### Monitoring
```bash
python execution/story_progress_tracker.py --epic epic-1
python execution/error_logger.py --stats
python execution/project_health_check.py
```

---

## Best Practices

✅ **DO**:
- Always run `@qa *risk` and `@qa *design` before development
- Use DOE turbo mode for faster execution
- Let BMad QA provide comprehensive review
- Capture learnings in both systems
- Trust automated quality checks

❌ **DON'T**:
- Skip risk assessment for complex stories
- Bypass quality gates
- Ignore BMad QA recommendations
- Disable turbo mode unnecessarily
- Manual operations when scripts available

---

**Integration Benefits**:
- 🎯 **Better Planning**: BMad structured elicitation
- ⚡ **Faster Execution**: DOE automation & turbo mode
- 🛡️ **Higher Quality**: BMad comprehensive QA + DOE metrics
- 🧠 **Continuous Learning**: Both systems capture patterns
- 📊 **Measurable**: Combined metrics track improvement

**Created**: 2025-12-09  
**Integration**: BMad Method v1.0 + DOE Framework v1.0  
**Status**: Production Ready
