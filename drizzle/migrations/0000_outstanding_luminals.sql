CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"full_name" text,
	"username" text,
	"avatar_url" text
);
--> statement-breakpoint
-- Add foreign key reference to auth.users
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;
--> statement-breakpoint
-- Enable Row Level Security
ALTER TABLE "profiles" ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
-- Create policy to allow users to read their own profile
CREATE POLICY "Users can view own profile"
  ON "profiles"
  FOR SELECT
  USING (auth.uid() = id);
--> statement-breakpoint
-- Create policy to allow users to update their own profile
CREATE POLICY "Users can update own profile"
  ON "profiles"
  FOR UPDATE
  USING (auth.uid() = id);
--> statement-breakpoint
-- Create policy to allow users to insert their own profile
CREATE POLICY "Users can insert own profile"
  ON "profiles"
  FOR INSERT
  WITH CHECK (auth.uid() = id);
--> statement-breakpoint
-- Create function to automatically create a profile when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, created_at, updated_at)
  VALUES (NEW.id, NOW(), NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
--> statement-breakpoint
-- Create trigger to call the function when a new user is created
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
--> statement-breakpoint
-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
--> statement-breakpoint
-- Create trigger to update updated_at on profile updates
CREATE TRIGGER on_profile_updated
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
--> statement-breakpoint
-- Create unique index on username (only for non-null values)
CREATE UNIQUE INDEX "profiles_username_key" ON "profiles" USING btree ("username") WHERE "username" IS NOT NULL;
--> statement-breakpoint
-- Add constraint to ensure username is lowercase and alphanumeric with underscores/hyphens
ALTER TABLE "profiles"
  ADD CONSTRAINT profiles_username_format CHECK (
    username IS NULL OR (
      username ~ '^[a-z0-9_-]+$' AND
      length(username) >= 3 AND
      length(username) <= 30
    )
  );
--> statement-breakpoint
-- Add comments to columns
COMMENT ON COLUMN "profiles"."full_name" IS 'User''s full name';
COMMENT ON COLUMN "profiles"."username" IS 'Unique username (3-30 chars, lowercase alphanumeric with underscores/hyphens)';
COMMENT ON COLUMN "profiles"."avatar_url" IS 'URL to user''s avatar image';