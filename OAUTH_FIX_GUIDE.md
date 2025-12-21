# Google OAuth Sign-In Fix Guide

## Current Issue
Google sign-in is failing with error: "Google sign-in failed. Please check your Google OAuth configuration or try again."

## Most Common Causes

### 1. Missing or Incorrect Environment Variables
**Check in Vercel/hosting platform:**
- `GOOGLE_CLIENT_ID` - Must be set correctly
- `GOOGLE_CLIENT_SECRET` - Must be set correctly  
- `NEXTAUTH_URL` - Must be exactly `https://furyroadclub.com` (no trailing slash)

### 2. Google Cloud Console Redirect URI Mismatch
**Go to [Google Cloud Console](https://console.cloud.google.com/):**
1. APIs & Services → Credentials
2. Click your OAuth 2.0 Client ID
3. **Authorized redirect URIs** must include:
   ```
   https://furyroadclub.com/api/auth/callback/google
   ```
4. **Authorized JavaScript origins** must include:
   ```
   https://furyroadclub.com
   ```
5. Click **Save**

### 3. Database Connection Issues
The OAuth signIn callback tries to create/find users in the database. If the database connection fails, OAuth will fail.

**Check:**
- `DATABASE_URL` is correct in production
- Database is accessible from Vercel
- Connection pooling is configured (if using Supabase)

### 4. OAuth Consent Screen Not Published
**Go to Google Cloud Console:**
1. APIs & Services → OAuth consent screen
2. Ensure it's **Published** (not in Testing mode)
3. If in Testing mode, add test users or publish the app

## Debugging Steps

### Step 1: Check Server Logs
In Vercel:
1. Go to your project → Deployments
2. Click on latest deployment → View Function Logs
3. Look for errors starting with "❌ OAuth" or database errors

### Step 2: Verify Environment Variables
Run this in your production environment or check Vercel dashboard:
```bash
# These should all be set:
echo $GOOGLE_CLIENT_ID
echo $GOOGLE_CLIENT_SECRET  
echo $NEXTAUTH_URL
echo $DATABASE_URL
```

### Step 3: Test Database Connection
The signIn callback needs database access. Verify:
- Database is reachable from Vercel
- Connection string is correct
- No connection pool exhaustion

### Step 4: Check Google OAuth Configuration
1. Verify Client ID format: `xxxxx.apps.googleusercontent.com`
2. Verify Client Secret is correct (no extra spaces)
3. Check redirect URI matches exactly (case-sensitive, no trailing slash)

## Quick Fix Checklist

- [ ] `GOOGLE_CLIENT_ID` is set in production environment
- [ ] `GOOGLE_CLIENT_SECRET` is set in production environment
- [ ] `NEXTAUTH_URL=https://furyroadclub.com` (exact match, no trailing slash)
- [ ] Redirect URI added: `https://furyroadclub.com/api/auth/callback/google`
- [ ] JavaScript origin added: `https://furyroadclub.com`
- [ ] OAuth consent screen is **Published**
- [ ] `DATABASE_URL` is correct and database is accessible
- [ ] Application has been **redeployed** after environment variable changes

## Testing After Fix

1. Clear browser cache and cookies
2. Try incognito/private mode
3. Test Google sign-in
4. Check browser console for errors
5. Check Vercel logs for server-side errors

## Still Not Working?

The improved error handling will now log specific errors. Check Vercel logs for:
- `❌ OAuth: No email provided by Google` - Google didn't return email
- `❌ OAuth signIn callback error:` - Database or other error in callback
- Database connection errors

These logs will help identify the exact issue.

