export type AdoptionRequestStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELED";

export type AdoptionRequest = {
  id: string;
  petId: string;
  adopterId: string;
  shelterId: string;
  message: string | null;
  status: AdoptionRequestStatus;
  createdAt: Date;
};

export type PetSnapshot = {
  id: string;
  status: "AVAILABLE" | "ADOPTED" | "PAUSED";
  shelterId: string;
};

export type PetWithPhotos = {
  id: string;
  name: string;
  species: string;
  breed: string | null;
  sex: string | null;
  ageMonths: number | null;
  size: string | null;
  description: string | null;
  status: "AVAILABLE" | "ADOPTED" | "PAUSED";
  photos: { id: string; url: string }[];
};

export type AdoptionThreadSnapshot = {
  id: string;
};

export type AdoptionSnapshot = {
  id: string;
  thread: AdoptionThreadSnapshot | null;
};

export type AdoptionStatus = "ACTIVE" | "COMPLETED" | "INTERVENTION" | "CANCELED";

export type AdoptionActionSnapshot = {
  id: string;
  status: AdoptionStatus;
  shelterId: string;
};

export type InboxRequest = {
  id: string;
  pet: PetWithPhotos;
  adopter: { id: string; name: string; email: string };
  message: string | null;
  status: AdoptionRequestStatus;
  createdAt: Date;
  adoption: AdoptionSnapshot | null;
};

export type MineRequest = {
  id: string;
  pet: PetWithPhotos;
  message: string | null;
  status: AdoptionRequestStatus;
  createdAt: Date;
  adoption: AdoptionSnapshot | null;
};

export type AdoptionsRepository = {
  getPetSnapshot(petId: string): Promise<PetSnapshot | null>;
  findExistingRequest(petId: string, adopterId: string): Promise<AdoptionRequest | null>;
  createRequest(input: { petId: string; adopterId: string; shelterId: string; message?: string }): Promise<AdoptionRequest>;

  listInbox(shelterId: string): Promise<InboxRequest[]>;
  listMine(adopterId: string): Promise<MineRequest[]>;

  getRequestForDecision(requestId: string): Promise<{ id: string; status: AdoptionRequestStatus; shelterId: string; petId: string } | null>;
  approveRequest(requestId: string, followUpDays: number): Promise<{ adoption: { id: string; followUpDays: number; thread: { id: string } } }>; 
  rejectRequest(requestId: string): Promise<AdoptionRequest>;

  getAdoptionForAction(adoptionId: string): Promise<AdoptionActionSnapshot | null>;
  interveneAdoption(adoptionId: string): Promise<{ id: string; status: AdoptionStatus }>;
};
