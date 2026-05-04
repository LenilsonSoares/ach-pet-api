import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const decodeBase64Env = (value) => {
  if (!value) return undefined;

  return Buffer.from(value, "base64").toString("utf8").trim();
};

const databaseUrl =
  process.env.DATABASE_URL ||
  process.env.ACH_PET_DB_URL ||
  decodeBase64Env(process.env.DATABASE_URL_BASE64) ||
  decodeBase64Env(process.env.ACH_PET_DB_URL_BASE64);
const certBase64 = process.env.PRISMA_CLIENT_IDENTITY_P12_BASE64;

if (databaseUrl) {
  const runtimeEnv = {
    PORT: process.env.PORT,
    HOST: process.env.HOST,
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: databaseUrl,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
    UPLOADS_DIR: process.env.UPLOADS_DIR,
    CLOUDINARY_URL: process.env.CLOUDINARY_URL,
    CLOUDINARY_FOLDER: process.env.CLOUDINARY_FOLDER,
  };

  const envLines = Object.entries(runtimeEnv)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => `${key}=${value}`);

  writeFileSync(resolve(".env"), `${envLines.join("\n")}\n`);
  console.log(`[ach-pet-api] Runtime .env file written with keys: ${Object.keys(runtimeEnv).filter((key) => runtimeEnv[key] !== undefined).join(", ")}`);
} else {
  console.log("[ach-pet-api] Database URL env not set; expected DATABASE_URL, ACH_PET_DB_URL, DATABASE_URL_BASE64, or ACH_PET_DB_URL_BASE64.");
}

if (certBase64) {
  const certPath = resolve("prisma/certs/client-identity.p12");
  mkdirSync(dirname(certPath), { recursive: true });
  writeFileSync(certPath, Buffer.from(certBase64, "base64"));

  console.log("[ach-pet-api] Prisma SSL identity file written.");
} else {
  console.log("[ach-pet-api] PRISMA_CLIENT_IDENTITY_P12_BASE64 not set; skipping Prisma SSL identity file.");
}
