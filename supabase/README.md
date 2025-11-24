# Supabase Setup Instructions

This directory contains SQL migrations for setting up the Supabase database schema.

## Setup Steps

1. **Create a Supabase Project**
   - Go to [https://app.supabase.com](https://app.supabase.com)
   - Create a new project
   - Wait for the project to finish provisioning

2. **Run the Migration**
   - Go to your Supabase project dashboard
   - Navigate to the SQL Editor
   - Copy and paste the contents of `migrations/001_create_profiles_table.sql`
   - Click "Run" to execute the migration

3. **Get Your API Keys**
   - In your Supabase project dashboard, go to Settings > API
   - Copy the following values:
     - Project URL (this is your `NEXT_PUBLIC_SUPABASE_URL`)
     - Anon/Public Key (this is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`)

4. **Configure Environment Variables**
   - Create a `.env.local` file in the root of your project
   - Add the following:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
     ```

## What the Migration Does

- Creates a `profiles` table linked to `auth.users`
- Sets up Row Level Security (RLS) policies
- Creates a trigger function to automatically create a profile when a user signs up
- Creates a trigger to update the `updated_at` timestamp automatically

## Testing

After running the migration, you can test the setup by:
1. Starting your Next.js development server: `npm run dev`
2. Navigating to `/signup` and creating a new account
3. Checking the `profiles` table in Supabase to verify a profile was automatically created

