-- CreateTable
CREATE TABLE "FunnelResult" (
    "id" TEXT NOT NULL,
    "funnelSteps" JSONB NOT NULL,
    "avgSessionDuration" DOUBLE PRECISION NOT NULL,
    "totalSessions" INTEGER NOT NULL,
    "avgEventsPerSession" DOUBLE PRECISION NOT NULL,
    "sessionDurationHistogram" JSONB NOT NULL,
    "analysisResultId" TEXT NOT NULL,

    CONSTRAINT "FunnelResult_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FunnelResult_analysisResultId_key" ON "FunnelResult"("analysisResultId");

-- AddForeignKey
ALTER TABLE "FunnelResult" ADD CONSTRAINT "FunnelResult_analysisResultId_fkey" FOREIGN KEY ("analysisResultId") REFERENCES "AnalysisResult"("id") ON DELETE CASCADE ON UPDATE CASCADE;
