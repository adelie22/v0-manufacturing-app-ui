-- AlterTable
ALTER TABLE "User" ADD COLUMN     "businessName" TEXT,
ADD COLUMN     "businessNumber" TEXT,
ADD COLUMN     "businessVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "businessVerifiedAt" TIMESTAMP(3);
