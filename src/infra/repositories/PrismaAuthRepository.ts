import type {
  AuthRepository,
  AuthUser,
  CreatePasswordResetTokenInput,
  PasswordResetTokenRecord,
  PublicUser,
  RegisterInput,
  UpdateUserInput,
} from "../../application/ports/AuthRepository.js";
import { prisma } from "../db/prisma.js";

type PrismaAuthRecord = {
  id: string;
  role: "ADOPTER" | "SHELTER";
  name: string;
  email: string;
  phone: string | null;
  pushChatEnabled: boolean;
  pushAdoptionEnabled: boolean;
  passwordHash: string;
  shelterProfile: {
    orgName: string;
    cnpj: string | null;
    responsible: string | null;
    address: string | null;
    cep: string | null;
    street: string | null;
    addressNumber: string | null;
    addressComplement: string | null;
    neighborhood: string | null;
    city: string | null;
    state: string | null;
    latitude: number | null;
    longitude: number | null;
    site: string | null;
  } | null;
  adopterProfile: {
    cpf: string | null;
    birthDate: string | null;
    address: string | null;
    cep: string | null;
    street: string | null;
    addressNumber: string | null;
    addressComplement: string | null;
    neighborhood: string | null;
    city: string | null;
    state: string | null;
    latitude: number | null;
    longitude: number | null;
  } | null;
};

function toPublicUser(user: PrismaAuthRecord): PublicUser {
  return {
    id: user.id,
    role: user.role,
    name: user.name,
    email: user.email,
    phone: user.phone,
    pushChatEnabled: user.pushChatEnabled,
    pushAdoptionEnabled: user.pushAdoptionEnabled,
    orgName: user.shelterProfile?.orgName ?? null,
    cpf: user.adopterProfile?.cpf ?? null,
    birthDate: user.adopterProfile?.birthDate ?? null,
    address: user.adopterProfile?.address ?? user.shelterProfile?.address ?? null,
    cep: user.adopterProfile?.cep ?? user.shelterProfile?.cep ?? null,
    street: user.adopterProfile?.street ?? user.shelterProfile?.street ?? null,
    addressNumber: user.adopterProfile?.addressNumber ?? user.shelterProfile?.addressNumber ?? null,
    addressComplement: user.adopterProfile?.addressComplement ?? user.shelterProfile?.addressComplement ?? null,
    neighborhood: user.adopterProfile?.neighborhood ?? user.shelterProfile?.neighborhood ?? null,
    city: user.adopterProfile?.city ?? user.shelterProfile?.city ?? null,
    state: user.adopterProfile?.state ?? user.shelterProfile?.state ?? null,
    latitude: user.adopterProfile?.latitude ?? user.shelterProfile?.latitude ?? null,
    longitude: user.adopterProfile?.longitude ?? user.shelterProfile?.longitude ?? null,
    cnpj: user.shelterProfile?.cnpj ?? null,
    responsible: user.shelterProfile?.responsible ?? null,
    site: user.shelterProfile?.site ?? null,
  };
}

export class PrismaAuthRepository implements AuthRepository {
  async findByEmail(email: string): Promise<AuthUser | null> {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        role: true,
        name: true,
        email: true,
        phone: true,
        pushChatEnabled: true,
        pushAdoptionEnabled: true,
        passwordHash: true,
        shelterProfile: {
          select: {
            orgName: true,
            cnpj: true,
            responsible: true,
            address: true,
            cep: true,
            street: true,
            addressNumber: true,
            addressComplement: true,
            neighborhood: true,
            city: true,
            state: true,
            latitude: true,
            longitude: true,
            site: true,
          },
        },
        adopterProfile: {
          select: {
            cpf: true,
            birthDate: true,
            address: true,
            cep: true,
            street: true,
            addressNumber: true,
            addressComplement: true,
            neighborhood: true,
            city: true,
            state: true,
            latitude: true,
            longitude: true,
          },
        },
      },
    });

    if (!user) return null;

    return {
      ...toPublicUser(user),
      passwordHash: user.passwordHash,
    };
  }

  async findAuthById(id: string): Promise<AuthUser | null> {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        role: true,
        name: true,
        email: true,
        phone: true,
        pushChatEnabled: true,
        pushAdoptionEnabled: true,
        passwordHash: true,
        shelterProfile: {
          select: {
            orgName: true,
            cnpj: true,
            responsible: true,
            address: true,
            cep: true,
            street: true,
            addressNumber: true,
            addressComplement: true,
            neighborhood: true,
            city: true,
            state: true,
            latitude: true,
            longitude: true,
            site: true,
          },
        },
        adopterProfile: {
          select: {
            cpf: true,
            birthDate: true,
            address: true,
            cep: true,
            street: true,
            addressNumber: true,
            addressComplement: true,
            neighborhood: true,
            city: true,
            state: true,
            latitude: true,
            longitude: true,
          },
        },
      },
    });

    if (!user) return null;

    return {
      ...toPublicUser(user),
      passwordHash: user.passwordHash,
    };
  }

  async findById(id: string): Promise<PublicUser | null> {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        role: true,
        name: true,
        email: true,
        phone: true,
        pushChatEnabled: true,
        pushAdoptionEnabled: true,
        passwordHash: true,
        shelterProfile: {
          select: {
            orgName: true,
            cnpj: true,
            responsible: true,
            address: true,
            cep: true,
            street: true,
            addressNumber: true,
            addressComplement: true,
            neighborhood: true,
            city: true,
            state: true,
            latitude: true,
            longitude: true,
            site: true,
          },
        },
        adopterProfile: {
          select: {
            cpf: true,
            birthDate: true,
            address: true,
            cep: true,
            street: true,
            addressNumber: true,
            addressComplement: true,
            neighborhood: true,
            city: true,
            state: true,
            latitude: true,
            longitude: true,
          },
        },
      },
    });

    return user ? toPublicUser(user) : null;
  }

  async createUser(input: RegisterInput): Promise<PublicUser> {
    const user = await prisma.user.create({
      data: {
        role: input.role,
        name: input.name,
        email: input.email,
        passwordHash: input.passwordHash,
        phone: input.phone,
        shelterProfile:
          input.role === "SHELTER"
            ? {
                create: {
                  orgName: input.orgName ?? input.name,
                  cnpj: input.cnpj,
                  responsible: input.responsible,
                  address: input.address,
                  cep: input.cep,
                  street: input.street,
                  addressNumber: input.addressNumber,
                  addressComplement: input.addressComplement,
                  neighborhood: input.neighborhood,
                  city: input.city,
                  state: input.state,
                  latitude: input.latitude,
                  longitude: input.longitude,
                  site: input.site,
                },
              }
            : undefined,
        adopterProfile:
          input.role === "ADOPTER"
            ? {
                create: {
                  cpf: input.cpf,
                  birthDate: input.birthDate,
                  address: input.address,
                  cep: input.cep,
                  street: input.street,
                  addressNumber: input.addressNumber,
                  addressComplement: input.addressComplement,
                  neighborhood: input.neighborhood,
                  city: input.city,
                  state: input.state,
                  latitude: input.latitude,
                  longitude: input.longitude,
                },
              }
            : undefined,
      },
      select: {
        id: true,
        role: true,
        name: true,
        email: true,
        phone: true,
        pushChatEnabled: true,
        pushAdoptionEnabled: true,
        passwordHash: true,
        shelterProfile: {
          select: {
            orgName: true,
            cnpj: true,
            responsible: true,
            address: true,
            cep: true,
            street: true,
            addressNumber: true,
            addressComplement: true,
            neighborhood: true,
            city: true,
            state: true,
            latitude: true,
            longitude: true,
            site: true,
          },
        },
        adopterProfile: {
          select: {
            cpf: true,
            birthDate: true,
            address: true,
            cep: true,
            street: true,
            addressNumber: true,
            addressComplement: true,
            neighborhood: true,
            city: true,
            state: true,
            latitude: true,
            longitude: true,
          },
        },
      },
    });

    return toPublicUser(user);
  }

  async updateUser(id: string, input: UpdateUserInput): Promise<PublicUser | null> {
    const existing = await prisma.user.findUnique({
      where: { id },
      select: { role: true, name: true },
    });

    if (!existing) return null;

    const user = await prisma.user.update({
      where: { id },
      data: {
        name: input.name,
        email: input.email,
        phone: input.phone,
        shelterProfile:
          existing.role === "SHELTER"
            ? {
                upsert: {
                  create: {
                    orgName: input.orgName ?? input.name ?? existing.name,
                    cnpj: input.cnpj,
                    responsible: input.responsible,
                    address: input.address,
                    cep: input.cep,
                    street: input.street,
                    addressNumber: input.addressNumber,
                    addressComplement: input.addressComplement,
                    neighborhood: input.neighborhood,
                    city: input.city,
                    state: input.state,
                    latitude: input.latitude,
                    longitude: input.longitude,
                    site: input.site,
                  },
                  update: {
                    orgName: input.orgName,
                    cnpj: input.cnpj,
                    responsible: input.responsible,
                    address: input.address,
                    cep: input.cep,
                    street: input.street,
                    addressNumber: input.addressNumber,
                    addressComplement: input.addressComplement,
                    neighborhood: input.neighborhood,
                    city: input.city,
                    state: input.state,
                    latitude: input.latitude,
                    longitude: input.longitude,
                    site: input.site,
                  },
                },
              }
            : undefined,
        adopterProfile:
          existing.role === "ADOPTER"
            ? {
                upsert: {
                  create: {
                    cpf: input.cpf,
                    birthDate: input.birthDate,
                    address: input.address,
                    cep: input.cep,
                    street: input.street,
                    addressNumber: input.addressNumber,
                    addressComplement: input.addressComplement,
                    neighborhood: input.neighborhood,
                    city: input.city,
                    state: input.state,
                    latitude: input.latitude,
                    longitude: input.longitude,
                  },
                  update: {
                    cpf: input.cpf,
                    birthDate: input.birthDate,
                    address: input.address,
                    cep: input.cep,
                    street: input.street,
                    addressNumber: input.addressNumber,
                    addressComplement: input.addressComplement,
                    neighborhood: input.neighborhood,
                    city: input.city,
                    state: input.state,
                    latitude: input.latitude,
                    longitude: input.longitude,
                  },
                },
              }
            : undefined,
      },
      select: {
        id: true,
        role: true,
        name: true,
        email: true,
        phone: true,
        pushChatEnabled: true,
        pushAdoptionEnabled: true,
        passwordHash: true,
        shelterProfile: {
          select: {
            orgName: true,
            cnpj: true,
            responsible: true,
            address: true,
            cep: true,
            street: true,
            addressNumber: true,
            addressComplement: true,
            neighborhood: true,
            city: true,
            state: true,
            latitude: true,
            longitude: true,
            site: true,
          },
        },
        adopterProfile: {
          select: {
            cpf: true,
            birthDate: true,
            address: true,
            cep: true,
            street: true,
            addressNumber: true,
            addressComplement: true,
            neighborhood: true,
            city: true,
            state: true,
            latitude: true,
            longitude: true,
          },
        },
      },
    });

    return toPublicUser(user);
  }

  async updatePasswordHash(id: string, passwordHash: string): Promise<void> {
    await prisma.user.update({
      where: { id },
      data: { passwordHash },
      select: { id: true },
    });
  }

  async createPasswordResetToken(input: CreatePasswordResetTokenInput): Promise<void> {
    await prisma.passwordResetToken.create({
      data: {
        userId: input.userId,
        tokenHash: input.tokenHash,
        expiresAt: input.expiresAt,
      },
      select: { id: true },
    });
  }

  async findPasswordResetTokenByHash(tokenHash: string): Promise<PasswordResetTokenRecord | null> {
    return prisma.passwordResetToken.findUnique({
      where: { tokenHash },
      select: {
        id: true,
        userId: true,
        tokenHash: true,
        expiresAt: true,
        usedAt: true,
        createdAt: true,
      },
    });
  }

  async markPasswordResetTokenUsed(id: string, usedAt: Date): Promise<void> {
    await prisma.passwordResetToken.update({
      where: { id },
      data: { usedAt },
      select: { id: true },
    });
  }
}
