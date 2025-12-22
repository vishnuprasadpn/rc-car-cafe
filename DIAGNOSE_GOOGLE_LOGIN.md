# Diagnose Google Login Not Working

## Quick Diagnostic Steps

### Step 1: Check Environment Variables

**Verify these are set correctly:**

```bash
# Check .env.local
cat .env.local | grep -E "GOOGLE|NEXTAUTH"
```

Should show:
- `GOOGLE_CLIENT_ID` - Your Google OAuth Client ID
- `GOOGLE_CLIENT_SECRET` - Your Google OAuth Client Secret
- `NEXTAUTH_URL` - Your app URL (no trailing slash!)
- `NEXTAUTH_SECRET` - A random secret string

### Step 2: Check Google Cloud Console

1. **Go to:** https://console.cloud.google.com/apis/credentials
2. **Click on your OAuth 2.0 Client ID**
3. **Verify Authorized redirect URIs:**
   - Development: `http://localhost:3000/api/auth/callback/google`
   - Production: `https://furyroadclub.com/api/auth/callback/google`
   - **NO trailing slashes!**

4. **Verify Authorized JavaScript origins:**
   - Development: `http://localhost:3000`
   - Production: `https://furyroadclub.com`
   - **NO trailing slashes!**

### Step 3: Check OAuth Consent Screen

1. **Go to:** https://console.cloud.google.com/apis/credentials/consent
2. **Verify:**
   - App name is set
   - User support email is set
   - **If in Testing mode:** Your email is in "Test users" list
   - **If in Production:** App is published
   - Required scopes: `email`, `profile`, `openid`

### Step 4: Check Server Logs

When you click "Continue with Google", watch your server terminal for:

**Success messages:**
- `✅ OAuth: Created new user {email}`
- `✅ OAuth: Existing user {email} signed in`

**Error messages:**
- `❌ OAuth signIn callback error: {error}`
- `❌ OAuth: No email provided by Google`
- Database connection errors
- Prisma errors

### Step 5: Check Browser Console

1. Open DevTools (F12)
2. Go to **Console** tab
3. Click "Continue with Google"
4. Look for:
   - JavaScript errors
   - Network errors
   - Redirect issues

### Step 6: Check Network Tab

1. Open DevTools (F12)
2. Go to **Network** tab
3. Click "Continue with Google"
4. Look for:
   - Failed requests to `/api/auth/callback/google`
   - Failed requests to `accounts.google.com`
   - Status codes: 400, 401, 403, 500

## Common Issues & Solutions

### Issue 1: Redirect URI Mismatch

**Error:** "redirect_uri_mismatch" or "OAuthCallback"

**Solution:**
1. Go to Google Cloud Console → Credentials
2. Edit your OAuth Client ID
3. Add exact redirect URI: `{NEXTAUTH_URL}/api/auth/callback/google`
4. No trailing slashes!
5. Save and wait 1-2 minutes

### Issue 2: OAuth Consent Screen Not Configured

**Error:** "Access blocked: This app's request is invalid"

**Solution:**
1. Go to OAuth Consent Screen
2. Complete all required fields
3. Add your email to Test users (if in testing mode)
4. Or publish the app (for production)

### Issue 3: Missing Environment Variables

**Error:** No specific error, just doesn't work

**Solution:**
- Verify all env variables are set
- Restart dev server after adding/changing
- For production, add in deployment platform

### Issue 4: Database Connection Issues

**Error:** Prisma errors in server logs

**Solution:**
- Check `DATABASE_URL` is correct
- Ensure database is accessible
- Run `npx prisma db push` to sync schema
- Check for connection pool exhaustion

### Issue 5: PrismaAdapter Conflict

**Error:** Account creation fails

**Solution:**
- Ensure `Account` table exists (from Prisma schema)
- Run `npx prisma generate` to update client
- Check Prisma schema includes Account model

## Test Checklist

- [ ] Environment variables are set
- [ ] Google Cloud Console redirect URI matches exactly
- [ ] OAuth consent screen is configured
- [ ] Your email is in test users (if in testing mode)
- [ ] Server logs show OAuth attempts
- [ ] No errors in browser console
- [ ] Database is accessible
- [ ] Prisma schema is synced

## Still Not Working?

1. **Check the exact error message** in:
   - Browser console
   - Server logs
   - Google Cloud Console (if available)

2. **Try these steps:**
   - Clear browser cache and cookies
   - Try incognito/private mode
   - Try a different browser
   - Test with a different Google account

3. **Verify the flow:**
   - Click "Continue with Google"
   - Does it redirect to Google? (If no, check GOOGLE_CLIENT_ID)
   - After Google sign-in, does it redirect back? (If no, check redirect URI)
   - After redirect, does it show error? (Check server logs)

## Debug Mode

The code has debug logging enabled in development. Check your server terminal for detailed OAuth flow information.

