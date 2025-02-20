-- CreateTable
CREATE TABLE "Product" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "vendorCode" TEXT NOT NULL,
    "picture" TEXT,
    "price" INTEGER NOT NULL,
    "sale" INTEGER
);
