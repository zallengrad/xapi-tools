const { PrismaClient } = require('../src/generated/prisma');
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findFirst();
  if (!user) {
    throw new Error('No user found to attach analysis');
  }

  const result = await prisma.$transaction(async (tx) => {
    const analysis = await tx.analysisResult.create({
      data: {
        sourceFile: 'sample.csv',
        recordCount: 10,
        generatedAt: new Date(),
        userId: user.id,
      },
    });

    await tx.overviewResult.create({
      data: {
        totalEvents: 10,
        activeUsers: 1,
        uniqueContents: 1,
        topVerb: 'test',
        dailyActivity: [],
        topVerbs: [],
        topObjects: [],
        analysisResultId: analysis.id,
      },
    });

    await tx.lsaResult.create({
      data: {
        payload: { foo: 'bar' },
        analysisResultId: analysis.id,
      },
    });

    await tx.funnelResult.create({
      data: {
        funnelSteps: [],
        avgSessionDuration: 0,
        totalSessions: 0,
        avgEventsPerSession: 0,
        sessionDurationHistogram: [],
        analysisResultId: analysis.id,
      },
    });

    return analysis;
  });

  console.log('Created analysis', result.id);
}

main()
  .catch((err) => {
    console.error(err);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
