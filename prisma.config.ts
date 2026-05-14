import "dotenv/config";
import { defineConfig } from "prisma/config";

const migrateUrl = process.env.DATABASE_MIGRATE_URL ?? process.env.DATABASE_URL;

if (!migrateUrl) {
  throw new Error(
    "Missing required environment variable: DATABASE_URL or DATABASE_MIGRATE_URL",
  );
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: migrateUrl,
  },
});
