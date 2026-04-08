-- DropForeignKey
ALTER TABLE "hotel_stays" DROP CONSTRAINT "hotel_stays_pet_id_fkey";

-- AlterTable
ALTER TABLE "hotel_stays" ALTER COLUMN "pet_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "hotel_stays" ADD CONSTRAINT "hotel_stays_pet_id_fkey" FOREIGN KEY ("pet_id") REFERENCES "pets"("id") ON DELETE SET NULL ON UPDATE CASCADE;
