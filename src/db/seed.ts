// import { PrismaClient } from '../lib/generated/prisma'
import { PrismaClient } from "@prisma/client";
import sampleData from "./sample-data";

async function main() {
  const prisma = new PrismaClient();

  // ── Wipe in reverse-FK order so constraints are never violated ────────────
  await prisma.menuMealType.deleteMany();
  await prisma.menu.deleteMany();
  await prisma.menuAccompaniment.deleteMany();
  await prisma.mealType.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.verificationToken.deleteMany();
  await prisma.user.deleteMany();

  // ── Insert in FK-safe order ───────────────────────────────────────────────
  // 1. Accompaniments first — Menu.accompanyId/vegetableId point here.
  await prisma.menuAccompaniment.createMany({
    data: sampleData.accompaniments,
  });
  console.log("Seeded accompaniments");

  // 2. MealType rows — MenuMealType.mealTypeId points here.
  await prisma.mealType.createMany({ data: sampleData.mealTypes });
  console.log("Seeded meal types");

  // 3. Menus — references accompanyId/vegetableId (already in DB above).
  await prisma.menu.createMany({ data: sampleData.menus });
  console.log("Seeded menus");

  // 4. Join table last — both productId and mealTypeId must already exist.
  await prisma.menuMealType.createMany({
    data: sampleData.menuMealTypes,
  });
  console.log("Seeded menu meal types");

  // 5. Users (no dependency on food models).
  await prisma.user.createMany({ data: sampleData.users });
  console.log("Seeded users");

  console.log("Database seeded successfully");
}

main();
