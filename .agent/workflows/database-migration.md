---
description: Automated database migration workflow with validation
---

# Database Migration Workflow

// turbo-all

## Phase 1: Migration Planning

1. Analyze story requirements untuk database needs
   - New tables?
   - New fields?
   - Indexes needed?
   - Relations to add?

2. Review current Prisma schema
```bash
cat apps/api/prisma/schema.prisma
```

3. Plan migration changes
   - List all schema modifications
   - Identify potential breaking changes
   - Plan data migration if needed

## Phase 2: Schema Update

4. Update Prisma schema file
   - Add new models
   - Add new fields dengan proper types
   - Add indexes untuk performance
   - Add relations

5. Validate schema syntax
```bash
npx prisma validate
```

6. Format schema
```bash
npx prisma format
```

## Phase 3: Migration Generation

7. Generate migration file
```bash
npx prisma migrate dev --create-only --name {descriptive_name}
```

8. Review generated SQL migration
   - Check in apps/api/prisma/migrations/
   - Verify SQL is correct
   - Add custom SQL jika needed

9. Run migration auto-validator
```bash
python execution/db_migration_auto.py --validate
```

## Phase 4: Migration Execution

10. Apply migration to development database
```bash
npx prisma migrate dev
```

11. Verify migration applied successfully
```bash
npx prisma migrate status
```

12. Generate Prisma Client
```bash
npx prisma generate
```

## Phase 5: Verification

13. Introspect database untuk verify schema
```bash
npx prisma db pull --print
```

14. Run database health check
```bash
python execution/project_health_check.py --db
```

15. Test database operations
    - Insert test data
    - Query test data
    - Verify constraints work
    - Test relations

## Phase 6: Rollback Plan

16. Document rollback procedure
```sql
-- Save rollback SQL
-- In case we need to revert
```

17. Test rollback (in dev only)
```bash
npx prisma migrate reset
npx prisma migrate dev
```

## Exit Criteria

- ✅ Schema validation passed
- ✅ Migration applied successfully
- ✅ Prisma Client generated
- ✅ Database operations tested
- ✅ Rollback plan documented

## Error Handling

**If migration fails**:
1. Read error message carefully
2. Check for:
   - Syntax errors in schema
   - Constraint violations
   - Type mismatches
   - Missing dependencies
3. Fix schema
4. Delete failed migration folder
5. Regenerate migration (goto step 7)

**If validation fails**:
1. Run error analysis
```bash
python execution/error_log_analyzer.py
```
2. Check learning database untuk similar errors
3. Apply suggested fix
4. Re-validate

## Best Practices

- ✅ Always use descriptive migration names
- ✅ Add comments in schema untuk complex fields
- ✅ Create indexes untuk foreign keys
- ✅ Use proper Prisma types
- ✅ Test migration before committing
- ✅ Never edit migration files directly
