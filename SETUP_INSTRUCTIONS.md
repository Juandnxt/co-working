# Setup Instructions - CoWorking Application

## ✅ Implemented Features

1. **2FA Authentication with Gmail**
   - Registration with email verification code
   - Login with 2FA code
   - Welcome email on registration

2. **Supabase Database**
   - Everything is saved in Supabase (PostgreSQL) - nothing in localStorage
   - Models: User, Session, VerificationCode, PaymentMethod, Booking

3. **Stripe Payment Methods**
   - Add credit cards
   - Manage saved payment methods
   - Complete Stripe integration

4. **Booking System**
   - Users can book workspaces
   - Automatic email confirmations
   - Owner notifications

5. **Navigation**
   - Header with Login/Register options
   - User menu when authenticated
   - Profile and payment method pages

## 🚀 Setup Steps

### 1. Configure Environment Variables

Create a `.env` file in the project root:

```env
# Supabase Database
# Get the connection string from Supabase Dashboard > Settings > Database > Connection string
SUPABASE_URL="postgresql://postgres.bmnhvvnsdfpkgaumhmtp:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres"

# Supabase Project
SUPABASE_PROJECT_URL="https://bmnhvvnsdfpkgaumhmtp.supabase.co"
SUPABASE_API_KEY="your-supabase-api-key"

# Gmail Configuration
GMAIL_USER="your-email@gmail.com"
GMAIL_APP_PASSWORD="your-app-password"

# Stripe
STRIPE_SECRET_KEY="sk_test_your_secret_key"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_your_public_key"
```

**To get GMAIL_APP_PASSWORD:**
1. Go to your Google account
2. Security → 2-Step Verification
3. App passwords
4. Generate a new one for "Mail"

### 2. Configure Supabase Database

1. Get your Supabase connection string:
   - Go to your Supabase Dashboard: https://supabase.com/dashboard
   - Select your project
   - Go to Settings > Database
   - Under "Connection string", select "Connection pooling" mode
   - Copy the connection string (it should look like: `postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres`)
   - Replace `[YOUR-PASSWORD]` with your database password
   - Replace `[REGION]` with your Supabase region

2. Update the `SUPABASE_URL` in `.env` with the connection string

3. Get your Supabase API key:
   - In Supabase Dashboard, go to Settings > API
   - Copy the "anon" or "public" key
   - Add it to `SUPABASE_API_KEY` in `.env`

4. Run migrations to create tables:
```bash
npm run db:push
```

Or create a migration:
```bash
npm run db:migrate
```

### 3. Generate Prisma Client

```bash
npm run db:generate
```

### 4. Start the Server

```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## 📁 Project Structure

```
app/
├── api/
│   ├── auth/
│   │   ├── [...nextauth]/route.ts  # NextAuth config
│   │   ├── login/route.ts          # Login endpoint
│   │   ├── register/route.ts       # Register endpoint
│   │   └── verify/route.ts         # Verify code endpoint
│   ├── booking/
│   │   └── route.ts                # Booking endpoint
│   └── payment/
│       ├── create-customer/route.ts
│       ├── setup-intent/route.ts
│       └── methods/route.ts
├── components/
│   ├── Header.tsx
│   ├── Hero.tsx
│   ├── Services.tsx
│   ├── Spaces.tsx
│   ├── Booking.tsx
│   └── Footer.tsx
├── login/page.tsx
├── register/page.tsx
├── payment/page.tsx
├── profile/page.tsx
└── page.tsx

lib/
├── prisma.ts      # Prisma client
├── auth.ts        # Auth helpers
├── email.ts       # Email sending
└── stripe.ts      # Stripe client

prisma/
└── schema.prisma  # Database schema
```

## 🔐 Authentication Flow

1. **Registration:**
   - User completes form
   - User is created in DB (hashed password)
   - Verification code is sent via email
   - User enters code
   - Email is verified and welcome email is sent

2. **Login:**
   - User enters email and password
   - Credentials are validated
   - 2FA code is sent via email
   - User enters code
   - Session is created with NextAuth

## 💳 Payment Flow

1. User goes to `/payment`
2. Click "Add Payment Method"
3. Setup Intent is created in Stripe
4. User completes card form
5. Payment method is saved in Stripe and DB

## 📝 Important Notes

- **Everything is saved in Supabase (PostgreSQL)** - No localStorage is used
- Verification codes expire in 10 minutes
- Codes can only be used once
- Passwords are hashed with bcrypt
- Sessions are managed with NextAuth (JWT)

## 🛠️ Useful Commands

```bash
# Development
npm run dev

# Generate Prisma Client
npm run db:generate

# Sync schema with DB
npm run db:push

# Create migration
npm run db:migrate

# Open Prisma Studio (DB GUI)
npm run db:studio
```
