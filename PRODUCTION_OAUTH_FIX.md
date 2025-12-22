# Fix: Google OAuth Sign-In Failed in Production

## Error Message
"Google sign-in failed. Please check your Google OAuth configuration or try again."

## Quick Checklist

### ✅ Step 1: Verify Environment Variables in Production

**For Vercel:**
1. Go to your Vercel project dashboard
2. Click **Settings** → **Environment Variables**
3. Verify these variables are set:
   - `GOOGLE_CLIENT_ID` ✅
   - `GOOGLE_CLIENT_SECRET` ✅
   - `NEXTAUTH_URL` ✅ (must be `https://furyroadclub.com` - **NO trailing slash**)
   - `NEXTAUTH_SECRET` ✅

**For Railway/Other Platforms:**
- Check your platform's environment variables section
- Ensure all variables are set correctly

### ✅ Step 2: Verify NEXTAUTH_URL Format

**CRITICAL:** `NEXTAUTH_URL` must NOT have a trailing slash!

```env
# ❌ WRONG
NEXTAUTH_URL="https://furyroadclub.com/"

# ✅ CORRECT
NEXTAUTH_URL="https://furyroadclub.com"
```

### ✅ Step 3: Verify Google Cloud Console Redirect URI

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Select your project
3. Click on your **OAuth 2.0 Client ID**
4. Under **"Authorized redirect URIs"**, ensure this is listed **EXACTLY**:
   ```
   https://furyroadclub.com/api/auth/callback/google
   ```
   - **No trailing slash**
   - **Must match exactly** (case-sensitive)
5. Under **"Authorized JavaScript origins"**, ensure:
   ```
   https://furyroadclub.com
   ```
6. Click **"SAVE"**
7. Wait 1-2 minutes for changes to propagate

### ✅ Step 4: Verify OAuth Consent Screen

1. Go to [OAuth Consent Screen](https://console.cloud.google.com/apis/credentials/consent)
2. Check the status:
   - **If "Testing"**: Add your email to "Test users"
   - **If "In production"**: Should work for all users
3. Ensure scopes include: `email`, `profile`, `openid`

### ✅ Step 5: Redeploy After Changes

After updating environment variables or Google Console settings:

1. **Redeploy your application** (Vercel will auto-deploy if connected to Git)
2. Or manually trigger a redeploy:
   - Vercel: Go to Deployments → Click "Redeploy"
   - Railway: Go to Deployments → Click "Redeploy"

### ✅ Step 6: Check Server Logs

After redeploying, check your production server logs for:

```
✅ Production OAuth configuration:
   NEXTAUTH_URL: https://furyroadclub.com
   Callback URL: https://furyroadclub.com/api/auth/callback/google
   GOOGLE_CLIENT_ID: 443993028218-ott...
```

If you see error messages, they will indicate what's missing.

## Common Issues

### Issue 1: Environment Variables Not Set
**Symptom:** Error on page load, no OAuth button works
**Fix:** Add all required environment variables in your deployment platform

### Issue 2: NEXTAUTH_URL Has Trailing Slash
**Symptom:** OAuth redirect fails with callback error
**Fix:** Remove trailing slash from `NEXTAUTH_URL`

### Issue 3: Redirect URI Mismatch
**Symptom:** "redirect_uri_mismatch" error from Google
**Fix:** Ensure redirect URI in Google Console matches exactly: `https://furyroadclub.com/api/auth/callback/google`

### Issue 4: OAuth Consent Screen Not Configured
**Symptom:** "Access blocked" error from Google
**Fix:** Configure OAuth consent screen and add test users (if in testing mode)

### Issue 5: Client Secret Missing
**Symptom:** OAuth fails silently
**Fix:** Ensure `GOOGLE_CLIENT_SECRET` is set (not just `GOOGLE_CLIENT_ID`)

## Verification Steps

1. **Test the callback URL directly:**
   ```
   https://furyroadclub.com/api/auth/callback/google
   ```
   Should redirect to sign-in page (not show 404)

2. **Check browser console:**
   - Open Developer Tools (F12)
   - Go to Console tab
   - Look for any OAuth-related errors

3. **Check network tab:**
   - Open Developer Tools → Network tab
   - Try Google sign-in
   - Look for failed requests to `accounts.google.com` or `/api/auth/callback/google`

## Still Not Working?

1. **Double-check all environment variables** are set correctly
2. **Verify Google Cloud Console** settings match exactly
3. **Check server logs** for detailed error messages
4. **Try in incognito/private browser** to rule out cache issues
5. **Wait 2-3 minutes** after making changes (Google/Cloud changes can take time to propagate)

## Production Environment Variables Template

```env
# Required for Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
NEXTAUTH_URL="https://furyroadclub.com"
NEXTAUTH_SECRET="your-secret-key-here"

# Database
DATABASE_URL="your-database-url"

# Email (if needed)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID="G-XXXXXXXXXX"
```

**Important:** Replace placeholder values with your actual credentials from Google Cloud Console!

