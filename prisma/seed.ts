import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const [users, pets, requests] = await Promise.all([
    prisma.user.count(),
    prisma.pet.count(),
    prisma.adoptionRequest.count(),
  ]);

  console.log("Seed de demonstração desativado para preservar dados reais.");
  console.log({ users, pets, requests });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
