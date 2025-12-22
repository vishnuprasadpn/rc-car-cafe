# Fix: OAuth Callback Error

## Error Message
"OAuth callback error. Please try signing in again."

## Common Causes & Solutions

### 1. NEXTAUTH_URL Has Trailing Slash ⚠️ MOST COMMON

**Problem:**
```env
NEXTAUTH_URL="https://furyroadclub.com/"  # ❌ Has trailing slash
```

**Solution:**
```env
NEXTAUTH_URL="https://furyroadclub.com"  # ✅ No trailing slash
```

**Why:** The trailing slash can cause the redirect URI to become `https://furyroadclub.com//api/auth/callback/google` (double slash), which doesn't match what's configured in Google Cloud Console.

### 2. Redirect URI Mismatch in Google Cloud Console

**Check:**
1. Go to: https://console.cloud.google.com/apis/credentials
2. Click on your OAuth 2.0 Client ID
3. Under "Authorized redirect URIs", verify:
   ```
   https://furyroadclub.com/api/auth/callback/google
   ```
   - **No trailing slash**
   - Must match exactly
   - Use `https://` (not `http://`)

### 3. Database Connection Issues

**Symptoms:**
- Error in server logs about Prisma/database
- "MaxClientsInSessionMode" errors

**Solution:**
- Check database connection
- Ensure `DATABASE_URL` is correct
- Check if database is accessible from production
- For Supabase, use connection pooling URL

### 4. OAuth Consent Screen Not Configured

**Check:**
1. Go to: https://console.cloud.google.com/apis/credentials/consent
2. Verify:
   - App is published (or your email is in test users)
   - Required scopes are added: `email`, `profile`, `openid`
   - App name and support email are set

### 5. Missing Environment Variables

**Verify in Production:**
- `GOOGLE_CLIENT_ID` is set
- `GOOGLE_CLIENT_SECRET` is set
- `NEXTAUTH_URL` is set (without trailing slash)
- `NEXTAUTH_SECRET` is set

### 6. PrismaAdapter Account Creation Issue

**If using PrismaAdapter:**
- Ensure `Account` table exists in database
- Run: `npx prisma db push` to sync schema
- Check server logs for Prisma errors

## Step-by-Step Fix

### Step 1: Fix NEXTAUTH_URL

**Local (.env.local):**
```env
NEXTAUTH_URL="http://localhost:3000"  # No trailing slash
```

**Production (Vercel/etc):**
```env
NEXTAUTH_URL="https://furyroadclub.com"  # No trailing slash
```

### Step 2: Verify Google Cloud Console

1. Go to: https://console.cloud.google.com/apis/credentials
2. Click on your OAuth Client ID
3. **Authorized redirect URIs:**
   - `http://localhost:3000/api/auth/callback/google` (dev)
   - `https://furyroadclub.com/api/auth/callback/google` (prod)
4. **Authorized JavaScript origins:**
   - `http://localhost:3000` (dev)
   - `https://furyroadclub.com` (prod)
5. Click **SAVE**

### Step 3: Check Server Logs

When you try to sign in, check your server terminal/logs for:
- `✅ OAuth: Created new user {email}`
- `✅ OAuth: Existing user {email} signed in`
- `❌ OAuth signIn callback error: {error}`

The error message will tell you what's wrong.

### Step 4: Test Database Connection

```bash
# Test Prisma connection
npx prisma db push

# Or check connection
npx prisma studio
```

### Step 5: Clear Browser Data

1. Clear cookies for your domain
2. Clear cache
3. Try incognito/private mode
4. Try a different browser

## Debug Mode

The code now has enhanced error logging. Check your server logs when clicking Google sign-in to see detailed error messages.

## Still Not Working?

1. **Check browser console** (F12) for errors
2. **Check network tab** for failed requests
3. **Check server logs** for detailed error messages
4. **Verify all environment variables** are set correctly
5. **Test with a different Google account** (if available)

## Quick Checklist

- [ ] `NEXTAUTH_URL` has no trailing slash
- [ ] Redirect URI in Google Console matches exactly
- [ ] OAuth consent screen is configured
- [ ] Environment variables are set in production
- [ ] Database is accessible
- [ ] Server logs show detailed errors
- [ ] Browser cache is cleared

