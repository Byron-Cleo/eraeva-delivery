-- CreateEnum
CREATE TYPE "MealPeriod" AS ENUM ('BREAKFAST', 'LUNCH', 'DINNER', 'DESSERT', 'BEVERAGE');

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "accompanyId" UUID,
ADD COLUMN     "vegetableId" UUID;

-- CreateTable
CREATE TABLE "MealType" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" "MealPeriod" NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "MealType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductMealType" (
    "productId" UUID NOT NULL,
    "mealTypeId" UUID NOT NULL,

    CONSTRAINT "ProductMealType_pkey" PRIMARY KEY ("productId","mealTypeId")
);

-- CreateTable
CREATE TABLE "ProductAccompaniment" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT,
    "price" DECIMAL(12,2),
    "image" TEXT,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductAccompaniment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MealType_name_key" ON "MealType"("name");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_accompanyId_fkey" FOREIGN KEY ("accompanyId") REFERENCES "ProductAccompaniment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_vegetableId_fkey" FOREIGN KEY ("vegetableId") REFERENCES "ProductAccompaniment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductMealType" ADD CONSTRAINT "ProductMealType_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductMealType" ADD CONSTRAINT "ProductMealType_mealTypeId_fkey" FOREIGN KEY ("mealTypeId") REFERENCES "MealType"("id") ON DELETE CASCADE ON UPDATE CASCADE;
