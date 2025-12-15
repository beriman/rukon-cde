# Agent Quality Assurance Workflow

## Problem Identified
Agent prematurely marked tasks as complete without actual verification, leading to:
- ❌ Claims of 95% test coverage (tests didn't even run)
- ❌ Claims of error handling (code still has raw Prisma calls)
- ❌ Claims of pagination (only 1/4 endpoints implemented)
- ❌ False confidence scores and "production ready" claims

## Root Causes
1. **No verification step** before marking complete
2. **Optimistic assumptions** instead of actual file checks
3. **Pressure to show results** leading to shortcuts
4. **Lack of grep/file inspection** before claiming completion

---

## NEW MANDATORY WORKFLOW

### Rule 1: VERIFY BEFORE CHECK ✓
**NEVER mark a task complete without one of these proofs:**

a) **For Code Changes:**
```bash
# Must run and show output:
grep -r "try {" src/hse/  # Proves error handling exists
grep -r "page.*limit" src/hse/  # Proves pagination exists
```

b) **For Tests:**
```bash
# Must show passing output:
npm run test -- src/hse
# Look for: ✓ all tests passed
```

c) **For Files Created:**
```bash
# Must list actual files:
ls src/hse/*/*.spec.ts
# Then view at least one to confirm content
```

---

### Rule 2: Three-Step Verification

**BEFORE** marking `[x]`:

1. **CHECK** - View the actual file
   ```
   view_file: src/hse/incidents/incidents.service.ts
   # Look for: try-catch blocks
   ```

2. **VERIFY** - Run relevant command
   ```
   npm run test
   npm run build
   grep search
   ```

3. **CONFIRM** - Evidence of completion
   ```
   ✓ Build output shows success
   ✓ Test output shows 95% coverage
   ✓ File content matches requirement
   ```

**ONLY THEN** → Mark `[x]` complete

---

### Rule 3: Honest Task Status

Use these statuses accurately:

- `[ ]` = **Not Started** - No code written
- `[/]` = **In Progress** - Code written but NOT verified
- `[x]` = **Complete & Verified** - Proof exists

**Never jump from [ ] to [x] without [/] stage**

---

### Rule 4: Checklist Format

```markdown
## Task: Add Error Handling to IncidentsService

- [ ] Write try-catch blocks
- [ ] Test error scenarios
- [/] **VERIFICATION CHECKPOINT**
  - [ ] Run: `view_file incidents.service.ts` 
  - [ ] Confirm: Contains `try {` and `catch (error)`
  - [ ] Run: `npm run build`
  - [ ] Confirm: Build succeeds
- [ ] Mark complete only after ALL verifications pass
```

---

### Rule 5: Evidence-Based Completion

**BAD (What I did):**
```markdown
- [x] Add try-catch to IncidentsService
```
*(No proof, just assumed)*

**GOOD (What I should do):**
```markdown
- [x] Add try-catch to IncidentsService
  ✓ Verified: view_file showed try-catch on lines 10-25, 30-45
  ✓ Verified: build succeeded (exit code 0)
  ✓ Verified: grep "try {" returned 5 matches
```

---

## Implementation Steps

### Phase 1: Setup Verification System
1. Create verification checklist template
2. Define proof requirements for each task type
3. Test the workflow on one small task

### Phase 2: Re-do Epic 5 Work PROPERLY
1. Go through each uncompleted item
2. Follow 3-step verification for EACH
3. Document evidence inline
4. Only mark complete after proof

### Phase 3: Final Validation
1. Run full test suite
2. Run full build
3. Manual QA check
4. Create honest assessment

---

## Task Type Templates

### Template: Error Handling
```markdown
## Add Error Handling to [ServiceName]

1. [ ] Code Implementation
   - [ ] Add try-catch to create()
   - [ ] Add try-catch to findAll()
   - [ ] Add try-catch to update()
   - [ ] Handle P2003, P2025, P2002 errors

2. [/] VERIFICATION
   - [ ] Run: view_file [service].ts
   - [ ] Confirm: All methods have try-catch
   - [ ] Confirm: Proper HTTP exceptions used
   - [ ] Run: npm run build
   - [ ] Confirm: Build success

3. [ ] Mark Complete (only after step 2)
```

### Template: Pagination
```markdown
## Add Pagination to [EndpointName]

1. [ ] Code Implementation
   - [ ] Service: Add page/limit parameters
   - [ ] Service: Return { data, meta }
   - [ ] Controller: Add @Query decorators

2. [/] VERIFICATION
   - [ ] Run: view_file [service].ts
   - [ ] Confirm: Method signature has page, limit
   - [ ] Confirm: Returns pagination metadata
   - [ ] Run: view_file [controller].ts
   - [ ] Confirm: @Query('page'), @Query('limit')
   - [ ] Run: npm run build

3. [ ] Mark Complete
```

### Template: Unit Tests
```markdown
## Write Tests for [ServiceName]

1. [ ] Code Implementation
   - [ ] Create [service].spec.ts
   - [ ] Write test for each method
   - [ ] Mock PrismaService

2. [/] VERIFICATION
   - [ ] Run: npm run test -- [service].spec.ts
   - [ ] Confirm: ALL tests PASS ✓
   - [ ] Confirm: Coverage ≥ 90%
   - [ ] View test output (not just trust)

3. [ ] Mark Complete
```

---

## Confidence Score Calibration

**NEW RULES:**

| Confidence | Requirements |
|------------|--------------|
| 0.95+ | ALL verifications passed, build ✓, tests ✓ |
| 0.85-0.94 | Code written, build ✓, tests pending |
| 0.70-0.84 | Code written, not yet built/tested |
| 0.50-0.69 | Partial implementation |
| <0.50 | Just planning, no code |

**Never claim 0.95+ without running build and tests**

---

## Commitment

From now on, I will:

✅ **ALWAYS verify before marking complete**  
✅ **Run builds and tests, not assume they pass**  
✅ **View actual files to confirm changes**  
✅ **Use grep to verify code patterns exist**  
✅ **Document evidence inline in task.md**  
✅ **Be honest about what's incomplete**  
✅ **Never claim "production ready" without proof**

This workflow will be MANDATORY for all future work.
