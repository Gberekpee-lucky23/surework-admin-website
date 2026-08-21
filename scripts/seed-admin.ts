/**
 * Seed the first admin user.
 * Usage: npx tsx scripts/seed-admin.ts
 *
 * Reads EMAIL, NAME, PASSWORD from env or prompts via stdin.
 */
import { neon } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";
import * as readline from "readline";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env" });

const sql = neon(process.env.DATABASE_URL!);

function prompt(question: string): Promise<string> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function seed() {
  console.log("\n Surework Admin — Seed Admin User\n");

  const name = await prompt("Admin name: ");
  const email = await prompt("Admin email: ");
  const password = await prompt("Admin password (min 8 chars): ");

  if (!email || !password || password.length < 8) {
    console.error("Invalid input. Email and password (min 8 chars) are required.");
    process.exit(1);
  }

  // Ensure admin_users table exists
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

  const hash = await bcrypt.hash(password, 12);

  try {
    const [admin] = await sql`
      INSERT INTO "admin_users" ("email", "password_hash", "name", "role")
      VALUES (${email}, ${hash}, ${name || email}, 'admin')
      ON CONFLICT ("email") DO UPDATE SET "password_hash" = ${hash}, "name" = ${name || email}
      RETURNING "id", "email", "name"
    `;
    console.log(`\n Admin user created/updated:`);
    console.log(`   ID:    ${admin.id}`);
    console.log(`   Name:  ${admin.name}`);
    console.log(`   Email: ${admin.email}`);
    console.log(`\nYou can now log in at http://localhost:3000/login\n`);
  } catch (err) {
    console.error("Failed to seed admin:", err);
    process.exit(1);
  }
}

seed();
