-- AlterTable
ALTER TABLE "client_packages" ADD COLUMN     "is_paid" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "payment_method" "PaymentMethod";
