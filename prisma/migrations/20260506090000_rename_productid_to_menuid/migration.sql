-- Rename productId → menuId in OrderItem
ALTER TABLE "OrderItem" RENAME COLUMN "productId" TO "menuId";

-- Rename the primary key constraint on OrderItem
ALTER TABLE "OrderItem" RENAME CONSTRAINT "orderitems_orderIdproductId_pk" TO "orderitems_orderIdmenuId_pk";

-- Rename productId → menuId in MenuMealType
ALTER TABLE "MenuMealType" RENAME COLUMN "productId" TO "menuId";

-- Rename productId → menuId in Review
ALTER TABLE "Review" RENAME COLUMN "productId" TO "menuId";
