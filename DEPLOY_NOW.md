# Deploy OAuth Enhancements - Quick Guide

## ✅ Pre-Deployment Status

- ✅ All code changes committed and pushed to git
- ✅ Build successful (no errors)
- ✅ Database schema enhanced for OAuth
- ✅ Authentication flow updated

## 🚀 Deployment Steps

### Step 1: Database Migration (IMPORTANT!)

**If using Supabase/PostgreSQL directly:**

```bash
# Connect to production database and run:
npx prisma db push --accept-data-loss
```

**Or create a migration:**

```bash
npx prisma migrate deploy
```

**Note:** The new fields are all optional (nullable), so existing data is safe!

### Step 2: Verify Environment Variables

In your deployment platform (Vercel/Railway/etc.), ensure these are set:

```env
# Required for Google OAuth
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
NEXTAUTH_URL=https://furyroadclub.com
NEXTAUTH_SECRET=your-secret-key

# Database
DATABASE_URL=your-production-database-url

# Optional but recommended
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-3YGNXQ9MRP
```

**Critical:** `NEXTAUTH_URL` must NOT have a trailing slash!

### Step 3: Deploy

**If using Vercel (connected to Git):**
- ✅ Auto-deploys on push (already done!)
- Check Vercel dashboard for deployment status

**If manual deployment needed:**
- Go to Vercel Dashboard → Your Project → Deployments
- Click "Redeploy" on latest deployment

**If using Railway/Other:**
- Push triggers auto-deploy
- Or manually trigger deployment from dashboard

### Step 4: Verify Deployment

1. **Check Build Logs:**
   - Should see: `✅ Production OAuth configuration validated`
   - No build errors

2. **Check Server Logs (after deployment):**
   ```
   ✅ Production OAuth configuration validated
      NEXTAUTH_URL: https://furyroadclub.com
      Callback URL: https://furyroadclub.com/api/auth/callback/google
      GOOGLE_CLIENT_ID: 443993028218-ott...
   ```

3. **Test Google Sign-In:**
   - Go to: https://furyroadclub.com/auth/signin
   - Click "Continue with Google"
   - Should redirect to Google and back successfully

4. **Verify Database:**
   - New users should have `authMethod`, `image`, `lastLoginAt` fields
   - Existing users should still work

## 🔍 Troubleshooting

### If Google Sign-In Fails:

1. **Check Environment Variables:**
   - All required vars set?
   - `NEXTAUTH_URL` has no trailing slash?

2. **Check Google Cloud Console:**
   - Redirect URI: `https://furyroadclub.com/api/auth/callback/google`
   - JavaScript origin: `https://furyroadclub.com`

3. **Check Server Logs:**
   - Look for error messages
   - Should see validation messages on startup

### If Database Migration Fails:

1. **Check Connection:**
   - `DATABASE_URL` is correct?
   - Database is accessible?

2. **Check Permissions:**
   - User has ALTER TABLE permissions?

3. **Manual Migration (if needed):**
   ```sql
   ALTER TABLE users ADD COLUMN IF NOT EXISTS image TEXT;
   ALTER TABLE users ADD COLUMN IF NOT EXISTS "emailVerified" TIMESTAMP;
   ALTER TABLE users ADD COLUMN IF NOT EXISTS "authMethod" TEXT;
   ALTER TABLE users ADD COLUMN IF NOT EXISTS "lastLoginAt" TIMESTAMP;
   CREATE INDEX IF NOT EXISTS users_email_idx ON users(email);
   ```

## 📋 Post-Deployment Checklist

- [ ] Database schema updated (new fields exist)
- [ ] Environment variables verified
- [ ] Google Cloud Console redirect URI correct
- [ ] Build successful (no errors)
- [ ] Server logs show validation messages
- [ ] Google OAuth sign-in works
- [ ] Existing email/password users still work
- [ ] New Google users created successfully

## 🎉 Success Indicators

- ✅ Server logs show: "Production OAuth configuration validated"
- ✅ Google sign-in redirects and completes successfully
- ✅ New users created with `authMethod: "google"`
- ✅ Profile images stored in `image` field
- ✅ `lastLoginAt` updates on each login

---

**Ready to deploy!** 🚀

If you encounter any issues, check the server logs and see `PRODUCTION_OAUTH_FIX.md` for detailed troubleshooting.

