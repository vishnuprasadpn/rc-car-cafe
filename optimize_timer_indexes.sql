-- Additional Timer Indexes for Better Performance
-- Since timers are heavily used, these composite indexes will optimize common query patterns

-- Composite index for the common orderBy pattern: isCombo DESC, createdAt ASC
-- This is used in the main timer fetch query
CREATE INDEX IF NOT EXISTS "timers_isCombo_createdAt_idx" ON "timers"("isCombo" DESC, "createdAt" ASC);

-- Composite index for status + trackId filtering (common pattern)
CREATE INDEX IF NOT EXISTS "timers_status_trackId_idx" ON "timers"("status", "trackId");

-- Index for startTime (used in timer calculations)
CREATE INDEX IF NOT EXISTS "timers_startTime_idx" ON "timers"("startTime") WHERE "startTime" IS NOT NULL;

-- Partial index for RUNNING timers (most frequently queried status)
-- This is a partial index that only indexes RUNNING timers, making it smaller and faster
CREATE INDEX IF NOT EXISTS "timers_running_idx" ON "timers"("startTime", "trackId", "isCombo") 
WHERE "status" = 'RUNNING';

-- Verify the new indexes
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
    AND tablename = 'timers'
ORDER BY indexname;

