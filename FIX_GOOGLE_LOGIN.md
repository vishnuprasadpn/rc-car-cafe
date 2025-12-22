# Fix: Google Login Not Working

## Quick Troubleshooting Steps

### 1. Check Environment Variables

Make sure these are set in `.env.local`:

```env
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
NEXTAUTH_URL="http://localhost:3000"  # For development
NEXTAUTH_SECRET="your-secret-key"
```

**Important:**
- No quotes needed in `.env.local` (or use quotes consistently)
- No spaces around `=`
- `GOOGLE_CLIENT_SECRET` is required (not just CLIENT_ID)

### 2. Verify Google Cloud Console Configuration

1. Go to: https://console.cloud.google.com/apis/credentials
2. Click on your OAuth 2.0 Client ID
3. Check **Authorized redirect URIs**:
   - Development: `http://localhost:3000/api/auth/callback/google`
   - Production: `https://furyroadclub.com/api/auth/callback/google`
4. Check **Authorized JavaScript origins**:
   - Development: `http://localhost:3000`
   - Production: `https://furyroadclub.com`

### 3. Check OAuth Consent Screen

1. Go to: https://console.cloud.google.com/apis/credentials/consent
2. Verify:
   - App is published (or your email is in test users)
   - Required scopes are added: `email`, `profile`, `openid`
   - App name and support email are set

### 4. Restart Development Server

After changing environment variables:
```bash
# Stop server (Ctrl+C)
npm run dev
```

### 5. Check Browser Console

Open DevTools (F12) → Console:
- Look for errors related to OAuth
- Check for network errors
- Look for redirect issues

### 6. Check Server Logs

Look at your terminal where `npm run dev` is running:
- Check for OAuth-related errors
- Look for database connection issues
- Check for Prisma errors

## Common Issues

### Issue 1: Missing GOOGLE_CLIENT_SECRET

**Error:** "OAuthSignin" or redirect fails

**Solution:**
- Add `GOOGLE_CLIENT_SECRET` to `.env.local`
- Get it from Google Cloud Console → Credentials → Your OAuth Client

### Issue 2: Wrong Redirect URI

**Error:** "redirect_uri_mismatch"

**Solution:**
- Add exact redirect URI to Google Console
- Must match: `{NEXTAUTH_URL}/api/auth/callback/google`
- No trailing slashes

### Issue 3: OAuth Consent Screen Not Configured

**Error:** "Access blocked: This app's request is invalid"

**Solution:**
- Complete OAuth consent screen setup
- Add your email to test users (if in testing mode)
- Or publish the app (for production)

### Issue 4: PrismaAdapter with JWT Strategy Conflict

**Error:** Database errors or user creation fails

**Solution:**
- The code uses PrismaAdapter but JWT strategy
- This should work, but if issues persist, check database connection
- Ensure `Account` and `User` tables exist in Prisma schema

### Issue 5: Environment Variables Not Loading

**Error:** No error, but Google sign-in doesn't work

**Solution:**
- Restart dev server after adding env variables
- Check variable names are exact (case-sensitive)
- Verify `.env.local` is in project root

## Testing Steps

1. **Clear browser cache and cookies**
2. **Try incognito/private mode** (to rule out extensions)
3. **Check the exact error message** in browser console
4. **Check server logs** for detailed error messages
5. **Test with a different Google account** (if available)

## Debug Mode

Add temporary logging to see what's happening:

In `src/lib/auth.ts`, the `signIn` callback already has logging. Check your server console for:
- `✅ OAuth: Created new user {email}`
- `✅ OAuth: Existing user {email} signed in`
- `❌ OAuth signIn callback error: {error}`

## Still Not Working?

1. **Verify Google OAuth is enabled:**
   - Check Google Cloud Console → APIs & Services → Enabled APIs
   - Make sure Google+ API or Google Identity Services is enabled

2. **Check NextAuth configuration:**
   - Verify `NEXTAUTH_URL` matches your actual URL
   - Check `NEXTAUTH_SECRET` is set

3. **Database issues:**
   - Ensure database is accessible
   - Check Prisma schema includes `Account` model (for OAuth)
   - Run `npx prisma db push` if needed

4. **Network issues:**
   - Check if Google services are accessible
   - Try from different network
   - Check firewall/proxy settings

