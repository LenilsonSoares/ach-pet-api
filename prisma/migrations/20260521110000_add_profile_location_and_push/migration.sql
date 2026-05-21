-- Add structured address/location fields to profiles.
ALTER TABLE "AdopterProfile"
ADD COLUMN "cep" TEXT,
ADD COLUMN "street" TEXT,
ADD COLUMN "addressNumber" TEXT,
ADD COLUMN "addressComplement" TEXT,
ADD COLUMN "neighborhood" TEXT,
ADD COLUMN "city" TEXT,
ADD COLUMN "state" TEXT,
ADD COLUMN "latitude" DOUBLE PRECISION,
ADD COLUMN "longitude" DOUBLE PRECISION;

ALTER TABLE "ShelterProfile"
ADD COLUMN "cep" TEXT,
ADD COLUMN "street" TEXT,
ADD COLUMN "addressNumber" TEXT,
ADD COLUMN "addressComplement" TEXT,
ADD COLUMN "neighborhood" TEXT,
ADD COLUMN "latitude" DOUBLE PRECISION,
ADD COLUMN "longitude" DOUBLE PRECISION;

-- Push notification preferences and per-device Expo push tokens.
ALTER TABLE "User"
ADD COLUMN "pushChatEnabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "pushAdoptionEnabled" BOOLEAN NOT NULL DEFAULT true;

CREATE TABLE "PushToken" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "token" TEXT NOT NULL,
  "platform" TEXT,
  "deviceName" TEXT,
  "enabled" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "PushToken_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "PushToken_token_key" ON "PushToken"("token");
CREATE INDEX "PushToken_userId_idx" ON "PushToken"("userId");

ALTER TABLE "PushToken"
ADD CONSTRAINT "PushToken_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
