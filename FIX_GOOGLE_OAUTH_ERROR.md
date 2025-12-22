# Fix: "Access blocked: This app's request is invalid"

This error occurs when Google OAuth is not properly configured. Follow these steps to fix it:

## Quick Fix (Most Common Issue)

### If your app is in "Testing" mode:

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Select your project

2. **Open OAuth Consent Screen**
   - Go to: **APIs & Services** > **OAuth consent screen**

3. **Add Test Users**
   - Scroll down to **"Test users"** section
   - Click **"+ ADD USERS"**
   - Add the email address you're trying to sign in with
   - Click **"ADD"**

4. **Try signing in again**
   - The user you added should now be able to sign in

## Complete Fix (For Production)

### Option 1: Publish Your App (Recommended for Production)

1. **Go to OAuth Consent Screen**
   - Visit: https://console.cloud.google.com/apis/credentials/consent
   - Select your project

2. **Check Publishing Status**
   - If it says "Testing", click **"PUBLISH APP"** button
   - This makes your app available to all users (not just test users)

3. **Complete Required Information**
   - Make sure all required fields are filled:
     - App name
     - User support email
     - Developer contact information
     - Privacy policy URL (required for production)
     - Terms of service URL (required for production)

4. **Submit for Verification** (if needed)
   - Google may require verification for sensitive scopes
   - This process can take a few days

### Option 2: Keep in Testing Mode (For Development)

If you want to keep it in testing mode:

1. **Add all test users**
   - Go to **OAuth consent screen** > **Test users**
   - Add all email addresses that need access

2. **Limit to 100 test users**
   - Testing mode allows up to 100 test users

## Verify Your Configuration

### 1. Check Redirect URIs

Make sure these are correctly set in Google Cloud Console:

**Authorized JavaScript origins:**
- `http://localhost:3000` (for development)

**Authorized redirect URIs:**
- `http://localhost:3000/api/auth/callback/google` (for development)

### 2. Check Environment Variables

Verify your `.env.local` has:
```env
GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-client-secret"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Check Required Scopes

In OAuth consent screen, make sure these scopes are added:
- `email`
- `profile`
- `openid`

## Step-by-Step Fix

### Step 1: Add Test User (Quick Fix)

1. Go to: https://console.cloud.google.com/apis/credentials/consent
2. Click on your project
3. Scroll to **"Test users"** section
4. Click **"+ ADD USERS"**
5. Enter your email address
6. Click **"ADD"**
7. Try signing in again

### Step 2: Verify Redirect URI

1. Go to: https://console.cloud.google.com/apis/credentials
2. Click on your OAuth 2.0 Client ID
3. Under **"Authorized redirect URIs"**, verify:
   - `http://localhost:3000/api/auth/callback/google` is listed
4. If not, add it and click **"SAVE"**

### Step 3: Check OAuth Consent Screen

1. Go to: https://console.cloud.google.com/apis/credentials/consent
2. Verify:
   - App name is set
   - User support email is set
   - Scopes include: `email`, `profile`, `openid`
   - Publishing status (Testing or Published)

## Common Issues and Solutions

### Issue: "Error 400: redirect_uri_mismatch"
**Solution:** 
- Check that redirect URI in Google Console exactly matches: `http://localhost:3000/api/auth/callback/google`
- No trailing slashes
- Check `NEXTAUTH_URL` in `.env.local` matches

### Issue: "Error 403: access_denied"
**Solution:**
- App is in testing mode and your email is not in test users list
- Add your email to test users (see Step 1 above)

### Issue: "Error: invalid_client"
**Solution:**
- Check `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in `.env.local`
- Make sure there are no extra spaces or quotes
- Regenerate credentials if needed

## For Production Deployment

When deploying to production:

1. **Update Redirect URIs**
   - Add production URL: `https://yourdomain.com/api/auth/callback/google`
   - Add production origin: `https://yourdomain.com`

2. **Publish App**
   - Go to OAuth consent screen
   - Click **"PUBLISH APP"**
   - Complete all required fields (Privacy Policy, Terms of Service)

3. **Update Environment Variables**
   ```env
   NEXTAUTH_URL="https://yourdomain.com"
   GOOGLE_CLIENT_ID="your-production-client-id"
   GOOGLE_CLIENT_SECRET="your-production-client-secret"
   ```

## Still Having Issues?

1. **Clear browser cache and cookies**
2. **Try incognito/private browsing mode**
3. **Check Google Cloud Console for error messages**
4. **Verify your Google account has access to the project**
5. **Make sure you're using the correct Google account**

## Quick Checklist

- [ ] Added your email to Test users (if in testing mode)
- [ ] Redirect URI matches exactly: `http://localhost:3000/api/auth/callback/google`
- [ ] `NEXTAUTH_URL` in `.env.local` is `http://localhost:3000`
- [ ] Required scopes (`email`, `profile`, `openid`) are added
- [ ] OAuth consent screen has all required fields filled
- [ ] Restarted dev server after changing `.env.local`

