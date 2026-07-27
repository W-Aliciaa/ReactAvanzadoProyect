-- CreateTable
CREATE TABLE "ProjectStat" (
    "id" SERIAL NOT NULL,
    "closedIssues" INTEGER NOT NULL DEFAULT 0,
    "openIssues" INTEGER NOT NULL DEFAULT 0,
    "totalIssues" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProjectStat_pkey" PRIMARY KEY ("id")
);
