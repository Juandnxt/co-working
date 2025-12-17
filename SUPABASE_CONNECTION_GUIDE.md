# Supabase Connection Guide - Step by Step

This guide will walk you through connecting your CoWorking application to Supabase using the provided connection string.

## Your Connection String

```
SUPABASE_URL=postgresql://postgres:Mattyykenet1@db.bmnhvvnsdfpkgaumhmtp.supabase.co:5432/postgres
```

## Step 1: Install Dependencies

First, make sure you have the required PostgreSQL client installed:

```bash
npm install
```

This will install the `postgres` package which is used to connect to Supabase.

## Step 2: Configure Environment Variables

Create or update your `.env` file in the root of the project with:

```env
# Supabase Database Connection
SUPABASE_URL=postgresql://postgres:Mattyykenet1@db.bmnhvvnsdfpkgaumhmtp.supabase.co:5432/postgres

# Supabase Project URL (optional, for future use)
SUPABASE_PROJECT_URL=https://bmnhvvnsdfpkgaumhmtp.supabase.co

# Supabase API Key (get from Supabase Dashboard > Settings > API)
SUPABASE_API_KEY=your-api-key-here

# Gmail Configuration
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-gmail-app-password
```

## Step 3: Create Database Tables

### Option A: Using Supabase SQL Editor (Recommended)

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: `bmnhvvnsdfpkgaumhmtp`
3. Click on **SQL Editor** in the left sidebar
4. Click **New Query**
5. Open the file `database/schema.sql` from this project
6. Copy the entire contents of `database/schema.sql`
7. Paste it into the Supabase SQL Editor
8. Click **Run** (or press Ctrl+Enter)
9. You should see a success message: "Success. No rows returned"

### Option B: Using psql Command Line

If you have `psql` installed:

```bash
psql "postgresql://postgres:Mattyykenet1@db.bmnhvvnsdfpkgaumhmtp.supabase.co:5432/postgres" -f database/schema.sql
```

## Step 4: Verify Tables Were Created

1. In Supabase Dashboard, go to **Table Editor**
2. You should see the following tables:
   - `User`
   - `Session`
   - `VerificationCode`
   - `Booking`

## Step 5: Test the Connection

Start your development server:

```bash
npm run dev
```

The application should start without errors. If you see connection errors, check:

1. Your `.env` file has the correct `SUPABASE_URL`
2. Your database password is correct
3. Your IP address is allowed in Supabase (if using IP restrictions)

## Step 6: Test Registration

1. Go to `http://localhost:5000/register`
2. Create a new account
3. Check Supabase Dashboard > Table Editor > `User` table
4. You should see your new user record

## Troubleshooting

### Error: "Connection refused"

- Verify your connection string is correct
- Check that your IP is allowed in Supabase Dashboard > Settings > Database > Connection pooling
- Make sure you're using the correct port (5432 for direct connection)

### Error: "Password authentication failed"

- Double-check your password in the connection string
- You can reset your database password in Supabase Dashboard > Settings > Database > Database password

### Error: "Relation does not exist"

- Make sure you ran the `database/schema.sql` script
- Check that tables exist in Supabase Dashboard > Table Editor
- Verify you're connected to the correct database

### Tables not appearing

- Make sure you ran the SQL script completely
- Check for any error messages in the SQL Editor
- Refresh the Table Editor page
- Verify you're looking in the `public` schema

## Connection String Format

Your connection string format:
```
postgresql://[USER]:[PASSWORD]@[HOST]:[PORT]/[DATABASE]
```

Where:
- `USER`: `postgres`
- `PASSWORD`: `Mattyykenet1`
- `HOST`: `db.bmnhvvnsdfpkgaumhmtp.supabase.co`
- `PORT`: `5432`
- `DATABASE`: `postgres`

## Security Notes

⚠️ **Important Security Reminders:**

1. **Never commit your `.env` file** to version control
2. The connection string contains your database password - keep it secret
3. Use environment variables in production, never hardcode credentials
4. Consider using Supabase connection pooling for production (port 6543)

## Next Steps

After successful connection:

1. Test user registration
2. Test user login
3. Test booking functionality
4. Monitor your database in Supabase Dashboard
5. Set up backups in Supabase Dashboard > Settings > Database

## Getting Your API Key

1. Go to Supabase Dashboard > Settings > API
2. Find **Project API keys**
3. Copy the **anon** or **public** key
4. Add it to `SUPABASE_API_KEY` in your `.env` file

This key is safe to use in client-side code and is required for some Supabase features.

