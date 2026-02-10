export type PetStatus = "AVAILABLE" | "ADOPTED" | "PAUSED";

export type PetListItem = {
  id: string;
  shelterId: string;
  name: string;
  species: string;
  breed: string | null;
  sex: string | null;
  ageMonths: number | null;
  size: string | null;
  description: string | null;
  status: PetStatus;
  photos: { id: string; url: string }[];
  shelter: { id: string; name: string };
  createdAt: Date;
};

export type PetDetails = PetListItem;

export type CreatePetInput = {
  name: string;
  species: string;
  breed?: string;
  sex?: string;
  ageMonths?: number;
  size?: string;
  description?: string;
};

export type PetsRepository = {
  list(filters: { status?: PetStatus; species?: string; q?: string }): Promise<PetListItem[]>;
  getById(id: string): Promise<PetDetails | null>;
  create(shelterId: string, input: CreatePetInput): Promise<PetDetails>;
  addPhoto(petId: string, url: string): Promise<{ id: string; url: string }>;
  getOwnerShelterId(petId: string): Promise<string | null>;
  favorite(userId: string, petId: string): Promise<void>;
  unfavorite(userId: string, petId: string): Promise<void>;
};
