/*
  Warnings:

  - Made the column `issuer` on table `Certification` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Certification" ADD COLUMN     "credentialId" TEXT,
ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "issuer" SET NOT NULL;

-- AlterTable
ALTER TABLE "Education" ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Skill" ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0;
