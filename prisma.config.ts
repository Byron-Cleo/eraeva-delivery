import "dotenv/config";
import { defineConfig, env } from "prisma/config";
import * as path from "node:path";

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  migrations: {
    path: path.join("prisma", "migrations"),
  },
  engine: "classic",
  datasource: {
    // DATABASE_MIGRATE_URL = direct (non-pooled) Neon endpoint, required by
    // Prisma's schema engine. Falls back to DATABASE_URL if not set.
    url: env("DATABASE_MIGRATE_URL") ?? env("DATABASE_URL"),
  },
});
