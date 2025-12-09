# Test Validation Guide - BMad + DOE Integration

## 🎯 Purpose

This guide provides step-by-step testing procedures untuk validate BMad + DOE integration system.

## ✅ Prerequisites

Before testing, ensure:
- [ ] All phases 1-3 complete
- [ ] `.agent-config.json` has `bmad_integration.enabled: true`
- [ ] BMad agents available in `.bmad-core/agents/`
- [ ] All execution scripts created
- [ ] Python 3.8+ installed

## 🧪 Test Suite

### Test 1: Configuration Validation

**Purpose**: Verify configuration struktur correct

**Steps**:
1. Check config file exists:
   ```bash
   cat .agent-config.json | grep bmad_integration
   ```

2. Verify BMad agents configured:
   ```bash
   cat .agent-config.json | grep -A 10 bmad_agents
   ```

**Expected Output**:
```json
"bmad_integration": {
  "enabled": true,
  "mode": "hybrid",
  "active_agents": ["sm", "dev", "qa"]
}
```

**Status**: ✅ PASS / ❌ FAIL

---

### Test 2: BMad Task Wrapper

**Purpose**: Validate Python wrapper functionality

**Steps**:
1. Run risk assessment wrapper:
   ```bash
   python execution/bmad_task_wrapper.py --task risk --story docs/stories/epic-1/story-1.1.md
   ```

2. Verify output structure

**Expected Output**:
```json
{
  "task": "risk-profile",
  "story": "docs/stories/epic-1/story-1.1.md",
  "assessment_file": "docs/qa/assessments/...",
  "status": "pending_agent_execution",
  "command": "@qa *risk ..."
}
```

**Validation**:
- [ ] Script runs without errors
- [ ] Correct assessment file path generated
- [ ] Manual command provided

**Status**: ✅ PASS / ❌ FAIL

---

### Test 3: Quality Gate Mapper

**Purpose**: Test BMad gate to DOE score mapping

**Steps**:
1. Run quality gate check:
   ```bash
   python execution/quality_gate_mapper.py --story docs/stories/epic-1/story-1.5.md
   ```

2. Verify combined criteria checked

**Expected Output**:
```
🎯 Checking Combined Quality Gate...
✅ BMad Gate: PASS (Score: 100/100)

📊 DOE Metrics:
   QA Score: 0/100
   Code Quality: 0/100
   Test Coverage: 0%

🏁 Combined Result: ❌ FAIL
```

**Validation**:
- [ ] Reads config thresholds correctly
- [ ] Checks all criteria
- [ ] Generates proper recommendation

**Status**: ✅ PASS / ❌ FAIL

---

### Test 4: NFR Assessment

**Purpose**: Validate NFR automation

**Steps**:
1. Run NFR assessment:
   ```bash
   python execution/nfr_assessment.py \
     --story docs/stories/epic-1/story-1.1.md \
     --files apps/api/src/users/*.ts
   ```

**Expected Output**:
```
🎯 Running NFR Assessment...
🔒 Checking Security NFRs...
⚡ Checking Performance NFRs...
🛡️ Checking Reliability NFRs...
🔧 Checking Maintainability NFRs...

📊 Overall NFR Score: 0/100
🏁 Status: PENDING
```

**Validation**:
- [ ] All 4 categories checked
- [ ] Score calculated
- [ ] Status determined

**Status**: ✅ PASS / ❌ FAIL

---

### Test 5: Unified Quality Dashboard

**Purpose**: Test dashboard generation

**Steps**:
1. Generate dashboard:
   ```bash
   python execution/quality_dashboard.py \
     --epic epic-1 \
     --output test-dashboard.md
   ```

2. Review generated file

**Expected**:
- [ ] Dashboard file created
- [ ] Contains summary table
- [ ] Shows BMad gate distribution
- [ ] Shows DOE metrics breakdown
- [ ] Has insights section

**Status**: ✅ PASS / ❌ FAIL

---

### Test 6: Automated Gate Checker

**Purpose**: Test automated quality checking

**Steps**:
1. Run automated checker:
   ```bash
   python execution/automated_gate_checker.py \
     --story docs/stories/epic-1/story-1.5.md \
     --auto
   ```

**Expected Output**:
```
🤖 AUTOMATED GATE CHECKER
📄 Story: story-1.5.md
📊 Story Status: IN_PROGRESS

⚠️  Story not ready for review
   Mark story as 'Ready for Review' to trigger checks
```

**Validation**:
- [ ] Checks story status
- [ ] Runs gate mapper if ready
- [ ] Generates recommendation
- [ ] Saves results to JSON

**Status**: ✅ PASS / ❌ FAIL

---

### Test 7: Workflow Integration

**Purpose**: Verify BMad tasks integrated in workflows

**Steps**:
1. Review story-dev-qa workflow:
   ```bash
   cat .agent/workflows/story-dev-qa.md | grep -A 5 "Phase 0"
   ```

2. Verify BMad phases present:
   - [ ] Phase 0: Pre-Development QA (risk + design)
   - [ ] Phase 4.5: Mid-Development QA (trace + nfr)
   - [ ] Phase 5: Enhanced dengan BMad review

**Status**: ✅ PASS / ❌ FAIL

---

### Test 8: Learning Database Integration

**Purpose**: Verify BMad patterns in learning DB

**Steps**:
1. Check learning database:
   ```bash
   cat execution/data/learning_database.json | grep -A 10 bmad_integration
   ```

**Expected**:
- [ ] `bmad_integration` section exists
- [ ] `checklists` configured (story_draft, story_dod, architect)
- [ ] `qa_patterns` defined (risk thresholds, NFR categories)
- [ ] `combined_quality_criteria` set

**Status**: ✅ PASS / ❌ FAIL

---

### Test 9: GEMINI.md Update

**Purpose**: Verify system prompt includes BMad

**Steps**:
1. Check GEMINI.md:
   ```bash
   cat GEMINI.md | grep -A 15 "BMad Method Integration"
   ```

**Expected**:
- [ ] Section 7: BMad Method Integration exists
- [ ] BMad agents listed
- [ ] Hybrid workflows explained
- [ ] Quality integration described
- [ ] Learning merge documented

**Status**: ✅ PASS / ❌ FAIL

---

### Test 10: End-to-End Workflow

**Purpose**: Test complete hybrid workflow

**Steps**:
1. Manually create test story using BMad SM:
   - Describe as if running `@sm *draft`
   - Expected: Structured story file

2. Run risk assessment:
   ```bash
   python execution/bmad_task_wrapper.py --task risk --story {test_story}
   ```

3. Run test design:
   ```bash
   python execution/bmad_task_wrapper.py --task design --story {test_story}
   ```

4. Simulate development complete

5. Run automated gate check:
   ```bash
   python execution/automated_gate_checker.py --story {test_story} --auto
   ```

6. Generate dashboard:
   ```bash
   python execution/quality_dashboard.py --epic epic-1
   ```

**Validation**:
- [ ] All steps execute without errors
- [ ] Assessment files generated
- [ ] Quality gate checked
- [ ] Dashboard includes test story

**Status**: ✅ PASS / ❌ FAIL

---

## 📊 Test Results Summary

| Test | Description | Status | Notes |
|------|-------------|--------|-------|
| 1 | Config Validation | ⏳ PENDING | |
| 2 | BMad Task Wrapper | ⏳ PENDING | |
| 3 | Quality Gate Mapper | ⏳ PENDING | |
| 4 | NFR Assessment | ⏳ PENDING | |
| 5 | Quality Dashboard | ⏳ PENDING | |
| 6 | Automated Gate Checker | ⏳ PENDING | |
| 7 | Workflow Integration | ⏳ PENDING | |
| 8 | Learning DB Integration | ⏳ PENDING | |
| 9 | GEMINI.md Update | ⏳ PENDING | |
| 10 | End-to-End Workflow | ⏳ PENDING | |

**Overall Status**: ⏳ PENDING EXECUTION

---

## 🐛 Known Limitations

1. **BMad Agent Execution**: Wrappers provide structure but require actual BMad agent untuk full execution
2. **Metrics Calculation**: DOE metrics currently return placeholder values (need integration with actual tools)
3. **Gate File Reading**: Requires BMad QA agent to have run `*review` first
4. **Dashboard Data**: Limited to structure until stories have actual quality data

---

## 🔧 Troubleshooting

### Test Failures

**Script Not Found**:
- Verify file exists in `execution/` directory
- Check file permissions

**Import Errors**:
- Ensure Python 3.8+ installed
- Check all scripts in `execution/` directory

**Config Not Found**:
- Verify `.agent-config.json` exists in project root
- Check JSON syntax valid

**No BMad Agents**:
- Verify `.bmad-core/agents/` directory exists
- Check `core-config.yaml` configured

---

## 📝 Test Execution Log

**Date**: _____________________  
**Tester**: _____________________  
**Environment**: _____________________

**Results**:
- Tests Passed: _____ / 10
- Tests Failed: _____ / 10
- Overall Status: ✅ / ⚠️ / ❌

**Issues Found**:
_________________________________
_________________________________
_________________________________

**Recommendations**:
_________________________________
_________________________________
_________________________________

---

**Version**: 1.0  
**Last Updated**: 2025-12-09  
**Integration**: BMad Method + DOE Framework
