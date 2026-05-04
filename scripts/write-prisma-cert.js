import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const certBase64 = process.env.PRISMA_CLIENT_IDENTITY_P12_BASE64;

if (!certBase64) {
  console.log("[ach-pet-api] PRISMA_CLIENT_IDENTITY_P12_BASE64 not set; skipping Prisma SSL identity file.");
  process.exit(0);
}

const certPath = resolve("prisma/certs/client-identity.p12");
mkdirSync(dirname(certPath), { recursive: true });
writeFileSync(certPath, Buffer.from(certBase64, "base64"));

console.log("[ach-pet-api] Prisma SSL identity file written.");
