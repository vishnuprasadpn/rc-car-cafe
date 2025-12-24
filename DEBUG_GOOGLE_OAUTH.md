# Google OAuth Debugging Guide

This guide helps you debug Google OAuth authentication issues step by step.

## 🔍 Quick Diagnostic Checklist

### 1. Environment Variables Check

Run this in your terminal to check if all required variables are set:

```bash
# Check environment variables
echo "GOOGLE_CLIENT_ID: ${GOOGLE_CLIENT_ID:0:20}..."
echo "GOOGLE_CLIENT_SECRET: ${GOOGLE_CLIENT_SECRET:0:10}..."
echo "NEXTAUTH_URL: $NEXTAUTH_URL"
echo "NEXTAUTH_SECRET: ${NEXTAUTH_SECRET:0:10}..."
```

**Required Variables:**
- ✅ `GOOGLE_CLIENT_ID` - Your Google OAuth Client ID
- ✅ `GOOGLE_CLIENT_SECRET` - Your Google OAuth Client Secret
- ✅ `NEXTAUTH_URL` - Your app URL (no trailing slash!)
- ✅ `NEXTAUTH_SECRET` - Random secret string

### 2. Google Cloud Console Configuration

#### Check OAuth Consent Screen:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services > OAuth consent screen**
3. Verify:
   - ✅ App is published (not just in testing mode)
   - ✅ Scopes include: `email`, `profile`, `openid`
   - ✅ Test users added (if in testing mode)

#### Check OAuth Credentials:
1. Go to **APIs & Services > Credentials**
2. Click on your OAuth 2.0 Client ID
3. Verify **Authorized JavaScript origins**:
   - Development: `http://localhost:3000`
   - Production: `https://yourdomain.com` (exact match, no trailing slash)
4. Verify **Authorized redirect URIs**:
   - Development: `http://localhost:3000/api/auth/callback/google`
   - Production: `https://yourdomain.com/api/auth/callback/google` (exact match)

### 3. Server Logs Analysis

When you try to sign in with Google, check your server logs for:

#### ✅ Success Indicators:
```
🔐 signIn callback called: provider=google, user.email=...
🔍 OAuth: Processing sign-in for ...
✅ OAuth: Created new user ... or ✅ OAuth: Existing user ...
✅ OAuth: Sign-in approved for ...
🔑 JWT callback: ...
✅ JWT: Set role=..., id=... for ...
```

#### ❌ Error Indicators:
```
❌ PRODUCTION ERROR: Missing required environment variables
❌ OAuth: No email provided by Google
❌ OAuth signIn callback error: ...
❌ NextAuth handler error: ...
❌ OAuth callback error: ...
```

### 4. Common Errors and Solutions

#### Error: "redirect_uri_mismatch"
**Symptoms:**
- Google shows error: "redirect_uri_mismatch"
- Server logs show: "OAuth callback error"

**Solution:**
1. Check `NEXTAUTH_URL` has NO trailing slash
2. Verify redirect URI in Google Console matches exactly:
   - Should be: `{NEXTAUTH_URL}/api/auth/callback/google`
   - Example: `https://furyroadclub.com/api/auth/callback/google`
3. Ensure JavaScript origin matches: `{NEXTAUTH_URL}` (no trailing slash)

#### Error: "OAuthSignin"
**Symptoms:**
- Redirects back with `?error=OAuthSignin`
- Server logs show OAuth callback error

**Solution:**
1. Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are correct
2. Check for extra spaces or quotes in environment variables
3. Regenerate credentials in Google Cloud Console if needed

#### Error: "Access blocked: This app's request is invalid"
**Symptoms:**
- Google shows access blocked message
- Cannot proceed with OAuth flow

**Solution:**
1. Complete OAuth consent screen setup
2. Publish the app (not just test mode)
3. Add required scopes: `email`, `profile`, `openid`
4. If in testing mode, add your email as a test user

#### Error: User not created / Database error
**Symptoms:**
- OAuth flow completes but user not in database
- Server logs show database errors

**Solution:**
1. Check database connection
2. Verify Prisma schema includes `User` model
3. Check server logs for specific database errors
4. Ensure `Account` and `Session` tables exist (PrismaAdapter)

### 5. Step-by-Step Debugging Process

#### Step 1: Check Environment Variables
```bash
# In your project root
cat .env.local | grep -E "GOOGLE|NEXTAUTH"
```

#### Step 2: Test OAuth Flow Locally
1. Start dev server: `npm run dev`
2. Open browser console (F12)
3. Navigate to `/auth/signin`
4. Click "Continue with Google"
5. Watch both:
   - Browser console for client-side errors
   - Terminal/server logs for server-side errors

#### Step 3: Check Network Requests
1. Open browser DevTools > Network tab
2. Try Google sign-in
3. Look for:
   - Request to `/api/auth/signin/google`
   - Redirect to `accounts.google.com`
   - Callback to `/api/auth/callback/google`
4. Check response status codes (should be 200/302)

#### Step 4: Verify Database
```bash
# Check if user was created
npx prisma studio
# Or query directly
npx prisma db execute --stdin <<< "SELECT * FROM users WHERE email = 'your-email@gmail.com';"
```

### 6. Enhanced Logging

The code already includes extensive logging. To see more:

1. **Development mode** - Logs are automatically enabled
2. **Production mode** - Check your deployment platform's logs:
   - Vercel: Dashboard > Your Project > Logs
   - Railway: Dashboard > Your Service > Logs
   - Other: Check your platform's logging section

### 7. Test OAuth Configuration

Create a test endpoint to verify configuration:

```typescript
// src/app/api/test-oauth/route.ts
import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    hasClientId: !!process.env.GOOGLE_CLIENT_ID,
    hasClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
    hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
    hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
    nextAuthUrl: process.env.NEXTAUTH_URL,
    clientIdPrefix: process.env.GOOGLE_CLIENT_ID?.substring(0, 20) + "...",
    callbackUrl: `${process.env.NEXTAUTH_URL}/api/auth/callback/google`
  })
}
```

### 8. Production-Specific Issues

#### Issue: Works locally but not in production
**Check:**
1. Environment variables set in production platform
2. `NEXTAUTH_URL` matches production domain exactly
3. Redirect URIs in Google Console include production URL
4. OAuth consent screen is published (not just testing)

#### Issue: "trustHost" errors
**Solution:**
- Already configured: `trustHost: true` in `authOptions`
- If still issues, check `NEXTAUTH_URL` format

### 9. Database Schema Check

Ensure your Prisma schema includes:

```prisma
model User {
  // ... other fields
  accounts     Account[] // OAuth account links
  sessions     Session[]
}

model Account {
  // OAuth account information
}

model Session {
  // User sessions
}
```

Run migrations if needed:
```bash
npx prisma db push
npx prisma generate
```

### 10. Browser-Side Debugging

1. **Clear browser cache and cookies**
2. **Try incognito/private mode**
3. **Check browser console** for JavaScript errors
4. **Check Network tab** for failed requests

## 🛠️ Quick Fixes

### Fix 1: Regenerate OAuth Credentials
1. Go to Google Cloud Console > Credentials
2. Delete old OAuth 2.0 Client ID
3. Create new one with correct redirect URIs
4. Update environment variables

### Fix 2: Reset NEXTAUTH_SECRET
```bash
# Generate new secret
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
# Update in .env.local and production
```

### Fix 3: Verify Redirect URI Format
- ✅ Correct: `https://furyroadclub.com/api/auth/callback/google`
- ❌ Wrong: `https://furyroadclub.com/api/auth/callback/google/` (trailing slash)
- ❌ Wrong: `https://www.furyroadclub.com/...` (www mismatch)

## 📊 Debugging Checklist

- [ ] All environment variables set correctly
- [ ] `NEXTAUTH_URL` has no trailing slash
- [ ] Google Cloud Console redirect URI matches exactly
- [ ] Google Cloud Console JavaScript origin matches
- [ ] OAuth consent screen is published
- [ ] Required scopes added (email, profile, openid)
- [ ] Database connection working
- [ ] Prisma schema includes Account and Session models
- [ ] Server logs show OAuth flow starting
- [ ] No errors in browser console
- [ ] Network requests completing successfully

## 🔗 Useful Links

- [Google Cloud Console](https://console.cloud.google.com/)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Google OAuth 2.0 Docs](https://developers.google.com/identity/protocols/oauth2)

## 📝 Still Having Issues?

1. **Check server logs** - Most errors are logged with detailed messages
2. **Check browser console** - Client-side errors appear here
3. **Verify Google Console** - Ensure all settings match exactly
4. **Test in development first** - Fix issues locally before production
5. **Check database** - Ensure user/account tables are created correctly

