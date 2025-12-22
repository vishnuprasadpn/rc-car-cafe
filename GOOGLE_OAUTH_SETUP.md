# Google OAuth Setup Guide

This guide will help you set up Google OAuth authentication for the RC Car Café application.

## Prerequisites

- A Google account
- Access to [Google Cloud Console](https://console.cloud.google.com/)
- Your application's production URL (if deploying)

## Step-by-Step Setup

### 1. Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top
3. Click **"New Project"**
4. Enter a project name (e.g., "RC Car Café")
5. Click **"Create"**

### 2. Enable Google+ API

1. In the Google Cloud Console, go to **"APIs & Services" > "Library"**
2. Search for **"Google+ API"** or **"Google Identity Services"**
3. Click on it and click **"Enable"**

### 3. Configure OAuth Consent Screen

1. Go to **"APIs & Services" > "OAuth consent screen"**
2. Choose **"External"** (unless you have a Google Workspace account)
3. Click **"Create"**
4. Fill in the required information:
   - **App name**: RC Car Café (or your app name)
   - **User support email**: Your email address
   - **Developer contact information**: Your email address
5. Click **"Save and Continue"**
6. On the **Scopes** page, click **"Add or Remove Scopes"**
   - Add: `email`, `profile`, `openid`
   - Click **"Update"** then **"Save and Continue"**
7. On the **Test users** page (if in testing mode):
   - Add test user emails if needed
   - Click **"Save and Continue"**
8. Review and click **"Back to Dashboard"**

### 4. Create OAuth 2.0 Credentials

1. Go to **"APIs & Services" > "Credentials"**
2. Click **"+ CREATE CREDENTIALS"** > **"OAuth client ID"**
3. Select **"Web application"** as the application type
4. Give it a name (e.g., "RC Car Café Web Client")
5. **Authorized JavaScript origins**:
   - For development: `http://localhost:3000`
   - For production: `https://yourdomain.com` (your actual domain)
6. **Authorized redirect URIs**:
   - For development: `http://localhost:3000/api/auth/callback/google`
   - For production: `https://yourdomain.com/api/auth/callback/google`
7. Click **"Create"**
8. **Copy the Client ID and Client Secret** (you'll need these for your `.env` file)

### 5. Configure Environment Variables

Add the following to your `.env.local` (development) or production environment:

```env
# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id-here.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret-here"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"  # Development
# NEXTAUTH_URL="https://yourdomain.com"  # Production
NEXTAUTH_SECRET="your-secret-key-here"  # Generate a random string
```

### 6. Generate NEXTAUTH_SECRET

You can generate a secure secret using:

```bash
# Using OpenSSL
openssl rand -base64 32

# Or using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 7. Production Configuration

When deploying to production:

1. **Update OAuth Consent Screen**:
   - Go to **"OAuth consent screen"**
   - Click **"PUBLISH APP"** (if still in testing mode)
   - This makes it available to all users

2. **Update Authorized Redirect URIs**:
   - Go to **"Credentials"**
   - Edit your OAuth 2.0 Client ID
   - Add your production URL: `https://yourdomain.com/api/auth/callback/google`
   - Add your production origin: `https://yourdomain.com`

3. **Update Environment Variables**:
   ```env
   NEXTAUTH_URL="https://yourdomain.com"
   GOOGLE_CLIENT_ID="your-production-client-id"
   GOOGLE_CLIENT_SECRET="your-production-client-secret"
   ```

## Testing

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `/auth/signin` or `/auth/signup`

3. Click **"Continue with Google"**

4. You should be redirected to Google's sign-in page

5. After signing in, you'll be redirected back to your app

## Troubleshooting

### Error: "redirect_uri_mismatch"

- **Cause**: The redirect URI in your Google Console doesn't match the one NextAuth is using
- **Fix**: 
  - Check that `NEXTAUTH_URL` matches your actual domain
  - Ensure the redirect URI in Google Console is exactly: `{NEXTAUTH_URL}/api/auth/callback/google`
  - Make sure there are no trailing slashes

### Error: "OAuthSignin"

- **Cause**: Invalid Client ID or Client Secret
- **Fix**: 
  - Double-check your `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in `.env`
  - Ensure there are no extra spaces or quotes
  - Regenerate credentials if needed

### Error: "Access blocked: This app's request is invalid"

- **Cause**: OAuth consent screen not properly configured or app not published
- **Fix**:
  - Complete the OAuth consent screen setup
  - For production, publish the app (not just test mode)
  - Ensure all required scopes are added

### Users not being created

- **Cause**: Database connection issue or Prisma error
- **Fix**:
  - Check server logs for errors
  - Ensure database is accessible
  - Check that Prisma schema includes the `User` model

## Security Best Practices

1. **Never commit `.env` files** to version control
2. **Use different credentials** for development and production
3. **Rotate secrets** periodically
4. **Monitor OAuth usage** in Google Cloud Console
5. **Set up OAuth consent screen** properly with privacy policy and terms

## Additional Resources

- [NextAuth.js Google Provider Documentation](https://next-auth.js.org/providers/google)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Google Cloud Console](https://console.cloud.google.com/)

## Quick Checklist

- [ ] Google Cloud Project created
- [ ] Google+ API enabled
- [ ] OAuth consent screen configured
- [ ] OAuth 2.0 credentials created
- [ ] Authorized redirect URIs added (dev + production)
- [ ] Environment variables set in `.env.local`
- [ ] `NEXTAUTH_SECRET` generated
- [ ] Tested Google sign-in in development
- [ ] Production URLs configured in Google Console
- [ ] Production environment variables set
- [ ] OAuth consent screen published (for production)

