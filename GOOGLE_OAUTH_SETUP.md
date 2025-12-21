# Google OAuth Setup Guide

## Production URL Configuration

The production URL depends on where you deploy your application:

### Option 1: Vercel (Recommended)
- **Production URL**: `https://your-app-name.vercel.app`
- **Or with custom domain**: `https://yourdomain.com`

### Option 2: Railway
- **Production URL**: `https://your-app-name.up.railway.app`
- **Or with custom domain**: `https://yourdomain.com`

### Option 3: Custom Domain
- **Production URL**: `https://yourdomain.com` or `https://www.yourdomain.com`

## Google OAuth Redirect URIs

You need to add these **Authorized redirect URIs** in Google Cloud Console:

### For Local Development:
```
http://localhost:3000/api/auth/callback/google
```

### For Production:
```
https://your-production-url.com/api/auth/callback/google
```

**Examples:**
- Vercel: `https://rc-car-cafe.vercel.app/api/auth/callback/google`
- Railway: `https://rc-car-cafe.up.railway.app/api/auth/callback/google`
- Custom Domain: `https://furyroadrc.com/api/auth/callback/google`

## Step-by-Step Setup

### 1. Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth client ID**
5. If prompted, configure the OAuth consent screen:
   - User Type: **External** (for public use)
   - App name: **Fury Road RC Club** (or your app name)
   - User support email: Your email
   - Developer contact: Your email
   - Add scopes: `email`, `profile`, `openid`
   - Add test users (if in testing mode)

### 2. Configure OAuth Client

1. Application type: **Web application**
2. Name: **Fury Road RC Club Web Client**
3. **Authorized JavaScript origins**:
   ```
   http://localhost:3000
   https://your-production-url.com
   ```
4. **Authorized redirect URIs**:
   ```
   http://localhost:3000/api/auth/callback/google
   https://your-production-url.com/api/auth/callback/google
   ```

### 3. Get Your Credentials

After creating the OAuth client, you'll get:
- **Client ID**: `xxxxx.apps.googleusercontent.com`
- **Client Secret**: `xxxxx`

### 4. Add to Environment Variables

Add these to your `.env` file (local) and your hosting platform (production):

```env
# Google OAuth
GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-client-secret"

# NextAuth (use your production URL)
NEXTAUTH_URL="https://your-production-url.com"
NEXTAUTH_SECRET="your-secret-key-here"
```

### 5. Production Environment Variables

**For Vercel:**
1. Go to your project settings
2. Navigate to **Environment Variables**
3. Add:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `NEXTAUTH_URL` (set to your Vercel URL or custom domain)
   - `NEXTAUTH_SECRET`

**For Railway:**
1. Go to your project settings
2. Navigate to **Variables**
3. Add the same variables as above

## Important Notes

1. **Always use HTTPS in production** - Google OAuth requires HTTPS for production URLs
2. **Add both local and production URLs** - This allows testing locally and production use
3. **Keep credentials secure** - Never commit `.env` files to git
4. **Update redirect URIs** - If you change your domain, update the redirect URIs in Google Console

## Testing

1. **Local Testing:**
   - Use `http://localhost:3000` in authorized origins
   - Use `http://localhost:3000/api/auth/callback/google` in redirect URIs

2. **Production Testing:**
   - Ensure your production URL is added to Google Console
   - Test the sign-in flow on your production site
   - Check browser console for any errors

## Troubleshooting

### Error: "redirect_uri_mismatch"
- **Solution**: Make sure the redirect URI in Google Console exactly matches your `NEXTAUTH_URL` + `/api/auth/callback/google`

### Error: "invalid_client"
- **Solution**: Verify your `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are correct

### Error: "access_denied"
- **Solution**: Check your OAuth consent screen configuration and ensure scopes are properly set

## Quick Reference

**Local Development:**
- `NEXTAUTH_URL=http://localhost:3000`
- Redirect URI: `http://localhost:3000/api/auth/callback/google`

**Production (Example):**
- `NEXTAUTH_URL=https://rc-car-cafe.vercel.app`
- Redirect URI: `https://rc-car-cafe.vercel.app/api/auth/callback/google`

