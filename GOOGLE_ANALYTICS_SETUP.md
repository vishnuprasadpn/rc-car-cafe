# Google Analytics 4 (GA4) Setup Guide

This guide will help you set up Google Analytics 4 for tracking page views and button clicks on your RC Car Café application.

## Prerequisites

- A Google account
- Access to [Google Analytics](https://analytics.google.com/)

## Step-by-Step Setup

### 1. Create a Google Analytics 4 Property

1. Go to [Google Analytics](https://analytics.google.com/)
2. Click **"Admin"** (gear icon) in the bottom left
3. In the **Property** column, click **"Create Property"**
4. Enter property details:
   - **Property name**: Fury Road RC Club (or your app name)
   - **Reporting time zone**: Select your timezone
   - **Currency**: Select your currency (INR for India)
5. Click **"Next"**
6. Fill in business information:
   - **Industry category**: Select appropriate category
   - **Business size**: Select your size
7. Click **"Create"**
8. Accept the terms and conditions

### 2. Get Your Measurement ID

1. After creating the property, you'll see a **"Data Streams"** section
2. Click **"Add stream"** > **"Web"**
3. Enter your website details:
   - **Website URL**: `https://furyroadclub.com` (or your domain)
   - **Stream name**: Fury Road RC Club Web
4. Click **"Create stream"**
5. Copy your **Measurement ID** (starts with `G-`, e.g., `G-XXXXXXXXXX`)

### 3. Configure Environment Variables

Add the Measurement ID to your environment variables:

**Development (`.env.local`):**
```env
NEXT_PUBLIC_GA_MEASUREMENT_ID="G-3YGNXQ9MRP"
```

**Note:** Your Measurement ID is `G-3YGNXQ9MRP`. The `@next/third-parties` package will automatically load the gtag.js script - no need to add the script tag manually!

**Production (Vercel/Deployment):**
Add the same variable in your deployment platform's environment variables.

### 4. Verify Installation

1. Deploy your application with the environment variable set
2. Visit your website
3. Go to Google Analytics > **Reports** > **Realtime**
4. You should see your visit appear within a few seconds

## What's Being Tracked

### Automatic Tracking

- **Page Views**: Automatically tracked on all page navigations
- **Page Load Times**: Performance metrics

### Custom Event Tracking

The following events are tracked:

#### Authentication Events
- `auth` - Sign in, sign up, sign out
  - Actions: `sign_in`, `sign_up`, `sign_out`
  - Methods: `email`, `google`

#### Booking Events
- `booking` - Booking-related actions
  - Actions: `view`, `create`, `cancel`, `complete`
  - Includes: `game_id`, `value` (amount)

#### Button Clicks
- `button_click` - All button interactions
  - Category: `engagement`
  - Includes: `label` (button name), `location` (page)

#### Form Submissions
- `form_submit` - Form submission events
  - Actions: `submit_success`, `submit_error`
  - Includes: form name and error details

#### Payment Events
- `payment` - Payment-related actions
  - Actions: `initiate`, `success`, `failure`
  - Includes: `value` (amount), `payment_method`

#### Navigation Events
- `navigation` - User navigation
  - Includes: `destination`, `source`

## Viewing Analytics Data

### Real-time Reports

1. Go to Google Analytics
2. Click **"Reports"** > **"Realtime"**
3. See active users and events happening right now

### Event Reports

1. Go to **"Reports"** > **"Engagement"** > **"Events"**
2. See all custom events being tracked
3. Filter by event name to see specific actions

### Custom Reports

Create custom reports for:
- Booking conversion rates
- Most popular games
- User authentication methods
- Button click heatmaps

## Testing Tracking

### Using Google Analytics DebugView

1. Install [Google Analytics Debugger](https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjcijamephohjechhna) Chrome extension
2. Enable it while browsing your site
3. Go to Google Analytics > **Admin** > **DebugView**
4. See events firing in real-time

### Using Browser Console

Open browser console and check for:
- No errors related to `gtag`
- Events being logged (if in development mode)

## Troubleshooting

### Events Not Showing Up

1. **Check Environment Variable**:
   - Verify `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set
   - Make sure it starts with `G-`
   - No extra spaces or quotes

2. **Check Measurement ID**:
   - Verify the ID in Google Analytics matches your env variable
   - Make sure the property is active

3. **Check Ad Blockers**:
   - Disable ad blockers temporarily
   - Some browsers block analytics by default

4. **Wait for Data**:
   - Real-time data appears within seconds
   - Standard reports may take 24-48 hours

### Common Issues

**Issue**: "Measurement ID not found"
- **Solution**: Verify `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set correctly

**Issue**: "Events not tracking"
- **Solution**: Check browser console for errors, verify gtag is loaded

**Issue**: "Data delayed"
- **Solution**: Real-time shows immediately, standard reports have delay

## Best Practices

1. **Respect User Privacy**:
   - Consider adding cookie consent banner
   - Comply with GDPR/CCPA if applicable
   - Allow users to opt-out

2. **Test Before Production**:
   - Test all tracking events in development
   - Use DebugView to verify events

3. **Monitor Regularly**:
   - Check analytics weekly
   - Set up custom alerts for important events
   - Review conversion funnels

4. **Optimize Performance**:
   - Analytics is loaded asynchronously
   - Won't block page rendering
   - Minimal performance impact

## Advanced Configuration

### Custom Dimensions

You can add custom dimensions for:
- User roles (Admin, Staff, Customer)
- Booking status
- Game types

### Goals and Conversions

Set up goals in Google Analytics:
- Booking completion
- User registration
- Payment success

### Enhanced Ecommerce

For detailed booking analytics:
- Enable Enhanced Ecommerce
- Track booking value
- Track game popularity

## Support

For more information:
- [Google Analytics Help Center](https://support.google.com/analytics)
- [GA4 Documentation](https://developers.google.com/analytics/devguides/collection/ga4)

## Quick Checklist

- [ ] Created Google Analytics 4 property
- [ ] Created web data stream
- [ ] Copied Measurement ID (G-XXXXXXXXXX)
- [ ] Added `NEXT_PUBLIC_GA_MEASUREMENT_ID` to `.env.local`
- [ ] Added `NEXT_PUBLIC_GA_MEASUREMENT_ID` to production environment
- [ ] Deployed application
- [ ] Verified tracking in Real-time reports
- [ ] Tested button clicks and form submissions
- [ ] Set up custom reports (optional)

