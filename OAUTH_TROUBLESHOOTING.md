# Google OAuth Troubleshooting Guide

## Error: OAuthSignin

This error occurs when Google OAuth authentication fails. Here's how to fix it:

### 1. Verify Google Cloud Console Configuration

Go to [Google Cloud Console](https://console.cloud.google.com/) and check:

#### Authorized Redirect URIs
Make sure you have added:
```
https://furyroadclub.com/api/auth/callback/google
```

**Important:** The URL must match exactly, including:
- `https://` (not `http://`)
- No trailing slash
- Exact path: `/api/auth/callback/google`

#### Authorized JavaScript Origins
Add:
```
https://furyroadclub.com
```

### 2. Verify Environment Variables in Production

In your Vercel/hosting platform, ensure these are set correctly:

```env
NEXTAUTH_URL=https://furyroadclub.com
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
```

**Critical:** `NEXTAUTH_URL` must match your production domain exactly.

### 3. Check OAuth Consent Screen

1. Go to Google Cloud Console → APIs & Services → OAuth consent screen
2. Ensure the consent screen is **Published** (not in Testing mode)
3. If in Testing mode, add test users or publish the app

### 4. Verify Client ID and Secret

1. Go to Google Cloud Console → APIs & Services → Credentials
2. Click on your OAuth 2.0 Client ID
3. Copy the **Client ID** and **Client Secret**
4. Verify they match what's in your environment variables

### 5. Common Issues and Solutions

#### Issue: "redirect_uri_mismatch"
**Solution:** 
- The redirect URI in Google Console must exactly match: `https://furyroadclub.com/api/auth/callback/google`
- Check for typos, missing `https://`, or trailing slashes

#### Issue: "invalid_client"
**Solution:**
- Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are correct
- Ensure there are no extra spaces or quotes in environment variables

#### Issue: OAuth consent screen not published
**Solution:**
- Publish your OAuth consent screen in Google Cloud Console
- Or add the user's email to test users list

#### Issue: NEXTAUTH_URL mismatch
**Solution:**
- `NEXTAUTH_URL` must be exactly `https://furyroadclub.com`
- No trailing slash, no `www` unless your domain uses it
- Redeploy after updating

### 6. Testing Steps

1. **Clear browser cache and cookies**
2. **Try incognito/private mode**
3. **Check browser console for errors**
4. **Check Vercel logs** for server-side errors
5. **Verify environment variables** are set correctly

### 7. Quick Fix Checklist

- [ ] Redirect URI added to Google Console: `https://furyroadclub.com/api/auth/callback/google`
- [ ] JavaScript origin added: `https://furyroadclub.com`
- [ ] `NEXTAUTH_URL` set to `https://furyroadclub.com` in production
- [ ] `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are correct
- [ ] OAuth consent screen is published
- [ ] Environment variables are set for **Production** environment
- [ ] Application has been redeployed after environment variable changes

### 8. Still Not Working?

1. **Check Vercel logs:**
   - Go to your Vercel project → Deployments → Click on latest deployment → View Function Logs
   - Look for OAuth-related errors

2. **Test locally:**
   - Set `NEXTAUTH_URL=http://localhost:3000`
   - Add `http://localhost:3000/api/auth/callback/google` to Google Console
   - Test if OAuth works locally

3. **Verify database connection:**
   - OAuth requires database access to create/update users
   - Ensure `DATABASE_URL` is correct in production

4. **Check Prisma schema:**
   - Ensure `Account`, `Session`, and `User` models exist
   - Run `npx prisma db push` if needed

## Need More Help?

- Check NextAuth.js documentation: https://next-auth.js.org/providers/google
- Google OAuth documentation: https://developers.google.com/identity/protocols/oauth2

