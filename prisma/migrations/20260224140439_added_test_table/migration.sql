-- CreateTable
CREATE TABLE "TestTable" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,

    CONSTRAINT "TestTable_pkey" PRIMARY KEY ("id")
);
