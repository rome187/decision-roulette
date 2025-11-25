## Decision Roulette

Decision Roulette helps users break decision fatigue by randomly selecting one action from up to five options. Each spin gives a clear next step, so teams can move quickly without overthinking.

## Features

- Five-slot roulette: enter up to five candidate actions per spin.
- Action history: review previous picks and re-spin when needed.
- Supabase authentication: email sign up/in/out with automatic profile creation.
- Guardrails: login attempts with unknown emails display “Access Denied, sign up to log in.”
- Responsive UI: built with the Next.js App Router and Tailwind for a mobile-friendly experience.

## Tech Stack

- Next.js 14 App Router
- React + TypeScript
- Tailwind CSS
- Supabase (auth + database)
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
   - Run the SQL from `supabase/migrations/001_create_profiles_table.sql`.
   - Copy your Project URL and Anon Key from Settings → API.

3. **Environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Update the file:
   ```
   NEXT_PUBLIC_SUPABASE_URL=<your_project_url>
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<your_anon_key>
   ```

4. **Run the dev server**
   ```bash
   npm run dev
   ```
   Visit [http://localhost:3000](http://localhost:3000) to try the roulette.

## Usage

1. Sign up or log in.
2. Enter up to five actions you are considering.
3. Spin the wheel and follow the result.
4. If you need another option, adjust the list and spin again.

## Project Structure

- `app/` — routed pages, roulette UI, auth flows.
  - `actions/` — server actions for Supabase auth.
  - `signin/`, `signup/` — entry points for auth.
  - `components/` — reusable UI (wheel, forms, history).
- `lib/supabase/` — Supabase client helpers.
- `middleware.ts` — auth-aware routing protection.
- `supabase/` — SQL migrations and documentation.

## Deployment

Deploy on [Vercel](https://vercel.com) or any Next.js-compatible platform. Remember to add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to the platform environment settings.