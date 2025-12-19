# Quick Fix: Connection String Error

## Problem
```
getaddrinfo ENOENT db.bmnhvvnsdfpkgaumhmtp.supabase.co
```

## Solution

The hostname `db.bmnhvvnsdfpkgaumhmtp.supabase.co` may have IPv6 issues. Use the **Connection Pooling** format instead.

### Step 1: Get Connection String from Supabase

1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to **Settings** > **Database**
4. Scroll to **Connection string**
5. **IMPORTANT:** Select **Connection pooling** mode (NOT Direct connection)
6. Copy the connection string

It should look like:
```
postgresql://postgres.bmnhvvnsdfpkgaumhmtp:[PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

### Step 2: Update Your .env

Replace your current `SUPABASE_URL` with the connection pooling string:

```env
SUPABASE_URL="postgresql://postgres.bmnhvvnsdfpkgaumhmtp:Mattyykenet1@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
```

**Important:**
- Replace `eu-central-1` with YOUR actual region (check in Supabase Dashboard)
- Replace `Mattyykenet1` with your actual password
- Make sure the entire string is in quotes
- No spaces around the `=`

### Step 3: Restart Server

```bash
npm run dev
```

### Why This Works

- Connection pooling uses `aws-0-[REGION].pooler.supabase.com` which has better IPv4/IPv6 compatibility
- The direct connection format `db.bmnhvvnsdfpkgaumhmtp.supabase.co` may have DNS resolution issues
- Connection pooling is also recommended for production use

## Still Not Working?

If you still get errors:

1. **Check your region**: Make sure you're using the correct region (e.g., `us-east-1`, `eu-central-1`, `ap-southeast-1`)
2. **Verify password**: Make sure your password is correct (no extra spaces)
3. **Try direct connection format**: If pooling doesn't work, try:
   ```
   postgresql://postgres.bmnhvvnsdfpkgaumhmtp:Mattyykenet1@aws-0-eu-central-1.pooler.supabase.com:5432/postgres
   ```
   (Note: port 5432 instead of 6543, and no `?pgbouncer=true`)



