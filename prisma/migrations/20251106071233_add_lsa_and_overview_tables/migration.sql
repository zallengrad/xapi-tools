/*
  Warnings:

  - You are about to drop the column `payload` on the `AnalysisResult` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AnalysisResult" DROP COLUMN "payload";

-- CreateTable
CREATE TABLE "LsaResult" (
    "id" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "analysisResultId" TEXT NOT NULL,

    CONSTRAINT "LsaResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OverviewResult" (
    "id" TEXT NOT NULL,
    "totalEvents" INTEGER NOT NULL,
    "activeUsers" INTEGER NOT NULL,
    "uniqueContents" INTEGER NOT NULL,
    "topVerb" TEXT NOT NULL,
    "dailyActivity" JSONB NOT NULL,
    "topVerbs" JSONB NOT NULL,
    "topObjects" JSONB NOT NULL,
    "analysisResultId" TEXT NOT NULL,

    CONSTRAINT "OverviewResult_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LsaResult_analysisResultId_key" ON "LsaResult"("analysisResultId");

-- CreateIndex
CREATE UNIQUE INDEX "OverviewResult_analysisResultId_key" ON "OverviewResult"("analysisResultId");

-- CreateIndex
CREATE INDEX "AnalysisResult_userId_idx" ON "AnalysisResult"("userId");

-- AddForeignKey
ALTER TABLE "LsaResult" ADD CONSTRAINT "LsaResult_analysisResultId_fkey" FOREIGN KEY ("analysisResultId") REFERENCES "AnalysisResult"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OverviewResult" ADD CONSTRAINT "OverviewResult_analysisResultId_fkey" FOREIGN KEY ("analysisResultId") REFERENCES "AnalysisResult"("id") ON DELETE CASCADE ON UPDATE CASCADE;
