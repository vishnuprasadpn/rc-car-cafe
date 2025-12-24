# Google OAuth Debugging Checklist

Based on your configuration test, your environment variables are correct. Use this checklist to debug OAuth issues.

## ✅ Configuration Status (From Test Endpoint)

Your configuration shows:
- ✅ `GOOGLE_CLIENT_ID`: Set
- ✅ `GOOGLE_CLIENT_SECRET`: Set
- ✅ `NEXTAUTH_URL`: `https://furyroadclub.com` (correct format)
- ✅ `NEXTAUTH_SECRET`: Set
- ✅ Callback URL: `https://furyroadclub.com/api/auth/callback/google`
- ✅ No trailing slash issues
- ✅ No configuration errors

## 🔍 Google Cloud Console Verification

### Step 1: Check OAuth 2.0 Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services > Credentials**
3. Click on your OAuth 2.0 Client ID
4. Verify these settings:

#### Authorized JavaScript origins:
- ✅ Must include: `https://furyroadclub.com`
- ❌ Should NOT include: `https://furyroadclub.com/` (trailing slash)
- ❌ Should NOT include: `http://furyroadclub.com` (http instead of https)

#### Authorized redirect URIs:
- ✅ Must include: `https://furyroadclub.com/api/auth/callback/google`
- ❌ Should NOT include trailing slash
- ❌ Should NOT have any typos

### Step 2: Check OAuth Consent Screen

1. Go to **APIs & Services > OAuth consent screen**
2. Verify:
   - ✅ App is **PUBLISHED** (not just in "Testing" mode)
   - ✅ Scopes include: `email`, `profile`, `openid`
   - ✅ User support email is set
   - ✅ App name is set

**Important:** If app is in "Testing" mode:
- Only test users can sign in
- Add your email as a test user
- Or publish the app to allow all users

## 🧪 Testing the OAuth Flow

### Step 1: Check Browser Console

1. Open browser DevTools (F12)
2. Go to Console tab
3. Navigate to `/auth/signin`
4. Click "Continue with Google"
5. Look for:
   - `🔵 Initiating Google OAuth sign-in...`
   - Any error messages
   - Network request failures

### Step 2: Check Network Tab

1. Open DevTools > Network tab
2. Try Google sign-in
3. Look for these requests:
   - `/api/auth/signin/google` - Should redirect to Google
   - `accounts.google.com/...` - Google OAuth page
   - `/api/auth/callback/google?code=...` - Callback with code
   - Check status codes (should be 200/302, not 4xx/5xx)

### Step 3: Check Server Logs

When you try to sign in, watch for these log messages:

#### Success Flow:
```
🔐 signIn callback called: provider=google, user.email=...
🔍 OAuth: Processing sign-in for ...
✅ OAuth: Created new user ... OR ✅ OAuth: Existing user ...
✅ OAuth: Sign-in approved for ...
🔑 JWT callback: ...
✅ JWT: Set role=..., id=... for ...
```

#### Error Indicators:
```
❌ OAuth: No email provided by Google
❌ OAuth signIn callback error: ...
❌ NextAuth handler error: ...
❌ OAuth callback error: ...
```

## 🐛 Common Issues and Fixes

### Issue 1: "redirect_uri_mismatch"

**Error Message:** Google shows "redirect_uri_mismatch"

**Fix:**
1. Check Google Console > Credentials > Your OAuth Client
2. Verify redirect URI is exactly: `https://furyroadclub.com/api/auth/callback/google`
3. No trailing slash, no typos
4. Save and wait 5-10 minutes for changes to propagate

### Issue 2: "OAuthSignin" Error

**Error Message:** Redirects back with `?error=OAuthSignin`

**Possible Causes:**
- Invalid Client ID or Secret
- Client ID/Secret mismatch
- OAuth consent screen not published

**Fix:**
1. Verify `GOOGLE_CLIENT_ID` matches Google Console exactly
2. Verify `GOOGLE_CLIENT_SECRET` matches Google Console exactly
3. Check for extra spaces or quotes in environment variables
4. Regenerate credentials if needed

### Issue 3: "Access blocked: This app's request is invalid"

**Error Message:** Google blocks the request

**Fix:**
1. Go to OAuth consent screen
2. Complete all required fields
3. **Publish the app** (not just testing mode)
4. Add required scopes: `email`, `profile`, `openid`
5. If in testing mode, add your email as a test user

### Issue 4: User Not Created

**Symptom:** OAuth completes but user not in database

**Fix:**
1. Check server logs for database errors
2. Verify database connection
3. Check Prisma schema includes `User`, `Account`, `Session` models
4. Run `npx prisma db push` to ensure tables exist

### Issue 5: Infinite Redirect Loop

**Symptom:** Keeps redirecting between pages

**Fix:**
1. Clear browser cookies for your domain
2. Check `NEXTAUTH_URL` matches your actual domain
3. Verify redirect callback in `auth.ts` is correct
4. Check for conflicting redirect logic

## 📋 Debugging Steps

### Step 1: Verify Google Console Settings

```bash
# Your callback URL should be:
https://furyroadclub.com/api/auth/callback/google

# Your JavaScript origin should be:
https://furyroadclub.com
```

### Step 2: Test OAuth Configuration

Visit: `https://furyroadclub.com/api/test-oauth`

Should show all green checks ✅

### Step 3: Try Sign-In and Watch Logs

1. Open terminal (for server logs)
2. Open browser console (for client logs)
3. Try Google sign-in
4. Watch both for errors

### Step 4: Check Database

```bash
# Check if user was created
npx prisma studio
# Or query:
npx prisma db execute --stdin <<< "SELECT email, authMethod, createdAt FROM users ORDER BY createdAt DESC LIMIT 5;"
```

## 🔧 Quick Fixes

### Fix 1: Clear and Reconfigure

1. Delete OAuth credentials in Google Console
2. Create new OAuth 2.0 Client ID
3. Add exact redirect URI: `https://furyroadclub.com/api/auth/callback/google`
4. Add exact JavaScript origin: `https://furyroadclub.com`
5. Update environment variables
6. Redeploy application

### Fix 2: Verify Environment Variables in Production

If using Vercel:
1. Go to Vercel Dashboard > Your Project > Settings > Environment Variables
2. Verify all OAuth variables are set
3. Ensure they match your `.env.local` (without quotes)
4. Redeploy after changes

### Fix 3: Test in Development First

1. Set up local OAuth with `http://localhost:3000`
2. Test locally first
3. Once working, update to production URLs
4. Add production URLs to Google Console

## 📊 What to Check Next

Based on your configuration being correct, the issue is likely:

1. **Google Console Settings** - Redirect URIs don't match exactly
2. **OAuth Consent Screen** - Not published or missing scopes
3. **Database Issues** - User creation failing
4. **Network/CORS Issues** - Blocked requests

## 🆘 Still Having Issues?

1. **Share the specific error message** you see
2. **Share server logs** from when you try to sign in
3. **Share browser console errors**
4. **Verify Google Console settings** match exactly

The enhanced logging will show exactly where the OAuth flow is failing!

