/**
 * Additive-only migrations for the shared Neon Postgres database.
 * Safe to run multiple times — all statements use IF NOT EXISTS / IF EXISTS guards.
 * Run once: npx tsx src/db/migrate.ts
 */
import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env" });

const sql = neon(process.env.DATABASE_URL!);

async function migrate() {
  console.log("🚀 Running Surework Admin additive migrations...");

  try {
    // 1. categories.description & group
    await sql`
      DO $$ BEGIN
        CREATE TYPE "category_group" AS ENUM ('inspection_required', 'fixed_price');
      EXCEPTION WHEN duplicate_object THEN null;
      END $$;
    `;
    await sql`ALTER TABLE "categories" ADD COLUMN IF NOT EXISTS "description" text;`;
    await sql`ALTER TABLE "categories" ADD COLUMN IF NOT EXISTS "group" "category_group" DEFAULT 'inspection_required';`;
    console.log("  ✓ categories.description & group");

    // 2. reviews.deleted_at + deleted_by (soft-delete)
    await sql`ALTER TABLE "reviews" ADD COLUMN IF NOT EXISTS "deleted_at" timestamp;`;
    await sql`ALTER TABLE "reviews" ADD COLUMN IF NOT EXISTS "deleted_by" integer;`;
    console.log("  ✓ reviews.deleted_at, reviews.deleted_by");

    // 3. jobs status transition timestamps
    await sql`ALTER TABLE "jobs" ADD COLUMN IF NOT EXISTS "accepted_at" timestamp;`;
    await sql`ALTER TABLE "jobs" ADD COLUMN IF NOT EXISTS "on_the_way_at" timestamp;`;
    await sql`ALTER TABLE "jobs" ADD COLUMN IF NOT EXISTS "started_at" timestamp;`;
    await sql`ALTER TABLE "jobs" ADD COLUMN IF NOT EXISTS "completed_at" timestamp;`;
    await sql`ALTER TABLE "jobs" ADD COLUMN IF NOT EXISTS "cancelled_at" timestamp;`;
    await sql`ALTER TABLE "jobs" ADD COLUMN IF NOT EXISTS "admin_note" text;`;
    console.log("  ✓ jobs status timestamps + admin_note");

    // 4. admin_users table
    await sql`
      CREATE TABLE IF NOT EXISTS "admin_users" (
        "id" serial PRIMARY KEY NOT NULL,
        "email" varchar(255) NOT NULL UNIQUE,
        "password_hash" text NOT NULL,
        "name" varchar(255) NOT NULL,
        "role" varchar(50) NOT NULL DEFAULT 'admin',
        "created_at" timestamp DEFAULT now() NOT NULL
      );
    `;
    console.log("  ✓ admin_users");

    // 5. audit_logs table
    await sql`
      CREATE TABLE IF NOT EXISTS "audit_logs" (
        "id" serial PRIMARY KEY NOT NULL,
        "admin_id" integer NOT NULL REFERENCES "admin_users"("id"),
        "action" varchar(100) NOT NULL,
        "target_type" varchar(50) NOT NULL,
        "target_id" integer,
        "metadata" jsonb,
        "created_at" timestamp DEFAULT now() NOT NULL
      );
    `;
    console.log("  ✓ audit_logs");

    // 6. legal_documents
    await sql`
      CREATE TABLE IF NOT EXISTS "legal_documents" (
        "id" serial PRIMARY KEY NOT NULL,
        "document_type" varchar(50) NOT NULL,
        "title" varchar(255) NOT NULL,
        "version" integer NOT NULL,
        "content" text NOT NULL,
        "changelog" text,
        "status" varchar(20) DEFAULT 'draft' NOT NULL,
        "published_at" timestamp,
        "published_by" integer REFERENCES "admin_users"("id"),
        "created_by" integer REFERENCES "admin_users"("id"),
        "created_at" timestamp DEFAULT now() NOT NULL,
        "updated_at" timestamp DEFAULT now() NOT NULL,
        CONSTRAINT "legal_documents_type_version_unique" UNIQUE("document_type", "version")
      );
    `;
    console.log("  ✓ legal_documents");

    // 7. user_terms_acceptances
    await sql`
      CREATE TABLE IF NOT EXISTS "user_terms_acceptances" (
        "id" serial PRIMARY KEY NOT NULL,
        "user_id" integer NOT NULL REFERENCES "users"("id"),
        "document_type" varchar(50) NOT NULL,
        "version" integer NOT NULL,
        "accepted_at" timestamp DEFAULT now() NOT NULL,
        "ip_address" varchar(45),
        "user_agent" text,
        CONSTRAINT "user_terms_acceptances_user_type_ver_unique" UNIQUE("user_id", "document_type", "version")
      );
    `;
    console.log("  ✓ user_terms_acceptances");

    // 8. email_jobs
    await sql`
      CREATE TABLE IF NOT EXISTS "email_jobs" (
        "id" serial PRIMARY KEY NOT NULL,
        "job_type" varchar(50) NOT NULL,
        "payload" jsonb NOT NULL,
        "status" varchar(20) DEFAULT 'pending' NOT NULL,
        "attempts" integer DEFAULT 0 NOT NULL,
        "max_attempts" integer DEFAULT 3 NOT NULL,
        "error_message" text,
        "processed_at" timestamp,
        "created_at" timestamp DEFAULT now() NOT NULL,
        "updated_at" timestamp DEFAULT now() NOT NULL
      );
    `;
    console.log("  ✓ email_jobs");

    console.log("\n✅ All migrations applied successfully!");
  } catch (err) {
    console.error("❌ Migration failed:", err);
    process.exit(1);
  }
}

migrate();
