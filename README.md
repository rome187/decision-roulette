This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Supabase account ([sign up here](https://app.supabase.com))

### Setup Steps

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set Up Supabase**
   - Create a new project at [https://app.supabase.com](https://app.supabase.com)
   - Run the database migration:
     - Go to SQL Editor in your Supabase dashboard
     - Copy and paste the contents of `supabase/migrations/001_create_profiles_table.sql`
     - Execute the migration
   - Get your API credentials:
     - Go to Settings > API in your Supabase dashboard
     - Copy your Project URL and Anon Key

3. **Configure Environment Variables**
   - Copy `.env.example` to `.env.local`:
     ```bash
     cp .env.example .env.local
     ```
   - Update `.env.local` with your Supabase credentials:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
     ```

4. **Run the Development Server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features

- Email-based authentication (sign up, sign in, sign out)
- Automatic profile creation on signup
- Protected routes with middleware
- Responsive design with Tailwind CSS

## Project Structure

- `app/` - Next.js App Router pages and components
  - `actions/` - Server actions for authentication
  - `signin/` - Sign in page
  - `signup/` - Sign up page
  - `components/` - Reusable components
- `lib/supabase/` - Supabase client utilities
- `supabase/migrations/` - Database migration files
- `middleware.ts` - Next.js middleware for auth state management

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [Supabase Documentation](https://supabase.com/docs) - learn about Supabase features.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

**Important:** Don't forget to add your environment variables in Vercel's project settings:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
