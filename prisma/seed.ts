import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // Limpeza (ordem por dependências)
  await prisma.followUpUpdate.deleteMany();
  await prisma.message.deleteMany();
  await prisma.chatThread.deleteMany();
  await prisma.adoption.deleteMany();
  await prisma.adoptionRequest.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.petPhoto.deleteMany();
  await prisma.pet.deleteMany();
  await prisma.shelterProfile.deleteMany();
  await prisma.adopterProfile.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("123456", 10);

  const shelter = await prisma.user.create({
    data: {
      role: "SHELTER",
      name: "Abrigo Central",
      email: "shelter@achpet.local",
      passwordHash,
      phone: "11999999999",
      shelterProfile: {
        create: {
          orgName: "ONG Abrigo Central",
          city: "São Paulo",
          state: "SP",
          address: "Rua Exemplo, 123",
        },
      },
    },
    select: { id: true, role: true, email: true, name: true },
  });

  const adopter = await prisma.user.create({
    data: {
      role: "ADOPTER",
      name: "Adotante Demo",
      email: "adopter@achpet.local",
      passwordHash,
      phone: "11988888888",
      adopterProfile: { create: {} },
    },
    select: { id: true, role: true, email: true, name: true },
  });

  const pet = await prisma.pet.create({
    data: {
      shelterId: shelter.id,
      name: "Thor",
      species: "Cachorro",
      breed: "SRD",
      sex: "M",
      ageMonths: 18,
      size: "M",
      description: "Dócil, vacinado e castrado.",
      photos: {
        create: [{ url: "/uploads/demo-photo.jpg" }],
      },
    },
    select: { id: true, name: true, species: true },
  });

  // Solicitação pendente (para testar inbox)
  const request = await prisma.adoptionRequest.create({
    data: {
      petId: pet.id,
      adopterId: adopter.id,
      shelterId: shelter.id,
      message: "Quero adotar e posso enviar atualizações semanais.",
    },
    select: { id: true, status: true },
  });

  console.log("Seed concluído:");
  console.log({ shelter, adopter, pet, request });
  console.log("Senha padrão para ambos: 123456");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
