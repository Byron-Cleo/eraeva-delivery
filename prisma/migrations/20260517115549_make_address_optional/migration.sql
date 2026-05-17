-- AlterTable
ALTER TABLE "User" ALTER COLUMN "address" DROP NOT NULL;

-- RenameForeignKey
ALTER TABLE "MenuMealType" RENAME CONSTRAINT "MenuMealType_productId_fkey" TO "MenuMealType_menuId_fkey";

-- RenameForeignKey
ALTER TABLE "OrderItem" RENAME CONSTRAINT "OrderItem_productId_fkey" TO "OrderItem_menuId_fkey";

-- RenameForeignKey
ALTER TABLE "Review" RENAME CONSTRAINT "Review_productId_fkey" TO "Review_menuId_fkey";
