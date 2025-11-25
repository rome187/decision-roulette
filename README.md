## Decision Roulette

Decision Roulette helps users break decision fatigue by randomly selecting one action from up to five options. Each spin gives a clear next step, so teams can move quickly without overthinking.

## Features

- Five-slot roulette: enter up to five candidate actions per spin.
- Action history: review previous picks and re-spin when needed.
- Supabase authentication: email sign up/in/out with automatic profile creation.
- Enhanced auth flow: comprehensive error handling, field validation, and user-friendly error messages.
- Profile management: users can update their full name, username, and avatar URL.
- Protected routes: automatic redirect to sign-in page for unauthenticated users accessing private pages.
- Responsive UI: built with the Next.js App Router and Tailwind for a mobile-friendly experience.

## Tech Stack

- Next.js 14 App Router
- React + TypeScript
- Tailwind CSS
- Supabase (auth + database)
- Drizzle ORM (database schema management)
- PNPM/NPM scripts

## Getting Started

### Prerequisites

- Node.js 18+
- PNPM or NPM
- Supabase account

### Setup

1. **Install dependencies**
   ```bash
   npm install
   ```
   or
   ```bash
   pnpm install
   ```

2. **Provision Supabase**
   - Create a new project at [Supabase](https://app.supabase.com).
   - Copy your Project URL and Anon Key from Settings → API.
   - Get your Database URL from Settings → Database (Connection String, URI format).
   - Run the Drizzle migrations from `drizzle/migrations/` in the Supabase SQL Editor, or use `npx drizzle-kit push` for development.

3. **Environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Update the file:
   ```
   NEXT_PUBLIC_SUPABASE_URL=<your_project_url>
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<your_anon_key>
   DATABASE_URL=postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres
   ```

4. **Run the dev server**
   ```bash
   npm run dev
   ```
   Visit [http://localhost:3000](http://localhost:3000) to try the roulette.

## Usage

1. Sign up or log in with your email address.
2. Complete your profile by visiting the Profile page (accessible from the home page).
3. Enter up to five actions you are considering.
4. Spin the wheel and follow the result.
5. If you need another option, adjust the list and spin again.

### Authentication Flow

- **Sign Up**: Create an account with email and password (minimum 8 characters). You'll receive a confirmation email.
- **Sign In**: Log in with your credentials. Invalid credentials show helpful error messages.
- **Profile Management**: Update your full name, username, and avatar URL from the Profile page.
- **Protected Routes**: Accessing private pages while logged out automatically redirects to the sign-in page, preserving your intended destination.

## Project Structure

- `app/` — routed pages, roulette UI, auth flows.
  - `actions/` — server actions for Supabase auth and profile management.
  - `signin/`, `signup/` — entry points for auth with enhanced error handling.
  - `profile/` — profile management page.
  - `components/` — reusable UI (wheel, forms, history).
- `lib/supabase/` — Supabase client helpers and middleware.
- `lib/db/` — Drizzle ORM schema definitions and database connection.
- `drizzle/` — Generated database migrations.
- `middleware.ts` — auth-aware routing protection with redirect preservation.
- `supabase/` — Supabase setup documentation.

## Deployment

Deploy on [Vercel](https://vercel.com) or any Next.js-compatible platform. Remember to add the following environment variables to the platform environment settings:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `DATABASE_URL`