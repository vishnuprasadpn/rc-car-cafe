# Fix: Redirect URI Not Registered Error

## Error Message
```
You can't sign in to this app because it doesn't comply with Google's OAuth 2.0 policy.
If you're the app developer, register the redirect URI in the Google Cloud Console.
Request details: redirect_uri=https://furyroadclub.com/api/auth/callback/google
```

## Solution: Add Redirect URI to Google Cloud Console

### Step 1: Go to Google Cloud Console

1. Visit: https://console.cloud.google.com/apis/credentials
2. Select your project (the one with your OAuth credentials)

### Step 2: Edit Your OAuth 2.0 Client ID

1. Find your OAuth 2.0 Client ID in the list
2. Click on it to edit

### Step 3: Add Authorized Redirect URIs

In the **"Authorized redirect URIs"** section, add:

```
https://furyroadclub.com/api/auth/callback/google
```

**Important:** 
- No trailing slash
- Must be exactly: `https://furyroadclub.com/api/auth/callback/google`
- Use `https://` (not `http://`)

### Step 4: Add Authorized JavaScript Origins

In the **"Authorized JavaScript origins"** section, add:

```
    https://furyroadclub.com
```

**Important:**
- No trailing slash
- No `/api/auth/callback/google` path
- Just the domain: `https://furyroadclub.com`

### Step 5: Save Changes

1. Click **"SAVE"** at the bottom
2. Wait a few seconds for changes to propagate

### Step 6: Verify Your Environment Variables

Make sure your production `.env` or deployment environment has:

```env
NEXTAUTH_URL="https://furyroadclub.com"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

**Important:** 
- No trailing slash in `NEXTAUTH_URL`
- Should be: `https://furyroadclub.com` (not `https://furyroadclub.com/`)

## Complete Configuration Checklist

### In Google Cloud Console:

**Authorized JavaScript origins:**
- [ ] `http://localhost:3000` (for development)
- [ ] `https://furyroadclub.com` (for production)

**Authorized redirect URIs:**
- [ ] `http://localhost:3000/api/auth/callback/google` (for development)
- [ ] `https://furyroadclub.com/api/auth/callback/google` (for production)

### In Your Environment Variables:

**Development (.env.local):**
```env
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="your-client-id"
GOOGLE_CLIENT_SECRET="your-client-secret"
```

**Production (Vercel/Deployment):**
```env
NEXTAUTH_URL="https://furyroadclub.com"
GOOGLE_CLIENT_ID="your-client-id"
GOOGLE_CLIENT_SECRET="your-client-secret"
```

## Common Mistakes to Avoid

❌ **Wrong:**
```
https://furyroadclub.com/  (trailing slash)
http://furyroadclub.com/api/auth/callback/google  (http instead of https)
https://www.furyroadclub.com/api/auth/callback/google  (www subdomain)
```

✅ **Correct:**
```
https://furyroadclub.com
https://furyroadclub.com/api/auth/callback/google
```

## Testing

After adding the redirect URI:

1. **Wait 1-2 minutes** for Google's changes to propagate
2. **Clear your browser cache** or use incognito mode
3. **Try signing in again** with Google

## If Still Not Working

1. **Double-check the exact URL:**
   - Go to your deployed site
   - Try to sign in with Google
   - Check the error message for the exact redirect URI
   - Make sure it matches exactly in Google Console

2. **Check for www vs non-www:**
   - If your site uses `www.furyroadclub.com`, add that too
   - Or set up a redirect from non-www to www (or vice versa)

3. **Verify environment variables:**
   - Make sure `NEXTAUTH_URL` in production matches your actual domain
   - No trailing slashes
   - Use `https://` not `http://`

4. **Check OAuth Consent Screen:**
   - Make sure your app is published (if in production)
   - Or add your email to test users (if in testing mode)

## Quick Reference

**Google Cloud Console Links:**
- Credentials: https://console.cloud.google.com/apis/credentials
- OAuth Consent Screen: https://console.cloud.google.com/apis/credentials/consent

**What to Add:**
- JavaScript Origin: `https://furyroadclub.com`
- Redirect URI: `https://furyroadclub.com/api/auth/callback/google`

