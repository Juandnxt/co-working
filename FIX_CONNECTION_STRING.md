# Fix Connection String Error

## Error
```
getaddrinfo ENOENT db.bmnhvvnsdfpkgaumhmtp.supabase.co
```

This means the hostname cannot be resolved (DNS lookup failed).

## Solution: Get the Correct Connection String

The hostname format you're using might be incorrect. Follow these steps:

### Step 1: Get Connection String from Supabase Dashboard

1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to **Settings** > **Database**
4. Scroll to **Connection string** section
5. You'll see different connection modes:

#### Option A: Connection Pooling (Recommended)
- Select **Connection pooling** mode
- Copy the connection string
- It should look like:
  ```
  postgresql://postgres.bmnhvvnsdfpkgaumhmtp:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true
  ```
- Replace `[PASSWORD]` with your actual password
- Replace `[REGION]` with your region (e.g., `us-east-1`, `eu-central-1`)

#### Option B: Direct Connection
- Select **Direct connection** mode
- Copy the connection string
- It should look like:
  ```
  postgresql://postgres.bmnhvvnsdfpkgaumhmtp:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres
  ```
- Or sometimes:
  ```
  postgresql://postgres:[PASSWORD]@db.bmnhvvnsdfpkgaumhmtp.supabase.co:5432/postgres
  ```

### Step 2: Update Your .env File

Replace your current `SUPABASE_URL` with the correct one from Step 1.

**Important:** Make sure:
- No spaces around the `=`
- Password is URL-encoded if it has special characters
- The entire string is in quotes

### Step 3: Test the Connection

After updating, restart your server:
```bash
npm run dev
```

Try registering again and check if the error is gone.

## Common Issues

### Issue: Still getting ENOENT error
- Verify the connection string is exactly as shown in Supabase Dashboard
- Make sure you copied the entire string
- Check if your internet connection is working
- Try pinging the hostname: `ping aws-0-[REGION].pooler.supabase.com`

### Issue: Password has special characters
If your password has special characters like `!`, `@`, `#`, etc., you may need to URL-encode them:
- `!` → `%21`
- `@` → `%40`
- `#` → `%23`
- `$` → `%24`
- `%` → `%25`
- `&` → `%26`

### Issue: Connection timeout
- Try using the direct connection format (port 5432) instead of pooling (port 6543)
- Check if your firewall is blocking the connection
- Verify your IP is allowed in Supabase (Settings > Database > Connection pooling)

## Example Correct Connection Strings

### For Connection Pooling:
```env
SUPABASE_URL="postgresql://postgres.bmnhvvnsdfpkgaumhmtp:Mattyykenet1@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
```

### For Direct Connection:
```env
SUPABASE_URL="postgresql://postgres.bmnhvvnsdfpkgaumhmtp:Mattyykenet1@aws-0-eu-central-1.pooler.supabase.com:5432/postgres"
```

**Note:** Replace `eu-central-1` with your actual region, and `Mattyykenet1` with your actual password.



