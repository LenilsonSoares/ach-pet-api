export interface CreateUpdateInputBoundary {
  adoptionId: string;
  userId: string;
  text?: string;
  photoUrl?: string;
}

export interface CreateUpdateOutputBoundary {
  updateId: string;
  createdAt: Date;
}

export interface CreateUpdatePresenter {
  present(output: CreateUpdateOutputBoundary): any;
}
