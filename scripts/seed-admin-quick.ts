/**
 * Non-interactive admin seeder.
 * Usage: NAME="Surework Admin" EMAIL="admin@surework.com" PASSWORD="Admin@1234" npx tsx scripts/seed-admin-quick.ts
 */
import { neon } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env" });

const sql = neon(process.env.DATABASE_URL!);

async function seed() {
  const name     = process.env.NAME     || "Surework Admin";
  const email    = process.env.EMAIL    || "portharcourthandyman@gmail.com";
  const password = process.env.PASSWORD || "surework@admin.ng";

  if (!email || !password || password.length < 8) {
    console.error("Invalid input. Provide NAME, EMAIL, PASSWORD env vars (password min 8 chars).");
    process.exit(1);
  }

  const hash = await bcrypt.hash(password, 12);

  try {
    const [admin] = await sql`
      INSERT INTO "admin_users" ("email", "password_hash", "name", "role")
      VALUES (${email}, ${hash}, ${name}, 'admin')
      ON CONFLICT ("email") DO UPDATE SET "password_hash" = ${hash}, "name" = ${name}
      RETURNING "id", "email", "name"
    `;
    console.log(`\n✅ Admin user created/updated:`);
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
