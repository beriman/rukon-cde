# Directive: Database Operations

**ID**: DIR-005  
**Layer**: Directive (What to do)  
**Trigger**: User requests database changes, migrations, or schema updates

## 1. Objective
Manage database schema, migrations, dan data operations dengan aman dan efisien menggunakan Prisma ORM.

## 2. Input
- Story requirements dengan database needs
- Schema changes specification
- Migration naming convention
- Data transformation requirements (if any)

## 3. Tools & Scripts
- **Prisma CLI**: Schema management, migration generation
- **Migration Script**: `execution/db_migration_auto.py` untuk validation
- **Database Client**: Apps/api/prisma untuk database access
- **SQL Editor**: Untuk manual migration editing (jika diperlukan)

## 4. Workflow

### 4.1 Schema Planning
1. Review current schema (`apps/api/prisma/schema.prisma`)
2. Identify required changes:
   - New models (tables)
   - New fields dengan proper types
   - Indexes untuk performance
   - Relations between models
3. Check for breaking changes
4. Plan data migration jika schema change affects existing data

### 4.2 Schema Update
1. Edit `schema.prisma` file
2. Use proper Prisma types:
   - `String`, `Int`, `Boolean`, `DateTime`, `Json`
   - `@id @default(uuid())` untuk primary keys
   - `@unique` untuk unique constraints
   - `@db.VarChar(255)` untuk specific DB types
3. Add indexes dengan `@@index([field])` for:
   - Foreign keys
   - Frequently queried fields
   - Search fields
4. Add relations properly:
   ```prisma
   model User {
     organizationId String
     organization   Organization @relation(fields: [organizationId], references: [id])
   }
   ```

### 4.3 Validation
1. Run `npx prisma validate` untuk check syntax
2. Run `npx prisma format` untuk format schema
3. Run Python validator:
   ```bash
   python execution/db_migration_auto.py --validate
   ```

### 4.4 Migration Generation
1. Generate migration dengan descriptive name:
   ```bash
   npx prisma migrate dev --create-only --name add_user_is_active_field
   ```
2. Review generated SQL di `apps/api/prisma/migrations/{timestamp}_{name}/migration.sql`
3. Edit SQL jika perlu (untuk data migrations, custom logic)
4. **Never** edit migration files untuk schema changes - update schema.prisma instead

### 4.5 Migration Execution
1. Apply migration:
   ```bash
   npx prisma migrate dev
   ```
2. Verify migration status:
   ```bash
   npx prisma migrate status
   ```
3. Generate Prisma Client:
   ```bash
   npx prisma generate
   ```
4. Restart development server untuk load new client

### 4.6 Verification
1. Test database operations:
   - Insert test data
   - Query dengan new fields
   - Verify constraints (unique, foreign keys)
   - Test indexes (check query performance)
2. Run integration tests yang menggunakan database
3. Check for any runtime errors

## 5. Output
- Updated `schema.prisma` file
- Migration SQL file di `migrations/` directory
- Generated Prisma Client types
- Test results showing operations work correctly

## 6. Edge Cases

### 6.1 Unique Constraint Violations
**Scenario**: Adding unique constraint to existing field dengan duplicate data

**Solution**:
1. Create data migration first to clean duplicates
2. Then create schema migration untuk add constraint
3. Or use custom SQL in migration untuk handle conflicts

### 6.2 Data Loss Risk
**Scenario**: Dropping column, changing type, or renaming field

**Solution**:
1. **Never** drop columns with data directly
2. Create multi-step migration:
   - Step 1: Add new column
   - Step 2: Migrate data dari old to new column
   - Step 3: Drop old column (in separate migration)
3. Test thoroughly in development first

### 6.3 Circular Dependencies
**Scenario**: Two models referencing each other

**Solution**:
```prisma
model User {
  id             String   @id @default(uuid())
  preferredOrgId String?
  preferredOrg   Organization? @relation("PreferredOrg", fields: [preferredOrgId], references: [id])
}

model Organization {
  id        String   @id @default(uuid())
  users     User[]   @relation("PreferredOrg")
}
```
Use optional relations atau separate junction tables

### 6.4 Migration Failures
**Scenario**: Migration fails mid-execution

**Solution**:
1. Prisma automatically rolls back failed migrations
2. Read error message carefully
3. Fix schema issues
4. Delete failed migration folder
5. Regenerate migration
6. If persists, check database state manually

### 6.5 Production Migrations
**Scenario**: Applying migrations to production database

**Solution**:
1. **Always** test in staging first
2. Use `npx prisma migrate deploy` (not migrate dev) in production
3. Create database backup before migration
4. Have rollback SQL ready
5. Monitor application after migration
6. Consider downtime window untuk breaking changes

## 7. Best Practices

✅ **DO**:
- Use descriptive migration names (e.g., `add_user_last_login_field`)
- Add comments in schema untuk complex fields
- Create indexes untuk foreign keys automatically
- Test migrations in development thoroughly
- Version control all migrations
- Use transactions untuk data migrations
- Document breaking changes

❌ **DON'T**:
- Edit existing migration files (create new ones instead)
- Drop columns without data backup
- Skip testing migrations
- Use raw SQL unless necessary
- Create migrations manually (use Prisma CLI)
- Modify production database directly
- Ignore migration warnings

## 8. Multi-Tenancy Considerations

When working dengan multi-tenant database:

1. **Organization Isolation**:
   - Always add `organizationId` to tenant-specific models
   - Add `@@index([organizationId])` untuk performance
   - Set up proper relations to Organization model

2. **Validation**:
   ```typescript
   // Always filter by organizationId
   await prisma.user.findMany({
     where: {
       organizationId: currentUser.organizationId
     }
   })
   ```

3. **Test Isolation**:
   - Create test data untuk multiple organizations
   - Verify queries don't leak across tenants
   - Test permutations dengan different org contexts

## 9. Performance Optimization

1. **Indexes**:
   - Add untuk foreign keys
   - Add untuk frequently queried fields
   - Add composite indexes untuk multi-field queries
   ```prisma
   @@index([organizationId, createdAt])
   ```

2. **Field Types**:
   - Use `@db.VarChar(255)` instead of unlimited String untuk better performance
   - Use `Int` instead of `String` untuk enums when possible
   - Use `Json` sparingly (harder to query)

3. **Relations**:
   - Avoid N+1 queries dengan `include` or `select`
   - Use pagination untuk large result sets
   - Consider denormalization untuk read-heavy fields

## 10. Documentation

After completing database changes, update:

1. **Story file**: Mark database tasks as complete
2. **API documentation**: Update if new endpoints use new fields
3. **README**: Update ERD diagram jika schema significantly changed
4. **Migration notes**: Document any manual steps atau gotchas

## 11. Rollback Procedure

If migration causes issues in production:

1. Identify problem migration
2. Create rollback migration:
   ```bash
   npx prisma migrate dev --create-only --name rollback_last_migration
   ```
3. Write SQL to revert changes
4. Test rollback in staging
5. Apply to production:
   ```bash
   npx prisma migrate deploy
   ```
6. Verify application functions correctly
7. Document incident dan lessons learned
