export type FollowUpUpdate = {
  id: string;
  adoptionId: string;
  text: string | null;
  photoUrl: string | null;
  createdAt: Date;
  author: { id: string; name: string; role: "ADOPTER" | "SHELTER" };
};

export type AdoptionParticipants = {
  adopterId: string;
  shelterId: string;
  followUpDays: number;
  startsAt: Date;
};

export type FollowupRepository = {
  getAdoptionParticipants(adoptionId: string): Promise<AdoptionParticipants | null>;
  listUpdates(adoptionId: string): Promise<FollowUpUpdate[]>;
  createUpdate(input: {
    adoptionId: string;
    authorId: string;
    text?: string;
    photoUrl?: string;
  }): Promise<FollowUpUpdate>;
};
