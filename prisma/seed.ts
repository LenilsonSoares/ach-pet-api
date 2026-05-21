import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import fs from "node:fs/promises";
import path from "node:path";

const prisma = new PrismaClient();

const assetMap = {
  Max: "Max.png",
  Luna: "Luna.png",
  Thor: "Thor.png",
  Whiskers: "Whiskers.png",
  Mimi: "Mimi.png",
  Bob: "Bob.png",
  defaultPet: "default-pet.png",
};

const demoPhotoMap = {
  Thor: "/uploads/pets-demo-v2/thor.jpg",
  Max: "/uploads/pets-demo-v2/max.jpg",
  Luna: "/uploads/pets-demo-v2/luna.jpg",
  Mel: "/uploads/pets-demo-v2/mel.jpg",
  Sol: "/uploads/pets-demo-v2/sol.jpg",
  Bolt: "/uploads/pets-demo-v2/bolt.jpg",
  Nina: "/uploads/pets-demo-v2/nina.jpg",
  Mimi: "/uploads/pets-demo-v2/mimi.jpg",
  Whiskers: "/uploads/pets-demo-v2/whiskers.jpg",
  Oliver: "/uploads/pets-demo-v2/oliver.jpg",
  Bob: "/uploads/pets-demo-v2/bob.jpg",
  Pipoca: "/uploads/pets-demo-v2/pipoca.jpg",
};

async function prepareDemoImages() {
  const uploadsDir = path.resolve(process.cwd(), "uploads");
  const assetsDir = path.resolve(process.cwd(), "frontend", "src", "assets");

  await fs.mkdir(uploadsDir, { recursive: true });

  for (const filename of Object.values(assetMap)) {
    await fs.copyFile(path.join(assetsDir, filename), path.join(uploadsDir, filename));
  }
}

async function main() {
  await prepareDemoImages();

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

  const shelterCentral = await prisma.user.create({
    data: {
      role: "SHELTER",
      name: "Abrigo Central",
      email: "shelter@achpet.local",
      passwordHash,
      phone: "77999990001",
      shelterProfile: {
        create: {
          orgName: "ONG Abrigo Central",
          cnpj: "19131243000197",
          responsible: "Maria Oliveira",
          city: "Vitoria da Conquista",
          state: "BA",
          address: "Rua das Flores, 123 - Centro",
          site: "@ongabrigocentral",
        },
      },
    },
    select: { id: true, role: true, email: true, name: true },
  });

  const shelterAmigos = await prisma.user.create({
    data: {
      role: "SHELTER",
      name: "Amigos Peludos",
      email: "amigos@achpet.local",
      passwordHash,
      phone: "77999991234",
      shelterProfile: {
        create: {
          orgName: "Abrigo Amigos Peludos",
          cnpj: "20863197000122",
          responsible: "Carlos Santos",
          city: "Vitoria da Conquista",
          state: "BA",
          address: "Av. Brasil, 456 - Bairro Brasil",
          site: "@amigospeludos",
        },
      },
    },
    select: { id: true, role: true, email: true, name: true },
  });

  const shelterGatos = await prisma.user.create({
    data: {
      role: "SHELTER",
      name: "Gatos Felizes",
      email: "gatos@achpet.local",
      passwordHash,
      phone: "77999995678",
      shelterProfile: {
        create: {
          orgName: "Abrigo Gatos Felizes",
          cnpj: "33253418000110",
          responsible: "Ana Pereira",
          city: "Vitoria da Conquista",
          state: "BA",
          address: "Rua do Recreio, 789 - Recreio",
          site: "@gatosfelizes",
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
      phone: "77988887777",
      adopterProfile: {
        create: {
          cpf: "52998224725",
          birthDate: "10/05/1990",
          address: "Rua A, 123 - Centro, Vitoria da Conquista - BA",
        },
      },
    },
    select: { id: true, role: true, email: true, name: true },
  });

  const adopterAna = await prisma.user.create({
    data: {
      role: "ADOPTER",
      name: "Ana Clara",
      email: "ana@achpet.local",
      passwordHash,
      phone: "77977776666",
      adopterProfile: {
        create: {
          cpf: "39053344705",
          birthDate: "22/09/1995",
          address: "Rua B, 456 - Brasil, Vitoria da Conquista - BA",
        },
      },
    },
    select: { id: true, role: true, email: true, name: true },
  });

  const demoPets = [
    {
      shelterId: shelterCentral.id,
      name: "Thor",
      species: "Cachorro",
      breed: "SRD",
      sex: "Macho",
      ageMonths: 18,
      size: "Medio",
      description: "Thor e docil, vacinado e castrado. Gosta de passeios curtos e se adapta bem a familias.",
      photos: [demoPhotoMap.Thor],
    },
    {
      shelterId: shelterCentral.id,
      name: "Luna",
      species: "Cachorro",
      breed: "Pinscher",
      sex: "Femea",
      ageMonths: 12,
      size: "Pequeno",
      description: "Luna e pequena, carinhosa e cheia de energia. Ideal para apartamento e tutores atenciosos.",
      photos: [demoPhotoMap.Luna],
    },
    {
      shelterId: shelterCentral.id,
      name: "Max",
      species: "Cachorro",
      breed: "Vira-lata",
      sex: "Macho",
      ageMonths: 30,
      size: "Grande",
      description: "Max e brincalhao, protetor e muito companheiro. Precisa de um lar com espaco para correr.",
      photos: [demoPhotoMap.Max],
    },
    {
      shelterId: shelterAmigos.id,
      name: "Mel",
      species: "Cachorro",
      breed: "Caramelo",
      sex: "Femea",
      ageMonths: 8,
      size: "Medio",
      description: "Mel e filhote, sociavel e aprende comandos com facilidade. Esta vermifugada e pronta para adocao.",
      photos: [demoPhotoMap.Mel],
    },
    {
      shelterId: shelterAmigos.id,
      name: "Bolt",
      species: "Cachorro",
      breed: "Border Collie",
      sex: "Macho",
      ageMonths: 48,
      size: "Grande",
      description: "Bolt e inteligente e ativo. Combina com uma familia que goste de rotina, brincadeiras e caminhada.",
      photos: [demoPhotoMap.Bolt],
    },
    {
      shelterId: shelterAmigos.id,
      name: "Sol",
      species: "Cachorro",
      breed: "Labrador",
      sex: "Femea",
      ageMonths: 72,
      size: "Grande",
      description: "Sol e adulta, muito docil e companheira. Boa escolha para familias com criancas.",
      photos: [demoPhotoMap.Sol],
    },
    {
      shelterId: shelterGatos.id,
      name: "Mimi",
      species: "Gato",
      breed: "SRD",
      sex: "Femea",
      ageMonths: 24,
      size: "Pequeno",
      description: "Mimi e tranquila, carinhosa e ama colo. Convive bem em ambientes internos.",
      photos: [demoPhotoMap.Mimi],
    },
    {
      shelterId: shelterGatos.id,
      name: "Whiskers",
      species: "Gato",
      breed: "Siames",
      sex: "Macho",
      ageMonths: 36,
      size: "Pequeno",
      description: "Whiskers e curioso, calmo e independente. Perfeito para quem procura um gato companheiro.",
      photos: [demoPhotoMap.Whiskers],
    },
    {
      shelterId: shelterGatos.id,
      name: "Nina",
      species: "Gato",
      breed: "Rajado",
      sex: "Femea",
      ageMonths: 6,
      size: "Pequeno",
      description: "Nina e filhote, brincalhona e muito sociavel. Esta aprendendo a usar caixa de areia.",
      photos: [demoPhotoMap.Nina],
    },
    {
      shelterId: shelterGatos.id,
      name: "Oliver",
      species: "Gato",
      breed: "Persa",
      sex: "Macho",
      ageMonths: 60,
      size: "Medio",
      description: "Oliver e calmo e gosta de ambientes silenciosos. Ideal para adocao responsavel e rotina tranquila.",
      photos: [demoPhotoMap.Oliver],
    },
    {
      shelterId: shelterAmigos.id,
      name: "Bob",
      species: "Coelho",
      breed: "Mini Lop",
      sex: "Macho",
      ageMonths: 14,
      size: "Pequeno",
      description: "Bob e um coelho docil, limpo e acostumado com interacao humana. Gosta de cenoura e espaco seguro.",
      photos: [demoPhotoMap.Bob],
    },
    {
      shelterId: shelterCentral.id,
      name: "Pipoca",
      species: "Coelho",
      breed: "SRD",
      sex: "Femea",
      ageMonths: 10,
      size: "Pequeno",
      description: "Pipoca e calma, curiosa e se adapta bem a ambientes internos com supervisao.",
      photos: [demoPhotoMap.Pipoca],
    },
  ];

  const pets = await Promise.all(
    demoPets.map((pet) =>
      prisma.pet.create({
        data: {
          shelterId: pet.shelterId,
          name: pet.name,
          species: pet.species,
          breed: pet.breed,
          sex: pet.sex,
          ageMonths: pet.ageMonths,
          size: pet.size,
          description: pet.description,
          photos: {
            create: pet.photos.map((photo) => ({
              url: photo.startsWith("/") ? photo : `/uploads/${photo}`,
            })),
          },
        },
        select: { id: true, name: true, species: true, shelterId: true },
      }),
    ),
  );

  const thor = pets.find((pet) => pet.name === "Thor")!;
  const luna = pets.find((pet) => pet.name === "Luna")!;
  const mimi = pets.find((pet) => pet.name === "Mimi")!;
  const bob = pets.find((pet) => pet.name === "Bob")!;

  await prisma.favorite.createMany({
    data: [
      { userId: adopter.id, petId: luna.id },
      { userId: adopter.id, petId: mimi.id },
      { userId: adopterAna.id, petId: bob.id },
    ],
    skipDuplicates: true,
  });

  const pendingRequest = await prisma.adoptionRequest.create({
    data: {
      petId: thor.id,
      adopterId: adopter.id,
      shelterId: shelterCentral.id,
      message: "Quero adotar o Thor e posso enviar atualizacoes semanais.",
    },
    select: { id: true, status: true },
  });

  const approvedRequest = await prisma.adoptionRequest.create({
    data: {
      petId: luna.id,
      adopterId: adopter.id,
      shelterId: shelterCentral.id,
      message: "Tenho interesse na Luna. Moro em apartamento e tenho rotina tranquila.",
      status: "APPROVED",
    },
    select: { id: true, status: true },
  });

  const adoption = await prisma.adoption.create({
    data: {
      adoptionRequestId: approvedRequest.id,
      followUpDays: 30,
      thread: {
        create: {
          messages: {
            create: [
              {
                senderId: shelterCentral.id,
                content: "Ola! Sua solicitacao foi aprovada. Vamos combinar os proximos passos?",
              },
              {
                senderId: adopter.id,
                content: "Que noticia boa! Posso buscar a Luna no sabado.",
              },
            ],
          },
        },
      },
      updates: {
        create: [
          {
            authorId: adopter.id,
            text: "Primeira atualizacao: a Luna chegou bem e ja esta se adaptando ao novo lar.",
            photoUrl: demoPhotoMap.Luna,
          },
        ],
      },
    },
    select: { id: true },
  });

  await prisma.adoptionRequest.create({
    data: {
      petId: bob.id,
      adopterId: adopterAna.id,
      shelterId: shelterAmigos.id,
      message: "Tenho espaco seguro para receber um coelho e gostaria de conhecer o Bob.",
      status: "REJECTED",
    },
    select: { id: true, status: true },
  });

  console.log("Seed concluido:");
  console.log({
    shelters: [shelterCentral, shelterAmigos, shelterGatos],
    adopters: [adopter, adopterAna],
    pets: pets.length,
    pendingRequest,
    approvedRequest,
    adoption,
  });
  console.log("Logins de demonstracao:");
  console.log("Abrigo principal: shelter@achpet.local / 123456");
  console.log("Adotante principal: adopter@achpet.local / 123456");
  console.log("Outros abrigos: amigos@achpet.local e gatos@achpet.local / 123456");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
