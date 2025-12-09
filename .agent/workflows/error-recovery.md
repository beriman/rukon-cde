---
description: Automated error detection, analysis, and recovery
---

# Error Recovery Workflow

// turbo-all

## Phase 1: Error Detection

1. Detect error occurrence
   - From test failures
   - From build failures
   - From runtime logs
   - From user report

2. Capture error context
   - Error message
   - Stack trace
   - File and line number
   - Related code
   - Command that caused error

3. Log error to system
```bash
python execution/error_logger.py --error "{error_message}" --context "{context}"
```

## Phase 2: Error Classification

4. Analyze error type
```bash
python execution/error_log_analyzer.py --latest
```

5. Classify error category:
   - **Syntax Error**: Code syntax issues
   - **Type Error**: TypeScript type mismatches
   - **Runtime Error**: Logic errors, null references
   - **Database Error**: Prisma, SQL issues
   - **Network Error**: API calls, external services
   - **Build Error**: Compilation, bundling issues
   - **Test Error**: Test assertions failing
   - **Deployment Error**: Infra, config issues

## Phase 3: Knowledge Base Search

6. Query learning database untuk similar errors
```bash
python execution/fix_suggester.py --error-type "{error_type}" --error-code "{error_code}"
```

7. Check for known patterns:
   - Exact match in database?
   - Similar error seen before?
   - Known fix available?

8. Get fix suggestions dengan confidence scores

## Phase 4: Automated Fix Attempt

9. **IF confidence ≥ 85%**:
   - Apply automated fix
   ```bash
   python execution/fix_suggester.py --apply --fix-id "{fix_id}"
   ```
   - Log fix attempt
   - Goto Phase 5 (Verification)

10. **IF confidence 60-84%**:
    - Generate fix suggestion
    - Show suggestion to orchestration layer
    - Request approval before applying
    - If approved, apply fix
    - Goto Phase 5 (Verification)

11. **IF confidence < 60%**:
    - No automated fix available
    - Goto Phase 6 (Manual Investigation)

## Phase 5: Fix Verification

12. Re-run failed operation
    - If it was a test, re-run test
    - If it was a build, rebuild
    - If it was runtime, test affected feature

13. Check if error resolved
```bash
# Run appropriate verification command
npm test -- {affected_test}
# or
npm run build
# or
python execution/api_endpoint_tester.py --endpoint {affected_endpoint}
```

14. **IF error resolved**:
    - Mark fix as successful
    - Update learning database
    - Increment success count for this pattern
    - Goto Phase 7 (Learning)

15. **IF error persists**:
    - Mark fix as failed
    - Try next suggestion (if available)
    - Or goto Phase 6 (Manual Investigation)

## Phase 6: Manual Investigation

16. Error tidak bisa di-fix automatically

17. Generate detailed investigation report:
```markdown
## Error Investigation Report

**Error Type**: {type}
**Error Message**: {message}
**Stack Trace**: {trace}
**Affected Files**: {files}
**Related Code**: {code_snippet}

**Attempted Fixes**:
- Fix 1: {description} - Result: Failed
- Fix 2: {description} - Result: Failed

**Suggested Manual Steps**:
1. {step_1}
2. {step_2}
...

**Similar Issues**:
- {link_to_similar_issue_1}
- {link_to_similar_issue_2}
```

18. Notify user dengan investigation report

19. Request manual intervention

20. Wait for user to fix issue

21. After user fixes, ask them to document solution:
    - What was the root cause?
    - How was it fixed?
    - Can this be automated in future?

## Phase 7: Learning & Directive Update

22. Update learning database dengan new pattern
```bash
python execution/directive_updater.py --add-pattern \
  --error-type "{type}" \
  --error-code "{code}" \
  --description "{description}" \
  --fix "{fix_description}" \
  --confidence "{success_rate}"
```

23. Check if directive update needed
    - Is this a recurring pattern?
    - Does it reveal process gap?
    - Should we update SOP?

24. **IF directive update needed**:
```bash
python execution/directive_updater.py --update \
  --directive "{directive_file}" \
  --section "{section}" \
  --content "{new_content}"
```

25. Log learning metrics
```bash
python execution/metrics_tracker.py --log-recovery \
  --error-type "{type}" \
  --recovery-time "{duration_seconds}" \
  --success "{true/false}"
```

## Phase 8: Prevention

26. Analyze error untuk prevention opportunities:
    - Can we add validation to prevent this?
    - Should we add test coverage?
    - Do we need better error messages?
    - Should we add type checking?

27. Create preventive measures:
    - Add validation code
    - Add tests
    - Add type definitions
    - Update documentation

28. Document prevention in directive

## Exit Criteria

- ✅ Error resolved (tests passing, build successful, feature working)
- ✅ Error logged to database
- ✅ Learning database updated
- ✅ Metrics tracked
- ✅ Directive updated (if needed)
- ✅ Prevention measures implemented (if possible)

## Error Handling (Meta)

**If error recovery workflow itself fails**:
1. Log the meta-error
2. Don't attempt automated fix for meta-errors
3. Immediately escalate to user
4. Provide full context and logs
5. Request manual intervention

## Retry Policy

- **Automated fix attempts**: Max 3 retries
- **Re-verification**: Max 2 retries
- **Total recovery time limit**: 10 minutes
- **If limits exceeded**: Escalate to user

## Success Metrics

Track these metrics untuk each recovery:
- Time to detect error
- Time to classify error
- Time to fix error
- Automated fix success rate
- User intervention required (yes/no)
- Error recurrence (yes/no)
