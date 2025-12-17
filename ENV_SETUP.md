# Environment Variables Setup

Create a `.env` file in the root of the project with the following variables:

```env
# Supabase Database
# Get the connection string from Supabase Dashboard > Settings > Database > Connection string
# Format: postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-1-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true
# IMPORTANT: Format is postgres.[PROJECT_REF]:[PASSWORD] - NOT postgres:postgres:[PASSWORD]
SUPABASE_URL="postgresql://postgres.bmnhvvnsdfpkgaumhmtp:46lkmariano12345A!@aws-1-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Supabase Project (optional, for future Supabase client usage)
SUPABASE_PROJECT_URL="https://bmnhvvnsdfpkgaumhmtp.supabase.co"
SUPABASE_API_KEY="your-supabase-api-key"

# NextAuth
NEXTAUTH_URL="http://localhost:5000"
NEXTAUTH_SECRET="your-nextauth-secret-key-here"

# Gmail Configuration
GMAIL_USER="your-email@gmail.com"
GMAIL_APP_PASSWORD="your-gmail-app-password"
# Note: App password must be 16 characters without spaces
# See GMAIL_PASSWORD_FORMAT.md for more details
```

## Instructions:

1. **SUPABASE_URL**: PostgreSQL connection string from Supabase
   - Go to Supabase Dashboard > Settings > Database
   - Copy the "Connection string" under "Connection pooling"
   - **IMPORTANT**: The format is `postgres.[PROJECT_REF]:[PASSWORD]` - NOT `postgres:postgres:[PASSWORD]`
   - If your password has special characters like `!`, you may need to URL encode them (e.g., `!` becomes `%21`)
   - Example: `postgresql://postgres.bmnhvvnsdfpkgaumhmtp:46lkmariano12345A!@aws-1-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true`
2. **SUPABASE_PROJECT_URL**: Your Supabase project URL (e.g., `https://bmnhvvnsdfpkgaumhmtp.supabase.co`)
3. **SUPABASE_API_KEY**: Your Supabase API key (anon/public key from Settings > API)
4. **NEXTAUTH_SECRET**: Generate a secret key with: `openssl rand -base64 32`
5. **GMAIL_USER**: Your Gmail email address
6. **GMAIL_APP_PASSWORD**: Gmail app password (16 characters without spaces)
   - See `GMAIL_PASSWORD_FORMAT.md` for detailed instructions
