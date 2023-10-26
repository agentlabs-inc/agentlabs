-- AlterTable
ALTER TABLE "ChatMessage" ADD COLUMN     "metadata" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'TEXT';
