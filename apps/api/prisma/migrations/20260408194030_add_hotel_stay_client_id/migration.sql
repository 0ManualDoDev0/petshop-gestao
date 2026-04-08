-- AlterTable
ALTER TABLE "hotel_stays" ADD COLUMN     "client_id" TEXT;

-- AddForeignKey
ALTER TABLE "hotel_stays" ADD CONSTRAINT "hotel_stays_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;
