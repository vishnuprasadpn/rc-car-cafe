# Supabase Connection Pool Guide

## Understanding the Connection Pool Issue

The `MaxClientsInSessionMode` error occurs because Supabase uses **PgBouncer** connection pooling, which limits concurrent connections based on your plan.

### Why It Happens

1. **Free Tier Limitations**: 
   - Limited connection pool size (typically 15-20 connections)
   - Session mode pooling (more restrictive)
   - Shared resources with other free tier users

2. **Connection Exhaustion**:
   - Dev server holds connections
   - Prisma Studio holds connections
   - Multiple API requests = multiple connections
   - Seed scripts need connections
   - All connections get used up quickly

## Supabase Connection Modes

Supabase provides **two connection strings**:

### 1. **Transaction Mode (Pooled)** - Recommended for Production
```
postgresql://user:pass@host:5432/db?pgbouncer=true
```
- ✅ Better for high concurrency
- ✅ More connections available
- ✅ Optimized for serverless/API routes
- ❌ Some limitations (no prepared statements, limited transactions)

### 2. **Session Mode (Direct)** - For Migrations/Seeds
```
postgresql://user:pass@host:5432/db
```
- ✅ Full PostgreSQL features
- ✅ Better for migrations, seeds, Prisma Studio
- ❌ Limited connections (causes MaxClients error)

## Current Plan Comparison

### Free Tier
- **Connection Pool**: ~15-20 connections
- **Database Size**: 500 MB
- **Project Pausing**: After 1 week inactivity
- **Best For**: Development, testing, small projects

### Pro Plan ($25/month)
- **Connection Pool**: ~100+ connections
- **Database Size**: 8 GB
- **No Project Pausing**
- **Daily Backups**: 7 days retention
- **Best For**: Production apps, small businesses

### Team Plan ($599/month)
- **Connection Pool**: 200+ connections
- **Database Size**: 8 GB+ (scalable)
- **Enterprise Features**: SOC2, HIPAA, SSO
- **Best For**: Large teams, enterprise

## Solutions & Best Practices

### 1. **Use Transaction Mode for Production** ✅

Update your `DATABASE_URL` to use transaction pooling:

```env
# Production (use transaction pooling)
DATABASE_URL="postgresql://user:pass@host:5432/db?pgbouncer=true"

# For migrations/seeds (use direct connection)
DATABASE_URL_DIRECT="postgresql://user:pass@host:5432/db"
```

### 2. **Optimize Prisma Connection Pooling**

Create a connection pool configuration:

```typescript
// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  },
  // Optimize connection pool
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

### 3. **Separate Connection Strings**

Create two connection strings:

**`.env.local`** (for development):
```env
# Production connection (pooled)
DATABASE_URL="postgresql://user:pass@host:5432/db?pgbouncer=true"

# Direct connection (for migrations/seeds)
DATABASE_URL_DIRECT="postgresql://user:pass@host:5432/db"
```

**Update `prisma/schema.prisma`**:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  directUrl = env("DATABASE_URL_DIRECT") // For migrations
}
```

### 4. **Connection Management Best Practices**

#### For Seed Scripts:
```typescript
// Always disconnect after use
const prisma = new PrismaClient()
try {
  // ... seed operations
} finally {
  await prisma.$disconnect()
}
```

#### For API Routes:
- Use singleton Prisma client (already implemented)
- Don't create multiple Prisma instances
- Let Prisma manage connection pooling

#### For Development:
- Close Prisma Studio when not in use
- Stop dev server before running seeds
- Use SQL scripts for quick updates (bypasses Prisma)

### 5. **When to Upgrade**

**Upgrade to Pro Plan if:**
- ✅ Running in production
- ✅ Multiple concurrent users
- ✅ Frequent database operations
- ✅ Need reliable uptime (no pausing)
- ✅ Need daily backups
- ✅ Budget allows ($25/month)

**Stay on Free Tier if:**
- ✅ Development/testing only
- ✅ Low traffic (< 100 users/day)
- ✅ Can tolerate occasional connection issues
- ✅ Budget constraints

## Recommended Setup for Production

### 1. Environment Variables

```env
# Production (pooled)
DATABASE_URL="postgresql://user:pass@host:5432/db?pgbouncer=true"

# Direct (for migrations)
DATABASE_URL_DIRECT="postgresql://user:pass@host:5432/db"
```

### 2. Prisma Schema

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  directUrl = env("DATABASE_URL_DIRECT")
}
```

### 3. Migration Commands

```bash
# Use direct URL for migrations
DATABASE_URL=$DATABASE_URL_DIRECT npx prisma migrate dev
DATABASE_URL=$DATABASE_URL_DIRECT npx prisma db push
```

### 4. Seed Scripts

```typescript
// Use direct connection for seeds
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL_DIRECT || process.env.DATABASE_URL
    }
  }
})
```

## Monitoring & Alerts

### Check Connection Usage:
1. Go to Supabase Dashboard
2. Settings → Database → Connection Pooling
3. Monitor active connections

### Set Up Alerts:
- Monitor connection pool usage
- Alert when > 80% capacity
- Track connection errors

## Alternative Solutions

### 1. **Use Supabase's Transaction Pooler**
- Already enabled by default
- Better for serverless functions
- More connections available

### 2. **Connection Pooling Libraries**
- Use `pg-pool` for custom pooling
- Not recommended (Prisma handles this)

### 3. **Switch to Different Database**
- Railway PostgreSQL (unlimited connections on paid)
- Neon PostgreSQL (generous free tier)
- AWS RDS (more control, more setup)

## Summary

**For Your RC Car Café App:**

1. **Development**: Free tier is fine, but:
   - Use transaction pooling (`?pgbouncer=true`)
   - Close Prisma Studio when not needed
   - Use SQL scripts for quick updates

2. **Production**: Consider Pro Plan ($25/month):
   - More reliable connection pool
   - No project pausing
   - Daily backups
   - Better performance

3. **Best Practice**: 
   - Use transaction pooling for production
   - Use direct connection for migrations/seeds
   - Monitor connection usage
   - Implement proper connection cleanup

## Quick Fixes

### Immediate Solutions:
1. ✅ Use transaction pooling: Add `?pgbouncer=true` to DATABASE_URL
2. ✅ Close Prisma Studio when not in use
3. ✅ Stop dev server before running seeds
4. ✅ Use SQL scripts for admin password updates

### Long-term Solutions:
1. ✅ Upgrade to Pro Plan for production
2. ✅ Implement proper connection pooling
3. ✅ Monitor connection usage
4. ✅ Optimize database queries

