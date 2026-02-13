export interface CreatePetInputBoundary {
  shelterId: string;
  name: string;
  species: string;
  breed?: string;
  sex?: string;
  ageMonths?: number;
  size?: string;
  description?: string;
}

export interface CreatePetOutputBoundary {
  pet: {
    id: string;
    name: string;
    species: string;
    status: "AVAILABLE" | "ADOPTED" | "PAUSED";
    createdAt: Date;
  };
}

export interface CreatePetPresenter {
  present(output: CreatePetOutputBoundary): any;
}
