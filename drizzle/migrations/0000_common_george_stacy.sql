CREATE TABLE IF NOT EXISTS "profiles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"full_name" text,
	"username" text,
	"avatar_url" text
);
--> statement-breakpoint
-- Add missing columns to existing tables
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "created_at" timestamp with time zone DEFAULT now() NOT NULL;
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "updated_at" timestamp with time zone DEFAULT now() NOT NULL;
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "full_name" text;
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "username" text;
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "avatar_url" text;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "profiles_username_key" ON "profiles" USING btree ("username");