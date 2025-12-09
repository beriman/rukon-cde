# BMad + DOE Integration Guide

## 🎯 Overview

This guide explains how to use the integrated **BMad Method + DOE Framework** system for maximum productivity.

## 🔄 Integration Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    USER REQUEST                         │
└────────────────────┬────────────────────────────────────┘
                     │
            ┌────────┴────────┐
            │                 │
       Planning          Development
            │                 │
    ┌───────▼──────┐   ┌──────▼───────┐
    │ BMad Agents  │   │ DOE Turbo    │
    │ - SM         │   │ - Automation │
    │ - QA         │   │ - Scripts    │
    └───────┬──────┘   └──────┬───────┘
            │                 │
            └────────┬────────┘
                     │
             ┌───────▼───────┐
             │   Combined    │
             │   Quality     │
             │   & Learning  │
             └───────────────┘
```

## 🚀 Quick Start

### Using the Hybrid Workflow

```bash
# Complete story lifecycle
/bmad-story-cycle

# Or use specific phases:
@sm *draft              # BMad: Create story
@qa *risk {story}       # BMad: Assess risks
@dev *develop-story     # Hybrid: Development
@qa *review {story}     # BMad: Quality review
```

## 📚 Available BMad Agents

### 1. SM (Scrum Master)
**When to use**: Story creation, story validation

```bash
@sm *help              # Show available commands
@sm *draft             # Create new story from epic
@sm *story-checklist   # Validate story draft
```

**Output**: Structured story file in `docs/stories/epic-X/story-X.X.md`

### 2. Dev (Developer)
**When to use**: Story implementation

```bash
@dev *develop-story    # Implement story tasks
@dev *run-tests        # Execute tests
@dev *review-qa        # Apply QA fixes
```

**Enhanced with DOE**:
- Auto database migration
- Turbo mode test execution
- Error logging to learning DB

### 3. QA (Test Architect)
**When to use**: Quality assurance throughout development

```bash
@qa *risk {story}      # Risk assessment (before dev)
@qa *design {story}    # Test strategy (before dev)
@qa *trace {story}     # Coverage check (during dev)
@qa *nfr {story}       # NFR validation (during dev)
@qa *review {story}    # Full review (after dev)
@qa *gate {story}      # Update quality gate
```

**Outputs**: QA assessments in `docs/qa/assessments/`, gates in `docs/qa/gates/`

## 🔧 Configuration

All integration settings in `.agent-config.json`:

```json
{
  "bmad_integration": {
    "enabled": true,
    "mode": "hybrid",
    "active_agents": ["sm", "dev", "qa"],
    "active_tasks": [
      "create-next-story.md",
      "risk-profile.md",
      "review-story.md"
    ]
  }
}
```

## 📊 Quality Criteria

Story passes when **ALL** criteria met:

| Criteria | Source | Threshold |
|----------|--------|-----------|
| BMad Quality Gate | BMad QA | PASS |
| QA Score | DOE | ≥ 90 |
| Code Quality | DOE | ≥ 85 |
| Test Coverage | DOE | ≥ 80% |
| Risk Score | BMad | < 6 |

## 🎓 Best Practices

### Use BMad For:
✅ Story creation (better elicitation)  
✅ Risk assessment (proactive)  
✅ Test planning (comprehensive)  
✅ QA review (thorough)  
✅ Quality gates (structured decisions)

### Use DOE For:
✅ Database migrations (automated)  
✅ Code execution (turbo mode)  
✅ Testing (automated, fast)  
✅ Error recovery (self-healing)  
✅ Progress tracking (metrics)

## 🔄 Typical Workflow

1. **@sm *draft** → Create story
2. **@qa *risk** → Assess risks
3. **@qa *design** → Plan tests
4. **@dev *develop-story** → Implement (DOE automation)
5. **@qa *trace** → Check coverage (mid-dev)
6. **@qa *review** → Final review
7. **@qa *gate** → Quality decision

## 📈 Expected Benefits

- **Story Quality**: +40% improvement
- **QA Coverage**: 80% → 95%+
- **Development Speed**: Maintained (turbo mode)
- **Error Prevention**: +50% fewer bugs
- **Learning Rate**: +30% improvement

## 🆘 Troubleshooting

**Q: BMad agent not found?**  
A: Check `.bmad-core/agents/` exists and `.agent-config.json` has `bmad_integration.enabled: true`

**Q: Quality gate always FAIL?**  
A: Check combined criteria - need BOTH BMad gate PASS AND DOE scores above thresholds

**Q: Turbo mode not working?**  
A: Verify `.agent-config.json` has workflow in `turbo_mode.workflows_with_turbo` list

## 📝 Further Reading

- [BMad User Guide](.bmad-core/user-guide.md)
- [DOE Agent Automation Guide](docs/AGENT_AUTOMATION_GUIDE.md)
- [BMad Integration Analysis](artifacts/bmad_integration_analysis.md)
- [Hybrid Workflow](. agent/workflows/bmad-story-cycle.md)

---

**Integration Version**: 1.0  
**Last Updated**: 2025-12-09  
**Status**: Production Ready
