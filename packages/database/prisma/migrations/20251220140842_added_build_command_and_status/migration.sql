/*
  Warnings:

  - Added the required column `command` to the `BuildJob` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Command" AS ENUM ('WINTERFELL_BUILD', 'WINTERFELL_TEST', 'WINTERFELL_DEPLOY_DEVNET', 'WINTERFELL_DEPLOY_MAINNET', 'WINTERFELL_VERIFY');

-- AlterTable
ALTER TABLE "BuildJob" ADD COLUMN     "command" "Command" NOT NULL;

-- AlterTable
ALTER TABLE "Contract" ADD COLUMN     "lastBuildStatus" "BuildStatus" DEFAULT 'NEVER_BUILT',
ALTER COLUMN "lastBuildId" DROP NOT NULL;
