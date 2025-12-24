# Fix: "Access blocked: This app's request is invalid"

This error means Google is blocking your OAuth request. Here's how to fix it:

## 🔍 Root Causes

1. **OAuth Consent Screen not published** (most common)
2. **App in testing mode** without test users
3. **Missing required scopes**
4. **Redirect URI mismatch** (less likely since config test passed)

## ✅ Step-by-Step Fix

### Step 1: Go to Google Cloud Console

1. Open [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Go to **APIs & Services > OAuth consent screen**

### Step 2: Check OAuth Consent Screen Status

Look at the top of the page - you'll see one of these:

#### If it says "Testing" (Publishing status: Testing):
**This is the problem!** Your app is in testing mode.

**Fix Option A - Add Test Users:**
1. Scroll down to **"Test users"** section
2. Click **"+ ADD USERS"**
3. Add your email address: `your-email@gmail.com`
4. Add any other emails that need to test
5. Click **"ADD"**
6. Try signing in again with one of the test user emails

**Fix Option B - Publish the App:**
1. Click **"PUBLISH APP"** button at the top
2. Confirm the publishing
3. Wait a few minutes for changes to propagate
4. Try signing in again

#### If it says "In production" (Publishing status: In production):
The app is published, so check other issues below.

### Step 3: Verify Required Scopes

1. In OAuth consent screen, check **"Scopes"** section
2. Ensure these scopes are added:
   - ✅ `email`
   - ✅ `profile`
   - ✅ `openid`
3. If missing, click **"ADD OR REMOVE SCOPES"**
4. Add the missing scopes
5. Click **"UPDATE"** then **"SAVE AND CONTINUE"**

### Step 4: Verify App Information

1. Check **"App information"** section:
   - ✅ App name is set
   - ✅ User support email is set
   - ✅ Developer contact information is set
2. If any are missing, fill them in and save

### Step 5: Verify Redirect URIs (Double Check)

Even though config test passed, verify in Google Console:

1. Go to **APIs & Services > Credentials**
2. Click on your OAuth 2.0 Client ID
3. Check **"Authorized redirect URIs"**:
   - Must include: `https://furyroadclub.com/api/auth/callback/google`
   - No trailing slash
   - Exact match (case-sensitive)
4. Check **"Authorized JavaScript origins"**:
   - Must include: `https://furyroadclub.com`
   - No trailing slash

### Step 6: Wait for Propagation

After making changes:
- Wait 5-10 minutes for Google to propagate changes
- Clear browser cache and cookies
- Try again

## 🎯 Quick Fix Checklist

- [ ] OAuth consent screen is **PUBLISHED** (not just "Testing")
- [ ] OR if in testing mode, your email is added as a **test user**
- [ ] Required scopes are added: `email`, `profile`, `openid`
- [ ] App information is complete (name, support email, developer contact)
- [ ] Redirect URI matches exactly: `https://furyroadclub.com/api/auth/callback/google`
- [ ] JavaScript origin matches exactly: `https://furyroadclub.com`
- [ ] Waited 5-10 minutes after making changes
- [ ] Cleared browser cache/cookies

## 🔧 Most Common Fix

**90% of the time, this is because:**
- App is in "Testing" mode
- Your email is not added as a test user

**Quick Fix:**
1. Go to OAuth consent screen
2. Add your email as a test user
3. OR publish the app
4. Try again

## 📝 Still Not Working?

If you've done all the above and it still doesn't work:

1. **Check the exact error message** from Google
2. **Check server logs** for any additional errors
3. **Verify environment variables** are set in production
4. **Try in incognito mode** to rule out cache issues

## 🔗 Direct Links

- [Google Cloud Console - OAuth Consent Screen](https://console.cloud.google.com/apis/credentials/consent)
- [Google Cloud Console - Credentials](https://console.cloud.google.com/apis/credentials)

