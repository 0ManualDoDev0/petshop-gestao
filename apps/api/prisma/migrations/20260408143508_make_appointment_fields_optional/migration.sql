-- DropForeignKey
ALTER TABLE "appointments" DROP CONSTRAINT "appointments_employee_id_fkey";

-- DropForeignKey
ALTER TABLE "appointments" DROP CONSTRAINT "appointments_pet_id_fkey";

-- DropForeignKey
ALTER TABLE "appointments" DROP CONSTRAINT "appointments_service_id_fkey";

-- AlterTable
ALTER TABLE "appointments" ALTER COLUMN "pet_id" DROP NOT NULL,
ALTER COLUMN "service_id" DROP NOT NULL,
ALTER COLUMN "employee_id" DROP NOT NULL,
ALTER COLUMN "scheduled_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "type" SET DEFAULT 'banho',
ALTER COLUMN "price_charged" SET DEFAULT 0;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_pet_id_fkey" FOREIGN KEY ("pet_id") REFERENCES "pets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
