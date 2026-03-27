import "dotenv/config";
import { defineConfig, env } from "prisma/config";
import * as path from "node:path";

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  migrations: {
    path: path.join("prisma", "migrations"),
    seed: "tsx db/seed.ts",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
