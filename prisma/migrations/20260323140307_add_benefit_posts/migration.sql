-- CreateTable
CREATE TABLE "BenefitPost" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "summary" TEXT,
    "source" TEXT,
    "sourceUrl" TEXT,
    "imageUrl" TEXT,
    "category" TEXT NOT NULL DEFAULT '지원금',
    "authorId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BenefitPost_pkey" PRIMARY KEY ("id")
);
