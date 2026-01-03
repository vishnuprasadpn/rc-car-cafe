# Running Concurrent Index Creation

Since `CREATE INDEX CONCURRENTLY` cannot run inside a transaction block, you have two options:

## Option 1: Use Transaction-Safe Version (Recommended for Supabase)

Use `create_indexes.sql` which works in Supabase SQL Editor and other transaction-based environments.

**Note:** This version will lock tables during index creation, but it's simpler and works everywhere.

## Option 2: Run Concurrently (One Statement at a Time)

If you want to use `CONCURRENTLY` (non-blocking), you must run each statement **individually** outside of a transaction:

### In Supabase SQL Editor:
1. Run each `CREATE INDEX CONCURRENTLY` statement **one at a time**
2. Wait for each to complete before running the next
3. Do NOT select all statements at once

### Example - Run these one by one:

```sql
-- Run this first, wait for completion
CREATE INDEX CONCURRENTLY IF NOT EXISTS "users_role_idx" ON "users"("role");

-- Then run this, wait for completion
CREATE INDEX CONCURRENTLY IF NOT EXISTS "users_created_at_idx" ON "users"("created_at");

-- Continue with next statement...
```

### Via psql (Command Line):

You can run the concurrent version via psql if you connect directly:

```bash
# Connect to database
psql $DIRECT_DATABASE_URL

# Then run statements one at a time, or use a script that runs them sequentially
```

## Recommendation

For Supabase SQL Editor, use **Option 1** (`create_indexes.sql`) - it's simpler and the table locks are usually very brief for index creation.

