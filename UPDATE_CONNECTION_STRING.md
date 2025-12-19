# ⚠️ URGENT: Update Your Connection String

## Current Problem

You're using:
```
db.bmnhvvnsdfpkgaumhmtp.supabase.co
```

This format has IPv6 resolution issues. **You MUST use Connection Pooling format instead.**

## Solution: Get Connection String from Supabase Dashboard

### Step 1: Open Supabase Dashboard

1. Go to: https://supabase.com/dashboard
2. Login to your account
3. Select your project: `bmnhvvnsdfpkgaumhmtp`

### Step 2: Get Connection Pooling String

1. Click **Settings** (gear icon in left sidebar)
2. Click **Database** in the settings menu
3. Scroll down to **Connection string** section
4. **IMPORTANT:** Click on **Connection pooling** tab (NOT "Direct connection")
5. You'll see a connection string that looks like:
   ```
   postgresql://postgres.bmnhvvnsdfpkgaumhmtp:[YOUR-PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true
   ```
6. Click the **Copy** button next to it

### Step 3: Update Your .env File

Open your `.env` file and replace the `SUPABASE_URL` line:

**OLD (WRONG):**
```env
SUPABASE_URL=postgresql://postgres:Mattyykenet1@db.bmnhvvnsdfpkgaumhmtp.supabase.co:5432/postgres
```

**NEW (CORRECT):**
```env
SUPABASE_URL="postgresql://postgres.bmnhvvnsdfpkgaumhmtp:Mattyykenet1@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
```

**Important Notes:**
- Replace `eu-central-1` with YOUR actual region (check in Supabase Dashboard)
- Replace `Mattyykenet1` with your actual password
- The entire string MUST be in quotes `"`
- No spaces around the `=`

### Step 4: Find Your Region

If you're not sure what region to use:

1. In Supabase Dashboard, go to **Settings** > **General**
2. Look for **Region** - it will show something like:
   - `eu-central-1` (Europe - Frankfurt)
   - `us-east-1` (US East)
   - `ap-southeast-1` (Asia Pacific)
   - etc.

Use that exact region name in your connection string.

### Step 5: Restart Server

After updating `.env`:

1. Stop your server (Ctrl+C)
2. Start it again:
   ```bash
   npm run dev
   ```

### Step 6: Test

Try registering a user again. The error should be gone!

## Why This Works

- Connection Pooling uses `aws-0-[REGION].pooler.supabase.com` which has better DNS/IPv4 support
- The direct format `db.bmnhvvnsdfpkgaumhmtp.supabase.co` only resolves to IPv6, causing Node.js connection issues
- Connection Pooling is also recommended for production use

## Still Having Issues?

If you still get errors after using Connection Pooling:

1. **Double-check your region** - Make sure it matches exactly what's in Supabase Dashboard
2. **Verify password** - Make sure there are no extra spaces or typos
3. **Check quotes** - The entire connection string must be in quotes
4. **Restart server** - Make sure you restarted after changing `.env`

## Example by Region

### Europe (eu-central-1):
```env
SUPABASE_URL="postgresql://postgres.bmnhvvnsdfpkgaumhmtp:Mattyykenet1@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
```

### US East (us-east-1):
```env
SUPABASE_URL="postgresql://postgres.bmnhvvnsdfpkgaumhmtp:Mattyykenet1@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
```

### US West (us-west-1):
```env
SUPABASE_URL="postgresql://postgres.bmnhvvnsdfpkgaumhmtp:Mattyykenet1@aws-0-us-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
```

Replace with YOUR region and password!



