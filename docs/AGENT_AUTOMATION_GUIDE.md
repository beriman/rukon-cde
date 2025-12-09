# Agent Automation Guide

## 🤖 Overview

Sistem agent automation ini dibangun dengan framework **DOE (Directive, Orchestration, Execution)** untuk meningkatkan produktivitas dan mengurangi manual intervention hingga 70%.

## 📁 Struktur

```
.
├── .agent/
│   └── workflows/          # Workflow files dengan turbo mode
├── directives/             # SOPs untuk berbagai tasks
├── execution/              # Python scripts untuk automation
│   └── data/              # Learning database & error logs
├── .agent-config.json      # Central configuration
└── GEMINI.md              # System prompt untuk agent
```

## 🚀 Workflows

Workflows adalah step-by-step procedures yang dapat dieksekusi agent. Gunakan slash commands untuk menjalankan:

### Available Workflows

1. **`/epic-implementation`** - Complete epic development cycle
   - Auto-select stories
   - Execute development
   - Run tests
   - Deploy to staging

2. **`/story-dev-qa`** - Development & QA untuk satu story
   - Backend development
   - Frontend development
   - Testing
   - QA scoring

3. **`/database-migration`** - Database operations
   - Schema validation
   - Migration generation
   - Migration execution
   - Verification

4. **`/testing-deployment`** - Testing & deployment
   - Unit tests
   - Integration tests
   - Build
   - Deploy

5. **`/error-recovery`** - Automated error recovery
   - Error detection
   - Pattern matching
   - Automated fix
   - Learning

### Turbo Mode

Workflows dengan `// turbo-all` annotation akan auto-run commands tanpa approval:

```markdown
// turbo-all

1. Run tests
```bash
npm test
```
```

Commands yang auto-approved dapat dikonfigurasi di `.agent-config.json`.

## 🔗 BMad Method Integration

**NEW**: BMad Method telah diintegrasikan untuk hybrid approach yang menggabungkan structured planning dengan DOE automation.

### BMad + DOE Hybrid Workflow

**Main Workflow**: `/bmad-story-cycle`

Combines BMad planning/QA dengan DOE execution automation:
- **BMad SM**: Story creation dengan elicitation
- **BMad QA**: Risk assessment, test design, comprehensive review
- **DOE**: Automated testing, database migration, error recovery

### BMad Agents Available

1. **SM (Scrum Master)**
   ```bash
   @sm *draft              # Create story from epic
   @sm *story-checklist    # Validate story
   ```

2. **Dev (Developer)**
   ```bash
   @dev *develop-story     # Implement dengan DOE automation
   @dev *run-tests         # Execute tests
   @dev *review-qa         # Apply QA fixes
   ```

3. **QA (Test Architect)**
   ```bash
   @qa *risk {story}       # Risk assessment (before dev)
   @qa *design {story}     # Test strategy (before dev)
   @qa *trace {story}      # Coverage check (mid-dev)
   @qa *nfr {story}        # NFR validation
   @qa *review {story}     # Comprehensive review
   @qa *gate {story}       # Quality gate decision
   ```

### BMad Task Wrappers

Python wrappers untuk invoke BMad tasks programmatically:

```bash
# Risk assessment
python execution/bmad_task_wrapper.py --task risk --story {story}

# Test design
python execution/bmad_task_wrapper.py --task design --story {story}

# Comprehensive review
python execution/bmad_task_wrapper.py --task review --story {story}
```

### Quality System Unification

**Combined Quality Criteria**:
- BMad Quality Gate: PASS/CONCERNS/FAIL/WAIVED
- DOE QA Score: ≥90
- DOE Code Quality: ≥85
- DOE Test Coverage: ≥80%

**Quality Automation Scripts**:

```bash
# Check combined quality gate
python execution/quality_gate_mapper.py --story {story}

# NFR assessment (24 checks)
python execution/nfr_assessment.py --story {story} --files {changed_files}

# Generate quality dashboard
python execution/quality_dashboard.py --epic epic-1

# Automated gate checking
python execution/automated_gate_checker.py --story {story} --auto
```

### When to Use BMad vs DOE

**Use BMad For**:
- ✅ Story creation (better structure)
- ✅ Risk assessment (proactive)
- ✅ Test planning (comprehensive)
- ✅ QA review (thorough)
- ✅ Quality gates (structured decisions)

**Use DOE For**:
- ✅ Database migrations (automated)
- ✅ Code execution (turbo mode)
- ✅ Testing (automated, fast)
- ✅ Error recovery (self-healing)
- ✅ Progress tracking (metrics)

### BMad Documentation

Detailed guides available:
- `docs/BMAD_DOE_INTEGRATION_GUIDE.md` - Quick start
- `docs/BMAD_AGENT_USAGE_GUIDE.md` - Agent details
- `.agent/workflows/bmad-story-cycle.md` - Workflow
- `.bmad-core/user-guide.md` - BMad Method guide

## 📚 Directives (SOPs)

Directives adalah Standard Operating Procedures untuk berbagai task types:

- `database-operations.md` - Database schema & migrations
- `api-development.md` - NestJS API endpoints
- `frontend-development.md` - Next.js pages & components
- `testing-strategy.md` - Comprehensive testing
- `story_implementation_cycle.md` - Story development cycle

Agent akan membaca directives yang relevan sesuai task yang dikerjakan.

## 🐍 Execution Scripts

Python scripts untuk automasi tasks berulang:

### Database Migration
```bash
python execution/db_migration_auto.py --validate
python execution/db_migration_auto.py --generate "migration_name"
python execution/db_migration_auto.py --apply
python execution/db_migration_auto.py --full
```

### Story Progress Tracking
```bash
python execution/story_progress_tracker.py --epic epic-1
```

### Error Logging
```bash
python execution/error_logger.py --stats
python execution/error_logger.py --recent 10
```

### Project Health Check
```bash
python execution/project_health_check.py
```

## 🧠 Self-Annealing System

Agent dapat belajar dari errors dan improve over time:

### How It Works

1. **Error Detection** - Error terjadi (test fail, build fail, etc.)
2. **Classification** - Error dianalisis dan dikategorikan
3. **Pattern Matching** - Cek learning database untuk similar errors
4. **Automated Fix** - Apply fix jika confidence ≥ 85%
5. **Learning** - Update database dengan pattern baru

### Learning Database

Located at `execution/data/learning_database.json`:

```json
{
  "error_patterns": [
    {
      "error_code": "P2002",
      "description": "Unique constraint violation",
      "automated_fix": "...",
      "confidence_score": 0.90
    }
  ]
}
```

### Error Recovery Workflow

Jika error terjadi, agent akan:

1. Log error dengan context
2. Search learning database
3. Suggest fixes dengan confidence scores
4. Apply automated fix (if high confidence)
5. Verify fix works
6. Update database with results

## ⚙️ Configuration

Edit `.agent-config.json` untuk customize behavior:

```json
{
  "turbo_mode": {
    "enabled": true,
    "auto_approve_commands": ["npm test", "npm run build"]
  },
  "self_annealing": {
    "enabled": true,
    "auto_fix_confidence_threshold": 0.85,
    "max_retry_attempts": 3
  }
}
```

## 📊 Monitoring Performance

### Story Progress
```bash
python execution/story_progress_tracker.py --epic epic-1
```

Output:
```
📊 PROGRESS REPORT: EPIC-1
Overall Completion: 75.5%
Story Points: 30/40
Tasks: 85/112

✅ Complete: 8
🚧 In Progress: 3
📋 Not Started: 2
```

### Error Statistics
```bash
python execution/error_logger.py --stats
```

Output:
```
ERROR STATISTICS
Total Errors: 25
Resolved: 22
Unresolved: 3

By Type:
  ValidationError: 10
  PrismaError: 8
  TypeScript: 7
```

## 🎯 Best Practices

### For Users

✅ **DO**:
- Use workflows untuk repetitive tasks
- Review automated fixes before deploying
- Monitor error patterns
- Update directives dengan learnings
- Keep learning database updated

❌ **DON'T**:
- Disable turbo mode untuk critical operations
- Ignore unresolved errors
- Skip workflow steps manually
- Override safety checks
- Forget `-y` flag in npx/npm commands (causes interactive prompts)

### Common Shell Prompts (Auto-Accept Strategies)
- **npx**: Use `npx -y package@version` to suppress "Need to install..." prompt.
- **npm init**: Use `npm init -y` to suppress questionnaire.
- **shadcn**: Use `init -d` (defaults) and `add -y` (yes) to skip confirmations.

### For Agent

Agent should:
- Follow directives strictly
- Use execution scripts instead of manual operations
- Log all errors untuk learning
- Update directives ketika menemukan better patterns
- Request user approval untuk high-risk operations

## 🔧 Troubleshooting

### Workflow Not Working

1. Check `.agent-config.json` - workflow enabled?
2. Check workflow file syntax
3. Verify turbo commands are in approved list

### Script Errors

1. Check Python version (requires 3.8+)
2. Verify file paths are correct
3. Check permissions

### Learning Database Not Updating

1. Verify error_logger.py has write permissions
2. Check JSON syntax in learning_database.json
3. Ensure errors are being logged properly

## 📈 Success Metrics

Track these metrics untuk measure improvement:

- **Manual Interventions**: Target reduction ≥70%
- **Story Completion Time**: Target reduction ≥40%
- **Error Recovery Rate**: Target ≥80% automated
- **Test Coverage**: Maintain ≥80%
- **Code Quality**: Maintain ≥85/100

## 🔄 Iteration Process

1. **Measure Baseline**: Track current metrics
2. **Enable Automation**: Turn on workflows & turbo mode
3. **Monitor**: Track errors and fixes
4. **Learn**: Review patterns and update directives
5. **Improve**: Refine workflows based on learnings
6. **Repeat**: Continuous improvement cycle

## 🆘 Getting Help

If agent behavior is unexpected:

1. Check error logs: `python execution/error_logger.py --recent 10`
2. Review recent workflow execution
3. Check directive was followed
4. Verify configuration is correct
5. Report consistent issues untuk directive updates

---

**Version**: 1.0.0  
**Last Updated**: 2025-12-09  
**Maintained By**: Development Team
