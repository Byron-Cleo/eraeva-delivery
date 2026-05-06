// import { PrismaClient } from '../lib/generated/prisma'
import { PrismaClient } from "@prisma/client";
import sampleData from "./sample-data";

async function main() {
  const prisma = new PrismaClient();

  // ── Wipe in reverse-FK order so constraints are never violated ────────────
  await prisma.productMealType.deleteMany();
  await prisma.product.deleteMany();
  await prisma.productAccompaniment.deleteMany();
  await prisma.mealType.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.verificationToken.deleteMany();
  await prisma.user.deleteMany();

  // ── Insert in FK-safe order ───────────────────────────────────────────────
  // 1. Accompaniments first — Product.accompanyId/vegetableId point here.
  await prisma.productAccompaniment.createMany({
    data: sampleData.accompaniments,
  });
  console.log("Seeded accompaniments");

  // 2. MealType rows — ProductMealType.mealTypeId points here.
  await prisma.mealType.createMany({ data: sampleData.mealTypes });
  console.log("Seeded meal types");

  // 3. Products — references accompanyId/vegetableId (already in DB above).
  await prisma.product.createMany({ data: sampleData.products });
  console.log("Seeded products");

  // 4. Join table last — both productId and mealTypeId must already exist.
  await prisma.productMealType.createMany({
    data: sampleData.productMealTypes,
  });
  console.log("Seeded product meal types");

  // 5. Users (no dependency on food models).
  await prisma.user.createMany({ data: sampleData.users });
  console.log("Seeded users");

  console.log("Database seeded successfully");
}

main();
