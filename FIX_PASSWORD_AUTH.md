# Fix Password Authentication Error

## Error
```
password authentication failed for user "postgres"
```

This means the connection is working, but either:
1. The password is incorrect
2. The username format is wrong

## Solution

### Step 1: Verify Your Database Password

1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to **Settings** > **Database**
4. Scroll to **Database password** section
5. If you forgot it, click **Reset database password**
6. Copy the new password (you'll only see it once!)

### Step 2: Check Your Connection String Format

The username in the connection string should be:
```
postgres.bmnhvvnsdfpkgaumhmtp
```

**NOT just:**
```
postgres
```

### Step 3: Update Your .env File

Make sure your connection string has the correct format:

**For Connection Pooling (Recommended):**
```env
SUPABASE_URL="postgresql://postgres.bmnhvvnsdfpkgaumhmtp:YOUR_PASSWORD@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
```

**Important:**
- Username: `postgres.bmnhvvnsdfpkgaumhmtp` (NOT just `postgres`)
- Password: Your actual database password from Step 1
- Region: Replace `eu-central-1` with your actual region
- Entire string must be in quotes `"`
- No spaces around the `=`

### Step 4: URL Encode Special Characters in Password

If your password has special characters, you may need to URL-encode them:

- `!` → `%21`
- `@` → `%40`
- `#` → `%23`
- `$` → `%24`
- `%` → `%25`
- `&` → `%26`
- `*` → `%2A`
- `+` → `%2B`
- `=` → `%3D`

**Example:**
If your password is `MyPass!123`, use `MyPass%21123` in the connection string.

### Step 5: Test the Connection

After updating, restart your server:
```bash
npm run dev
```

## Common Issues

### Issue: Still getting password error
1. **Double-check the password** - Copy it directly from Supabase Dashboard
2. **Check username format** - Must be `postgres.bmnhvvnsdfpkgaumhmtp`, not `postgres`
3. **URL encode special characters** - If password has `!`, `@`, `#`, etc.
4. **Verify no extra spaces** - Check before and after the password
5. **Check quotes** - Make sure the entire string is in quotes

### Issue: Password has spaces
If your password has spaces, they should be URL-encoded as `%20` or the password should be in quotes in the connection string.

### Issue: Not sure about the format
The easiest way is to:
1. Go to Supabase Dashboard > Settings > Database
2. Click **Connection pooling** tab
3. Click **Copy** button next to the connection string
4. Paste it directly into your `.env` file
5. Replace `[YOUR-PASSWORD]` with your actual password

## Example Connection Strings

### With Simple Password:
```env
SUPABASE_URL="postgresql://postgres.bmnhvvnsdfpkgaumhmtp:Mattyykenet1@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
```

### With Password Containing Special Characters:
If password is `MyPass!@#123`:
```env
SUPABASE_URL="postgresql://postgres.bmnhvvnsdfpkgaumhmtp:MyPass%21%40%23123@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
```

## Quick Test

To verify your connection string is correct, you can test it:

1. Copy your connection string from `.env`
2. Go to Supabase Dashboard > SQL Editor
3. Try running a simple query - if it works, your connection string is correct
4. If it fails, check the error message for clues



