export interface ListPetsInputBoundary {
  status?: "AVAILABLE" | "ADOPTED" | "PAUSED";
  species?: string;
  q?: string;
  page?: number;
  pageSize?: number;
  order?: "asc" | "desc";
}

export interface ListPetsOutputBoundary {
  pets: Array<{
    id: string;
    name: string;
    status: string;
  }>;
}

export interface ListPetsPresenter {
  present(output: ListPetsOutputBoundary): any;
}
