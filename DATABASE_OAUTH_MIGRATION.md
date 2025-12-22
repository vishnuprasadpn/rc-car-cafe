# Database Migration for Google OAuth Support

## Overview

This migration enhances the database schema to better support Google OAuth authentication while maintaining backward compatibility with email/password users.

## Schema Changes

### User Model Enhancements

1. **`image` (String?)**: Profile image URL from OAuth providers (e.g., Google profile picture)
2. **`emailVerified` (DateTime?)**: Email verification status from OAuth providers
3. **`authMethod` (String?)**: Tracks authentication method:
   - `"email"` - Email/password only
   - `"google"` - Google OAuth only
   - `"email+google"` - Both methods (user can use either)
4. **`lastLoginAt` (DateTime?)**: Tracks when user last logged in
5. **Email Index**: Added index on `email` field for faster lookups

### Existing Fields (No Changes)

- `password` (String?) - Already optional, perfect for OAuth users
- `email` (String @unique) - Already unique, works for OAuth
- All other fields remain unchanged

## Migration Steps

### 1. Generate Migration

```bash
npx prisma migrate dev --name add_oauth_support
```

Or if you prefer to push directly (for development):

```bash
npx prisma db push
```

### 2. Verify Migration

After migration, verify the changes:

```bash
npx prisma studio
```

Check that:
- New fields are present in the User model
- Existing users still have their data
- No data loss occurred

### 3. Update Existing Users (Optional)

If you want to set `authMethod` for existing users:

```sql
-- Set authMethod for users with passwords
UPDATE users SET "authMethod" = 'email' WHERE password IS NOT NULL;

-- Set authMethod for users without passwords (likely OAuth users)
UPDATE users SET "authMethod" = 'google' WHERE password IS NULL AND "authMethod" IS NULL;
```

## Code Changes

### Authentication Flow

1. **Google OAuth Sign-In**:
   - Creates user with `authMethod: "google"`
   - Sets `image` from Google profile
   - Sets `emailVerified` if provided by Google
   - Updates `lastLoginAt` on each login

2. **Email/Password Sign-In**:
   - Sets `authMethod: "email"` if not already set
   - Updates `lastLoginAt` on each login

3. **Account Linking**:
   - If user with email exists and has password, `authMethod` becomes `"email+google"`
   - User can then use either authentication method

## Benefits

1. **Better User Experience**:
   - Profile images from Google
   - Email verification status tracking
   - Last login tracking

2. **Flexible Authentication**:
   - Users can use email/password OR Google OAuth
   - Seamless account linking
   - Track which method users prefer

3. **Analytics**:
   - See how many users use OAuth vs email
   - Track user engagement (last login)
   - Better user insights

4. **Backward Compatible**:
   - Existing email/password users continue to work
   - No breaking changes
   - Gradual migration path

## Testing

After migration, test:

1. **New Google OAuth User**:
   - Sign in with Google
   - Verify user is created with `authMethod: "google"`
   - Check `image` and `emailVerified` are set

2. **Existing Email User**:
   - Sign in with email/password
   - Verify `authMethod` is set to `"email"`
   - Check `lastLoginAt` is updated

3. **Account Linking**:
   - Create user with email/password
   - Sign in with Google using same email
   - Verify `authMethod` becomes `"email+google"`

## Rollback (If Needed)

If you need to rollback:

```sql
-- Remove new fields (WARNING: This will delete data!)
ALTER TABLE users DROP COLUMN IF EXISTS image;
ALTER TABLE users DROP COLUMN IF EXISTS "emailVerified";
ALTER TABLE users DROP COLUMN IF EXISTS "authMethod";
ALTER TABLE users DROP COLUMN IF EXISTS "lastLoginAt";
DROP INDEX IF EXISTS users_email_idx;
```

Then revert the Prisma schema to previous version.

## Notes

- All new fields are optional (nullable), so existing data is safe
- Migration is non-destructive
- Can be applied to production without downtime
- Index on email improves query performance for OAuth lookups

