-- AlterTable
ALTER TABLE "WorkerProfile" ADD COLUMN     "desiredCategories" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "desiredRegions" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "experienceLevel" TEXT;
