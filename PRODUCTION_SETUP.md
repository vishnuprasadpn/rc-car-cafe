# Production Setup Guide

## Step 1: Determine Your Production URL

Your production URL depends on where you deploy:

### If using Vercel:
1. After deploying, you'll get: `https://your-app-name.vercel.app`
2. Or add a custom domain: `https://yourdomain.com`

### If using Railway:
1. After deploying, you'll get: `https://your-app-name.up.railway.app`
2. Or add a custom domain: `https://yourdomain.com`

### If using a custom domain:
- `https://furyroadrc.com` (or your domain)

## Step 2: Update Google OAuth Redirect URIs

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** > **Credentials**
3. Click on your OAuth 2.0 Client ID
4. Under **Authorized redirect URIs**, add:
   ```
   https://your-production-url.com/api/auth/callback/google
   ```
5. Under **Authorized JavaScript origins**, add:
   ```
   https://your-production-url.com
   ```
6. Click **Save**

**Example:**
- If your production URL is `https://rc-car-cafe.vercel.app`
- Add redirect URI: `https://rc-car-cafe.vercel.app/api/auth/callback/google`
- Add JavaScript origin: `https://rc-car-cafe.vercel.app`

## Step 3: Add Environment Variables to Production

### For Vercel:

1. Go to your project on [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on your project
3. Go to **Settings** > **Environment Variables**
4. Add the following variables:

```env
# Database
DATABASE_URL=postgresql://username:password@host:port/database

# NextAuth (IMPORTANT: Use your production URL)
NEXTAUTH_URL=https://your-production-url.com
NEXTAUTH_SECRET=your-secret-key-here

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Admin Email
ADMIN_EMAIL=furyroadrcclub@gmail.com

# App Configuration
NEXT_PUBLIC_APP_URL=https://your-production-url.com
NEXT_PUBLIC_APP_NAME=RC Car Café
```

5. Make sure to select **Production** environment for all variables
6. Click **Save**
7. Redeploy your application

### For Railway:

1. Go to your project on [Railway Dashboard](https://railway.app/dashboard)
2. Click on your project
3. Go to **Variables** tab
4. Add all the same environment variables as above
5. Set `NEXTAUTH_URL` to your Railway URL or custom domain
6. Railway will automatically redeploy

### For Other Platforms:

Follow the same pattern - add all environment variables from your `.env` file to your hosting platform's environment variable settings.

## Step 4: Verify Production Setup

After deploying:

1. **Test Google Sign-In:**
   - Visit your production URL
   - Click "Continue with Google"
   - Should redirect to Google and back successfully

2. **Check Environment Variables:**
   - Ensure `NEXTAUTH_URL` matches your production URL exactly
   - Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set

3. **Common Issues:**
   - **"redirect_uri_mismatch"**: The redirect URI in Google Console doesn't match your `NEXTAUTH_URL`
   - **"invalid_client"**: Wrong `GOOGLE_CLIENT_ID` or `GOOGLE_CLIENT_SECRET`
   - **OAuth not working**: Check that `NEXTAUTH_URL` is set correctly

## Quick Checklist

- [ ] Deployed application to production
- [ ] Got production URL (e.g., `https://your-app.vercel.app`)
- [ ] Added production redirect URI to Google Console
- [ ] Added production JavaScript origin to Google Console
- [ ] Added all environment variables to hosting platform
- [ ] Set `NEXTAUTH_URL` to production URL (with `https://`)
- [ ] Tested Google sign-in on production

## Important Notes

1. **Always use HTTPS** in production - Google OAuth requires HTTPS
2. **Never commit `.env` file** to git - it contains secrets
3. **Use different OAuth credentials** for production vs development (optional but recommended)
4. **Test thoroughly** before going live

## Need Help?

If you encounter issues:
1. Check browser console for errors
2. Verify all environment variables are set correctly
3. Ensure redirect URIs match exactly (including `https://`)
4. Check that your OAuth consent screen is published (if using external users)

