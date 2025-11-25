# Supabase Setup Instructions

This project uses Drizzle ORM for database schema management. Database schemas are defined in TypeScript and migrations are generated automatically.

## Setup Steps

1. **Create a Supabase Project**
   - Go to [https://app.supabase.com](https://app.supabase.com)
   - Create a new project
   - Wait for the project to finish provisioning

2. **Get Your API Keys and Database URL**
   - In your Supabase project dashboard, go to Settings > API
   - Copy the following values:
     - Project URL (this is your `NEXT_PUBLIC_SUPABASE_URL`)
     - Anon/Public Key (this is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
   - Go to Settings > Database
   - Copy the Connection String (URI) - this is your `DATABASE_URL`
     - Use the "Connection pooling" mode with "Session" transaction mode
     - Format: `postgresql://postgres:[YOUR-PASSWORD]@[HOST]:5432/postgres`

3. **Configure Environment Variables**
   - Create a `.env.local` file in the root of your project
   - Add the following:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
     DATABASE_URL=postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres
     ```

4. **Run Migrations**
   - Migrations are located in `drizzle/migrations/`
   - To apply migrations, you can either:
     - Use `npm run db:push` to push schema changes directly (development)
     - Use `npm run db:migrate` to apply migrations (production)
     - Or manually run the SQL files from `drizzle/migrations/` in Supabase SQL Editor (production)

## Database Schema

The database schema is defined in `lib/db/schema.ts` using Drizzle ORM. The current schema includes:

- `profiles` table linked to `auth.users`
- Row Level Security (RLS) policies
- Trigger functions for automatic profile creation and timestamp updates
- Username validation constraints

## Migration Management

This project includes npm scripts for managing database migrations:

- `npm run db:generate` - Generate migration files from schema changes in `lib/db/schema.ts`
- `npm run db:push` - Push schema changes directly to database (development only)
- `npm run db:migrate` - Apply migrations to database
- `npm run db:studio` - Open Drizzle Studio for database inspection
- `npm run db:check` - Check migration status
- `npm run db:drop` - Drop migrations (useful for resetting)

### Generating Migrations

When you modify the schema in `lib/db/schema.ts`, generate a new migration:

```bash
npm run db:generate
```

This will create a new migration file in `drizzle/migrations/` that you can review and apply.

## Testing

After running the migration, you can test the setup by:
1. Starting your Next.js development server: `npm run dev`
2. Navigating to `/signup` and creating a new account
3. Checking the `profiles` table in Supabase to verify a profile was automatically created

