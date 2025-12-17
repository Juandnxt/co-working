# CoWorking Space

A modern coworking space management application built with Next.js, featuring user authentication, booking system, and email notifications.

## Features

- **User Authentication**: 2FA login system with email verification codes
- **Booking System**: Users can book workspaces with automatic email confirmations
- **Email Notifications**: 
  - Verification codes for registration and login
  - Booking confirmations to users
  - Booking notifications to the owner
- **Payment Integration**: Stripe integration for payment methods
- **Modern UI**: Beautiful, responsive design with Tailwind CSS

## Tech Stack

- **Framework**: Next.js 16
- **Database**: Supabase (PostgreSQL) with direct SQL queries
- **Authentication**: NextAuth.js with custom 2FA
- **Email**: Nodemailer with Gmail
- **Payments**: Stripe
- **Styling**: Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+ 
- Supabase account and project
- Gmail account with App Password
- Stripe account (for payments)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/alvarodiamondnxt/co-working.git
cd co-working
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory:

```env
# Supabase Database
# Get from Supabase Dashboard > Settings > Database > Connection string (Connection pooling mode)
SUPABASE_URL="postgresql://postgres.bmnhvvnsdfpkgaumhmtp:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres"

# Supabase Project
SUPABASE_PROJECT_URL="https://bmnhvvnsdfpkgaumhmtp.supabase.co"
SUPABASE_API_KEY="your-supabase-api-key"

# NextAuth
NEXTAUTH_URL="http://localhost:5000"
NEXTAUTH_SECRET="your-nextauth-secret-key-here"

# Gmail Configuration
GMAIL_USER="your-email@gmail.com"
GMAIL_APP_PASSWORD="your-gmail-app-password"

# Stripe (optional, for payments)
STRIPE_SECRET_KEY="sk_test_your_secret_key"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_your_publishable_key"
```

4. Get your Supabase connection string:
   - Go to your Supabase Dashboard: https://supabase.com/dashboard
   - Select your project
   - Go to Settings > Database
   - Under "Connection string", select "Connection pooling" mode
   - Copy the connection string and replace `[YOUR-PASSWORD]` with your database password
   - Replace `[REGION]` with your Supabase region (e.g., `us-east-1`)
   - Add it to `SUPABASE_URL` in `.env`
   - Get your API key from Settings > API (anon/public key) and add to `SUPABASE_API_KEY`

5. Generate NextAuth secret:
```bash
openssl rand -base64 32
```

6. Set up the database:
```bash
npm run db:generate
npm run db:push
```

7. Run the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Documentation

- [Supabase Connection Guide](./SUPABASE_CONNECTION_GUIDE.md) - **START HERE** - Step-by-step connection guide
- [Supabase Setup](./SUPABASE_SETUP.md) - Complete Supabase configuration guide
- [Environment Setup](./ENV_SETUP.md) - Detailed environment variable configuration
- [Email Setup](./EMAIL_SETUP.md) - Email system configuration and troubleshooting
- [Gmail App Password](./GMAIL_PASSWORD_FORMAT.md) - How to get and format Gmail app passwords
- [Setup Instructions](./SETUP_INSTRUCTIONS.md) - Complete setup guide

## Project Structure

```
app/
├── api/
│   ├── auth/          # Authentication endpoints
│   ├── booking/       # Booking endpoints
│   └── payment/       # Payment endpoints
├── components/        # React components
├── login/            # Login page
├── register/         # Registration page
├── profile/          # User profile page
└── page.tsx          # Home page

lib/
├── auth.ts           # Authentication helpers
├── email.ts          # Email sending functions
├── prisma.ts         # Prisma client
└── session.ts        # Session management

prisma/
└── schema.prisma     # Database schema
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Booking System

When a user submits a booking:
1. User receives a confirmation email with booking details
2. Owner receives a notification email at `alvarodct23@gmail.com` with all booking information

## License

MIT
