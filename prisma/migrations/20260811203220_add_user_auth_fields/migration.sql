-- AlterTable
ALTER TABLE "User" ADD COLUMN     "name" TEXT,
ADD COLUMN     "passwordHash" TEXT,
ADD COLUMN     "plan" TEXT NOT NULL DEFAULT 'STARTER',
ADD COLUMN     "regionsAllowed" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "stripeCustomerId" TEXT;
