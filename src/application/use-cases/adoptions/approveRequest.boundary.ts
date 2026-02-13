export interface ApproveRequestInputBoundary {
  shelterId: string;
  requestId: string;
  followUpDays: number;
}

export interface ApproveRequestOutputBoundary {
  success: boolean;
  adoptionId?: string;
}

export interface ApproveRequestPresenter {
  present(output: ApproveRequestOutputBoundary): any;
}
