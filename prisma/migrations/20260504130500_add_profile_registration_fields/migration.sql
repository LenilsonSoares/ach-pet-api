ALTER TABLE "ShelterProfile"
ADD COLUMN "cnpj" TEXT,
ADD COLUMN "responsible" TEXT,
ADD COLUMN "site" TEXT;

ALTER TABLE "AdopterProfile"
ADD COLUMN "cpf" TEXT,
ADD COLUMN "birthDate" TEXT,
ADD COLUMN "address" TEXT;
