# Domain Setup Guide - Connect GoDaddy Domain to Vercel

## Step-by-Step Instructions

### Step 1: Add Domain in Vercel (2 minutes)

1. **Go to Vercel Dashboard**
   - Visit [vercel.com/dashboard](https://vercel.com/dashboard)
   - Select your project

2. **Navigate to Domain Settings**
   - Click on **Settings** tab
   - Click on **Domains** in the left sidebar

3. **Add Your Domain**
   - Click **Add Domain** button
   - Enter your domain (e.g., `furyroadrcclub.com`)
   - Click **Add**
   - Vercel will show you DNS configuration options

4. **Choose Configuration Method**
   - Vercel will show two options:
     - **Option A: Nameservers** (Easier - Recommended)
     - **Option B: DNS Records** (More control)

---

### Step 2: Configure DNS in GoDaddy

#### Method A: Using Nameservers (Easiest - Recommended)

1. **Get Nameservers from Vercel**
   - In Vercel Domains page, select "Nameservers" option
   - Copy the nameservers provided (usually 2-4 nameservers like `ns1.vercel-dns.com`)

2. **Update Nameservers in GoDaddy**
   - Login to [GoDaddy.com](https://godaddy.com)
   - Go to **My Products** → Select your domain
   - Click **DNS** or **Manage DNS**
   - Scroll down to **Nameservers** section
   - Click **Change** or **Edit**
   - Select **Custom** (not "GoDaddy Nameservers")
   - Enter the nameservers from Vercel (one per line)
   - Click **Save**
   - Confirm the change

3. **Wait for Propagation**
   - DNS changes can take 24-48 hours, but usually work within 1-2 hours
   - Vercel will automatically verify and provision SSL

#### Method B: Using DNS Records (More Control)

1. **Get DNS Records from Vercel**
   - In Vercel Domains page, select "DNS Records" option
   - You'll see records like:
     ```
     Type: A
     Name: @
     Value: 76.76.21.21
     TTL: Auto
     
     Type: CNAME
     Name: www
     Value: cname.vercel-dns.com
     TTL: Auto
     ```

2. **Update DNS Records in GoDaddy**
   - Login to [GoDaddy.com](https://godaddy.com)
   - Go to **My Products** → Select your domain
   - Click **DNS** or **Manage DNS**
   - Scroll to **Records** section

3. **Remove Existing Records (if needed)**
   - Delete any conflicting A records for `@` or root domain
   - Delete any conflicting CNAME records for `www`

4. **Add New Records**
   
   **For Root Domain (@):**
   - Click **Add** → Select **A Record**
   - Name: `@` (or leave blank)
   - Value: `76.76.21.21` (use the IP from Vercel)
   - TTL: `600` seconds (or 1 hour)
   - Click **Save**
   
   **For WWW Subdomain:**
   - Click **Add** → Select **CNAME Record**
   - Name: `www`
   - Value: `cname.vercel-dns.com` (use the value from Vercel)
   - TTL: `600` seconds
   - Click **Save**

5. **Wait for Propagation**
   - DNS changes can take 24-48 hours, but usually work within 1-2 hours

---

### Step 3: Verify Domain in Vercel

1. **Check Domain Status**
   - Go back to Vercel → Settings → Domains
   - You should see your domain listed
   - Status will show:
     - ⏳ **Pending** - DNS is propagating (wait 1-2 hours)
     - ✅ **Valid** - Domain is connected and working
     - ❌ **Invalid** - DNS not configured correctly

2. **SSL Certificate**
   - Vercel automatically provisions SSL certificates
   - Once domain shows as "Valid", SSL will be active (may take 5-10 minutes)
   - Your site will be accessible at `https://yourdomain.com`

---

### Step 4: Update Environment Variables

Make sure `NEXTAUTH_URL` and `NEXT_PUBLIC_APP_URL` in Vercel use your custom domain:

1. **Go to Vercel Project Settings**
   - Settings → Environment Variables

2. **Update These Variables:**
   ```
   NEXTAUTH_URL=https://yourdomain.com
   NEXT_PUBLIC_APP_URL=https://yourdomain.com
   ```

3. **Redeploy** (if needed)
   - Vercel will auto-redeploy when you push changes
   - Or manually trigger a redeploy from Deployments tab

---

### Step 5: Test Your Domain

1. **Wait for DNS Propagation** (1-2 hours)
   - Check DNS propagation: [whatsmydns.net](https://whatsmydns.net)
   - Enter your domain and check if it shows Vercel's IP

2. **Test HTTPS**
   - Visit `https://yourdomain.com`
   - Should show a secure padlock icon
   - Should redirect to HTTPS automatically

3. **Test Both URLs**
   - `https://yourdomain.com` (root domain)
   - `https://www.yourdomain.com` (www subdomain)
   - Both should work

---

## Troubleshooting

### Domain Not Connecting?

1. **Check DNS Propagation**
   - Use [whatsmydns.net](https://whatsmydns.net)
   - Enter your domain
   - Check if A records show Vercel's IP globally
   - Wait up to 48 hours for full propagation

2. **Verify DNS Records in GoDaddy**
   - Double-check records match exactly what Vercel shows
   - Ensure no conflicting records exist
   - Check TTL values are reasonable (600 seconds recommended)

3. **Clear Your DNS Cache**
   ```bash
   # On Mac
   sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder
   
   # On Windows
   ipconfig /flushdns
   
   # On Linux
   sudo systemd-resolve --flush-caches
   ```

4. **Check Vercel Domain Status**
   - Go to Vercel → Settings → Domains
   - Look for error messages
   - Check if domain shows as "Invalid" - click to see error details

### SSL Certificate Not Working?

1. **Wait 10-15 Minutes**
   - SSL certificates are provisioned automatically after domain verification
   - This can take 10-15 minutes after domain shows as "Valid"

2. **Check SSL Status**
   - In Vercel → Settings → Domains
   - Click on your domain
   - Check SSL certificate status

3. **Force HTTPS Redirect**
   - Vercel automatically redirects HTTP to HTTPS
   - If not working, check Vercel project settings

### WWW Not Working?

If `www.yourdomain.com` is not working:

1. **Check CNAME Record**
   - Ensure CNAME record for `www` exists in GoDaddy
   - Value should be `cname.vercel-dns.com` (or what Vercel shows)

2. **Add Redirect in Vercel (Optional)**
   - Vercel automatically handles www redirects
   - You can configure redirects in Project Settings → Domains

---

## Quick Reference

### Vercel Dashboard
- **Domains**: Settings → Domains
- **Environment Variables**: Settings → Environment Variables
- **Deployments**: Deployments tab

### GoDaddy Dashboard
- **DNS Management**: My Products → Select Domain → DNS
- **Nameservers**: My Products → Select Domain → DNS → Nameservers

### DNS Record Types
- **A Record**: Points domain to IP address (for root domain)
- **CNAME Record**: Points domain to another domain (for www subdomain)
- **TTL**: Time to live (how long DNS cache is valid) - 600 seconds recommended

---

## Expected Timeline

- **DNS Propagation**: 1-48 hours (usually 1-2 hours)
- **Domain Verification**: 5-10 minutes after DNS propagates
- **SSL Certificate**: 10-15 minutes after domain verification
- **Total Time**: Usually 2-3 hours, but can take up to 48 hours

---

## Need Help?

If you're still having issues:

1. **Check Vercel Documentation**: [vercel.com/docs/concepts/projects/domains](https://vercel.com/docs/concepts/projects/domains)
2. **Check GoDaddy Support**: [support.godaddy.com](https://support.godaddy.com)
3. **Verify DNS Records Match**: Compare GoDaddy records with Vercel requirements exactly
4. **Check Vercel Status**: [vercel-status.com](https://vercel-status.com)

---

## Success Checklist

- [ ] Domain added in Vercel
- [ ] DNS records configured in GoDaddy
- [ ] Domain shows as "Valid" in Vercel
- [ ] SSL certificate is active
- [ ] `https://yourdomain.com` works
- [ ] `https://www.yourdomain.com` works
- [ ] Environment variables updated with custom domain
- [ ] App is accessible via custom domain

---

**Congratulations!** Once all checks pass, your domain is successfully connected! 🎉

