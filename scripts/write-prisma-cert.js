import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const decodeBase64Env = (value) => {
  if (!value) return undefined;

  return Buffer.from(value, "base64").toString("utf8").trim();
};

const firstValue = (...values) => values.find((value) => value && String(value).trim());

const isSupabaseUrl = (value) => {
  if (!value) return false;

  try {
    const url = new URL(value);
    return url.hostname.endsWith(".supabase.com") || url.hostname.includes(".pooler.supabase.com");
  } catch {
    return value.includes("supabase.com");
  }
};

const describeDatabaseUrl = (value) => {
  if (!value) return "not set";

  try {
    const url = new URL(value);
    return `${url.protocol}//${url.hostname}${url.port ? `:${url.port}` : ""}${url.pathname}`;
  } catch {
    return "unparseable database URL";
  }
};

const formatEnvValue = (value) => {
  const escaped = String(value)
    .replace(/\\/g, "\\\\")
    .replace(/\r?\n/g, "\\n")
    .replace(/"/g, '\\"');

  return `"${escaped}"`;
};

const decodedDatabaseUrl = decodeBase64Env(process.env.DATABASE_URL_BASE64);
const decodedAchPetDbUrl = decodeBase64Env(process.env.ACH_PET_DB_URL_BASE64);
const decodedDirectUrl = decodeBase64Env(process.env.DIRECT_URL_BASE64);

const databaseCandidates = [
  process.env.SUPABASE_DATABASE_URL,
  process.env.SUPABASE_DB_URL,
  process.env.DIRECT_URL,
  process.env.SUPABASE_DIRECT_URL,
  process.env.DATABASE_URL ||
    process.env.ACH_PET_DB_URL ||
    decodedDatabaseUrl ||
    decodedAchPetDbUrl,
  process.env.ACH_PET_DB_URL,
  decodedDatabaseUrl,
  decodedAchPetDbUrl,
  decodedDirectUrl,
].filter(Boolean);

const supabaseDatabaseUrl = databaseCandidates.find(isSupabaseUrl);
const databaseUrl = supabaseDatabaseUrl || firstValue(...databaseCandidates);
const directUrl =
  firstValue(
    process.env.DIRECT_URL,
    process.env.SUPABASE_DIRECT_URL,
    decodedDirectUrl,
    isSupabaseUrl(databaseUrl) ? databaseUrl : undefined,
  );
const certBase64 = process.env.PRISMA_CLIENT_IDENTITY_P12_BASE64;

if (databaseUrl) {
  const runtimeEnv = {
    PORT: process.env.PORT,
    HOST: process.env.HOST,
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: databaseUrl,
    DIRECT_URL: directUrl,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
    UPLOADS_DIR: process.env.UPLOADS_DIR,
    CLOUDINARY_URL: process.env.CLOUDINARY_URL,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
    CLOUDINARY_FOLDER: process.env.CLOUDINARY_FOLDER,
  };

  const envLines = Object.entries(runtimeEnv)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => `${key}=${formatEnvValue(value)}`);

  writeFileSync(resolve(".env"), `${envLines.join("\n")}\n`);
  console.log(`[ach-pet-api] Runtime .env file written with keys: ${Object.keys(runtimeEnv).filter((key) => runtimeEnv[key] !== undefined).join(", ")}`);
  console.log(`[ach-pet-api] Runtime database target: ${describeDatabaseUrl(databaseUrl)}`);
} else {
  console.log("[ach-pet-api] Database URL env not set; expected DATABASE_URL, SUPABASE_DATABASE_URL, DIRECT_URL, ACH_PET_DB_URL, or *_BASE64 variants.");
}

if (certBase64 && !isSupabaseUrl(databaseUrl)) {
  const certPath = resolve("prisma/certs/client-identity.p12");
  mkdirSync(dirname(certPath), { recursive: true });
  writeFileSync(certPath, Buffer.from(certBase64, "base64"));

  console.log("[ach-pet-api] Prisma SSL identity file written.");
} else if (certBase64) {
  console.log("[ach-pet-api] Supabase database selected; skipping Prisma SSL identity .p12 file.");
} else {
  console.log("[ach-pet-api] PRISMA_CLIENT_IDENTITY_P12_BASE64 not set; skipping Prisma SSL identity file.");
}
