-- CreateTable
CREATE TABLE "Unsold" (
    "id" TEXT NOT NULL,
    "pcName" VARCHAR(255) NOT NULL,
    "brand" VARCHAR(255) NOT NULL,
    "price" VARCHAR(255) NOT NULL,
    "specifications" VARCHAR(255) NOT NULL,
    "imagePath" VARCHAR(255) NOT NULL,
    "type" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Unsold_pkey" PRIMARY KEY ("id")
);
