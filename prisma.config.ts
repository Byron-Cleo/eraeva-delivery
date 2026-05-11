import "dotenv/config";
import { defineConfig } from "prisma/config";
import * as path from "node:path";

const migrateUrl = process.env.DATABASE_MIGRATE_URL ?? process.env.DATABASE_URL;

if (!migrateUrl) {
  throw new Error(
    "Missing required environment variable: DATABASE_URL or DATABASE_MIGRATE_URL",
  );
}

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  migrations: {
    path: path.join("prisma", "migrations"),
  },
  engine: "classic",
  datasource: {
    // DATABASE_MIGRATE_URL = direct (non-pooled) Neon endpoint, required by
    // Prisma's schema engine. Falls back to DATABASE_URL when a separate
    // migrate URL is not configured, which avoids config-load failures on
    // hosts like Vercel during `prisma generate`.
    url: migrateUrl,
  },
});
