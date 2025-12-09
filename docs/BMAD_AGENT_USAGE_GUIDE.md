# BMad Agent Usage Guide

## 🎯 Overview

BMad Method provides specialized agents untuk different aspects of development. This guide explains how to effectively use each agent dalam integrated BMad + DOE system.

## 📚 Available Agents

### 1. SM (Scrum Master) - Bob 🏃

**Role**: Story Preparation Specialist  
**When to Use**: Story creation, epic management, sprint planning

#### Activation

```bash
@sm *help    # Show available commands
```

#### Commands

**`*draft`** - Create New Story
```bash
@sm *draft
```

**Interactive workflow**:
1. Reads epic dari `docs/epics/` atau PRD
2. Reads architecture dari `docs/architecture/`
3. Elicits story details interactively
4. Generates structured story YAML
5. Saves to `docs/stories/epic-X/story-X.X.md`

**Output**: Complete story file dengan:
- User story format
- Acceptance criteria
- Technical tasks
- Dependencies
- Estimates

**`*story-checklist`** - Validate Story Draft
```bash
@sm *story-checklist
```

Validates story against checklist:
- [ ] User story follows format
- [ ] Acceptance criteria clear
- [ ] Technical tasks defined
- [ ] Dependencies documented
- [ ] Story points estimated

#### Best Practices

✅ **DO**:
- Use interactive mode untuk thorough elicitation
- Reference PRD dan Architecture
- Include all dependencies
- Estimate realistically

❌ **DON'T**:
- Skip acceptance criteria
- Create vague technical tasks
- Ignore dependencies
- Rush through elicitation

---

### 2. Dev (Developer) - James 💻

**Role**: Full Stack Implementation Specialist  
**When to Use**: Code implementation, debugging, refactoring

#### Activation

```bash
@dev *help    # Show available commands
```

#### Commands

**`*develop-story`** - Implement Story
```bash
@dev *develop-story
```

**Execution Order**:
1. Read task dari story file
2. Implement code
3. **DOE Enhancement**: Auto database migration
4. Write tests
5. **DOE Enhancement**: Auto-run tests (turbo mode)
6. Execute validations
7. Update task checkbox `[x]`
8. Update File List
9. Repeat until complete

**`*run-tests`** - Execute Tests
```bash
@dev *run-tests
```

Runs:
- Linting
- Unit tests
- Integration tests
- Coverage report

**`*review-qa`** - Apply QA Fixes
```bash
@dev *review-qa
```

Reads QA feedback dan applies fixes systematically.

**`*explain`** - Learning Mode
```bash
@dev *explain
```

Explains what was done untuk learning purposes.

#### Integration with DOE

Dev agent **enhanced** dengan DOE automation:

**Database Operations**:
```bash
# Instead of manual migration
# Agent automatically runs:
python execution/db_migration_auto.py --validate
python execution/db_migration_auto.py --generate "story_changes"
```

**Testing**:
```bash
# Turbo mode auto-approves:
npm test
npm run test:coverage
npm run lint
```

**Error Handling**:
```bash
# On error, triggers:
python execution/error_logger.py --log
# Then checks learning database for fixes
```

#### Best Practices

✅ **DO**:
- Follow story tasks sequentially
- Update story file sections only (tasks, debug log, file list)
- Use DOE scripts untuk repetitive tasks
- Let turbo mode handle tests

❌ **DON'T**:
- Modify story acceptance criteria
- Skip tests
- Manual operations when script available
- Implement without reading story first

---

### 3. QA (Test Architect) - Quinn 🛡️

**Role**: Comprehensive Quality Assurance  
**When to Use**: Throughout development lifecycle

#### Activation

```bash
@qa *help    # Show available commands
```

#### Commands & When to Use

| Command | When | Purpose | Output |
|---------|------|---------|--------|
| `*risk {story}` | After story draft | Identify risks early | `docs/qa/assessments/{story}-risk-{date}.md` |
| `*design {story}` | After risk assessment | Create test strategy | `docs/qa/assessments/{story}-test-design-{date}.md` |
| `*trace {story}` | Mid-development | Verify coverage | `docs/qa/assessments/{story}-trace-{date}.md` |
| `*nfr {story}` | During/after dev | Check quality attributes | `docs/qa/assessments/{story}-nfr-{date}.md` |
| `*review {story}` | Story complete | Full assessment | QA section in story + gate file |
| `*gate {story}` | After fixes | Update quality decision | `docs/qa/gates/{story}-{slug}.yml` |

#### Detailed Command Usage

**`*risk {story}`** - Risk Profiling
```bash
@qa *risk docs/stories/epic-1/story-1.4.md
```

**What it does**:
- Analyzes story for implementation risks
- Categories: Technical, Security, Performance, Data, Business, Operational
- Scores each risk: Probability × Impact (1-9 scale)
- Provides mitigation strategies

**Risk Thresholds**:
- **≥9**: FAIL (critical, must address)
- **≥6**: CONCERNS (significant, should address)
- **<6**: PASS (acceptable)

**`*design {story}`** - Test Design
```bash
@qa *design docs/stories/epic-1/story-1.4.md
```

**What it does**:
- Creates test scenarios untuk each AC
- Recommends test levels (unit/integration/e2e)
- Prioritizes tests (P0/P1/P2)
- Defines test data requirements

**Example output**:
```yaml
test_summary:
  total: 24
  by_level:
    unit: 15
    integration: 7
    e2e: 2
  by_priority:
    P0: 8   # Critical tests
    P1: 10  # Important tests
    P2: 6   # Nice-to-have tests
```

**`*trace {story}`** - Requirements Tracing
```bash
@qa *trace docs/stories/epic-1/story-1.4.md
```

** What it does**:
- Maps cada AC ke validating tests
- Uses Given-When-Then format
- Identifies coverage gaps
- Creates traceability matrix

**`*nfr {story}`** - NFR Assessment
```bash
@qa *nfr docs/stories/epic-1/story-1.4.md
```

**Validates**:
- **Security**: Auth, authorization, data protection
- **Performance**: Response times, throughput
- **Reliability**: Error handling, failover
- **Maintainability**: Code quality, documentation

**`*review {story}`** - Comprehensive Review
```bash
@qa *review docs/stories/epic-1/story-1.4.md
```

**Performs**:
- Requirements traceability check
- Test level analysis
- Coverage assessment
- **Active refactoring** (improves code)
- Quality gate decision

**Generates**:
- QA Results section in story file
- Quality gate YAML file

**`*gate {story}`** - Update Gate
```bash
@qa *gate docs/stories/epic-1/story-1.4.md
```

Updates gate status after fixes applied.

#### Quality Gate Decisions

**PASS**: ✅
- All critical requirements met
- No blocking issues
- Ready for production

**CONCERNS**: ⚠️
- Non-critical issues found
- Team should review
- Consider fixing before deploy

**FAIL**: ❌
- Critical issues present
- Must address before continuing
- Security risks, missing P0 tests

**WAIVED**: 🔓
- Issues acknowledged
- Explicitly accepted by team
- Requires: reason, approver, expiry date

#### Integration with DOE

QA findings feed into DOE learning:

**Risk Patterns** → DOE Error Database
```python
# High-risk patterns logged:
{
  "risk_category": "security",
  "risk_score": 9,
  "mitigation": "Add input validation",
  "pattern": "Missing auth check"
}
```

**NFR Failures** → DOE Quality Checks
```python
# NFR violations trigger DOE fixes:
if nfr_result['security'] == 'FAIL':
    run_security_audit()
    apply_security_patterns()
```

**Test Coverage Gaps** → DOE Test Generation
```python
# Missing tests identified:
generate_missing_tests(coverage_gaps)
```

#### Best Practices

✅ **DO**:
- Run `*risk` dan `*design` BEFORE development
- Use `*trace` mid-development untuk early gap detection
- Run `*review` when story marked complete
- Update `*gate` after addressing issues
- Document waived issues properly

❌ **DON'T**:
- Skip risk assessment for complex stories
- Wait until end to check coverage
- Ignore CONCERNS status
- Waive critical issues without proper docs

---

## 🔄 Typical Workflow Using All Agents

### Phase 1: Planning
```bash
@sm *draft                          # Create story
@sm *story-checklist                # Validate
@qa *risk {story}                   # Assess risks
@qa *design {story}                 # Plan tests
```

### Phase 2: Development
```bash
@dev *develop-story                 # Implement
# DOE automation runs:
# - Database migrations
# - Tests (turbo mode)
# - Error logging
```

### Phase 3: Mid-Dev Check (Optional for High-Risk)
```bash
@qa *trace {story}                  # Check coverage
@qa *nfr {story}                    # Validate NFRs
@dev Apply fixes if needed
```

### Phase 4: Review
```bash
@qa *review {story}                 # Comprehensive review
python execution/code_quality_checker.py  # DOE check
```

### Phase 5: Gate Decision
```bash
# Combined criteria check:
# - BMad gate: PASS
# - DOE QA score: ≥90
# - Code quality: ≥85
# - Test coverage: ≥80%

# If FAIL:
@dev *review-qa                     # Apply fixes
@qa *gate {story}                   # Update gate
```

---

## 🎯 Integration Points

### BMad → DOE
- Risk scores → Error prevention patterns
- Test design → Automated test generation
- NFR requirements → Quality checks
- Coverage gaps → Test suggestions

### DOE → BMad
- Error patterns → Risk assessment
- Quality metrics → Gate decisions
- Automated fixes → QA review input
- Progress tracking → Sprint planning

---

## 📊 Success Metrics

Track these untuk measure effectiveness:

**Story Quality**:
- Compliance dengan draft checklist: ≥95%
- Compliance dengan DOD checklist: ≥90%

**Risk Management**:
- P0 risks identified before dev: 100%
- P0 risks mitigated: 100%

**Test Coverage**:
- Test design created: 100% of stories
- Coverage achieved: ≥80%

**Quality Gates**:
- First-time PASS rate: Target ≥70%
- WAIVED without justification: 0%

---

## 🆘 Troubleshooting

**Q: Agent not responding to commands?**
A: Check agent activation dengan `@{agent} *help` first

**Q: BMad task files not found?**
A: Verify `.bmad-core/tasks/` directory exists

**Q: QA assessments not generated?**
A: Ensure `docs/qa/assessments/` directory exists

**Q: Quality gate always CONCERNS?**
A: Check combined criteria - need both BMad AND DOE thresholds met

---

## 📚 Further Reading

- [BMad User Guide](.bmad-core/user-guide.md)
- [BMad Task Files](.bmad-core/tasks/)
- [DOE Integration Guide](docs/BMAD_DOE_INTEGRATION_GUIDE.md)
- [Hybrid Workflow](.agent/workflows/bmad-story-cycle.md)

---

**Version**: 1.0  
**Last Updated**: 2025-12-09  
**Integration**: BMad Method + DOE Framework
