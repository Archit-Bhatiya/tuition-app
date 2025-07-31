/*
  Warnings:

  - You are about to drop the column `batchId` on the `Student` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_batchId_fkey";

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "batchId";

-- CreateTable
CREATE TABLE "StudentBatch" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "batchId" INTEGER NOT NULL,

    CONSTRAINT "StudentBatch_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "StudentBatch" ADD CONSTRAINT "StudentBatch_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentBatch" ADD CONSTRAINT "StudentBatch_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "Batch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
