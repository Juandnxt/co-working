# Troubleshooting Guide

## Problem: "User registered" but database is empty

If you see the success message but no data appears in Supabase, follow these steps:

### Step 1: Verify Database Connection

Run the test script:

```bash
node lib/test-db.ts
```

Or if that doesn't work:

```bash
npm run test:db
```

This will:
- Test your database connection
- Check if tables exist
- Show table structure
- Count existing users

### Step 2: Check if Tables Exist

1. Go to Supabase Dashboard
2. Click on **Table Editor**
3. You should see these tables:
   - `User`
   - `Session`
   - `VerificationCode`
   - `Booking`

**If tables don't exist:**
1. Go to **SQL Editor**
2. Click **New Query**
3. Open `database/schema.sql` from this project
4. Copy ALL the contents
5. Paste into SQL Editor
6. Click **Run** (or press Ctrl+Enter)
7. You should see: "Success. No rows returned"

### Step 3: Check Server Logs

When you try to register, check your terminal/console for error messages. You should see:
- `Creating user with ID: [uuid]`
- `User created successfully: [uuid]`
- `Verification code created for user: [uuid]`

If you see errors instead, they will tell you what's wrong.

### Step 4: Verify Environment Variables

Make sure your `.env` file has:

```env
SUPABASE_URL=postgresql://postgres:Mattyykenet1@db.bmnhvvnsdfpkgaumhmtp.supabase.co:5432/postgres
```

**Important:** 
- No spaces around the `=`
- Password is correct
- URL is complete

### Step 5: Test Direct Database Insert

Try inserting a test user directly in Supabase SQL Editor:

```sql
INSERT INTO "User" (id, email, password, name, "createdAt", "updatedAt")
VALUES (
  gen_random_uuid()::text,
  'test@example.com',
  '$2a$10$test', -- This is a dummy hash, real ones are longer
  'Test User',
  NOW(),
  NOW()
);
```

If this works, the table exists and the problem is in the application code.
If this fails, check the error message - it will tell you what's wrong.

### Step 6: Check for Silent Errors

The application now has better error logging. Check your server console for:
- `Error in createUser: [error message]`
- `Registration error: [error message]`

These will show you exactly what's failing.

### Common Issues

#### Issue: "relation 'User' does not exist"
**Solution:** Tables don't exist. Run `database/schema.sql` in Supabase SQL Editor.

#### Issue: "password authentication failed"
**Solution:** Your `SUPABASE_URL` password is incorrect. Check it in Supabase Dashboard > Settings > Database.

#### Issue: "connection refused"
**Solution:** 
- Check your internet connection
- Verify the host in `SUPABASE_URL` is correct
- Check if your IP is allowed in Supabase (Settings > Database > Connection pooling)

#### Issue: No errors but no data
**Solution:**
- Check if you're looking at the correct database/project in Supabase
- Refresh the Table Editor
- Check server logs for silent errors
- Verify the INSERT query is actually executing (check server logs)

### Still Having Issues?

1. Check Supabase Dashboard > Logs for any database errors
2. Verify your connection string format is correct
3. Make sure you're using the correct Supabase project
4. Check browser console for any client-side errors
5. Review server terminal output for detailed error messages



