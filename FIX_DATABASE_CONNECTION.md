# 🔧 Fix Database Connection Error - Step by Step

**Error:** `Can't reach database server at db.zmtlfrsnjcnshqxcqbry.supabase.co:5432`

## ✅ Quick Fix Steps

### Step 1: Check Supabase Dashboard

1. Go to [supabase.com](https://supabase.com) and log in
2. Find your project: `zmtlfrsnjcnshqxcqbry` (or search by name)
3. **Check Status:**
   - Is project **"Paused"**? → Click **"Resume"** or **"Restore"**
   - Is project **"Inactive"**? → Reactivate it
   - Is project **Active**? → Continue to Step 2

### Step 2: Verify Connection String

Your current connection string:
```
postgresql://postgres:Furyroadrc@db.zmtlfrsnjcnshqxcqbry.supabase.co:5432/postgres
```

**Get Fresh Connection String:**
1. In Supabase dashboard → **Settings** (gear icon) → **Database**
2. Scroll to **"Connection string"** section
3. Under **"URI"**, copy the connection string
4. **Replace** the `DATABASE_URL` in your `.env` file with the fresh one

### Step 3: Update .env File

```bash
# Edit your .env file
nano .env

# Or open in editor and replace DATABASE_URL with the fresh one from Supabase
```

### Step 4: Test Connection

```bash
# Test the connection
npx prisma db pull
```

**If it works:** Continue to Step 5
**If it fails:** Continue to Step 6

### Step 5: Run Migrations

```bash
npx prisma generate
npx prisma db push
npm run db:seed
```

✅ **Done!** Your database is now connected.

---

## 🔍 If Step 4 Still Fails

### Option A: Use Connection Pooling (Recommended)

Supabase provides a connection pooling URL that's more reliable:

1. In Supabase → Settings → Database → Connection string
2. Switch to **"Connection pooling"** tab
3. Select **"Session"** mode
4. Copy the connection string (starts with `postgresql://postgres.gq...`)
5. Update `DATABASE_URL` in `.env` with this pooled connection

**Example:**
```
postgresql://postgres.gqxxxxx:Furyroadrc@aws-0-ap-south-1.pooler.supabase.com:6543/postgres
```

### Option B: Verify Password

1. Go to Supabase → Settings → Database
2. Check if you can reset the database password
3. If you reset it, update `DATABASE_URL` with new password

### Option C: Create New Supabase Project (If all else fails)

If your Supabase project is completely inaccessible:

1. **Create New Project:**
   - Go to [supabase.com](https://supabase.com)
   - Click "New Project"
   - Name: `fury-road-rc-club`
   - Region: `Asia Pacific (Mumbai)` or closest to you
   - Password: Create strong password (save it!)

2. **Get Connection String:**
   - Settings → Database → Copy connection string

3. **Update .env:**
   ```env
   DATABASE_URL="postgresql://postgres:[NEW-PASSWORD]@db.[NEW-PROJECT].supabase.co:5432/postgres"
   ```

4. **Run Migrations:**
   ```bash
   npx prisma generate
   npx prisma db push
   npm run db:seed
   ```

---

## 🧪 Test Connection Manually

You can also test if the database server is reachable:

```bash
# Test if port 5432 is accessible (Mac/Linux)
nc -zv db.zmtlfrsnjcnshqxcqbry.supabase.co 5432

# Or use telnet
telnet db.zmtlfrsnjcnshqxcqbry.supabase.co 5432
```

**If connection timeout:** Database is likely paused or network issue

---

## ✅ Success Checklist

After following steps above, verify:
- [ ] `npx prisma db pull` works without errors
- [ ] `npx prisma db push` creates tables successfully
- [ ] `npm run db:seed` populates data
- [ ] `npm run dev` starts without database errors

---

## 📞 Still Not Working?

**Common Issues:**

1. **Supabase Free Tier Limitations:**
   - Free projects auto-pause after inactivity
   - Resume the project in dashboard

2. **Network/Firewall:**
   - Try from different network (mobile hotspot)
   - Check if corporate firewall blocks PostgreSQL ports

3. **Wrong Region:**
   - Ensure Supabase project region matches your location
   - Consider recreating in closer region

4. **Account Issues:**
   - Verify Supabase account is active
   - Check billing/payment status

**Next Steps:**
- Contact Supabase support if project seems stuck
- Consider using alternative: Railway PostgreSQL or Neon
- See `END_TO_END_DEPLOYMENT.md` for alternative database setup

