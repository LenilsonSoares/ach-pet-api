export interface RegisterUserInputBoundary {
  role: "ADOPTER" | "SHELTER";
  name: string;
  email: string;
  password: string;
  phone?: string;
  orgName?: string;
}

export interface RegisterUserOutputBoundary {
  user: {
    id: string;
    name: string;
    email: string;
    role: "ADOPTER" | "SHELTER";
  };
  token: string;
}

export interface RegisterUserPresenter {
  present(output: RegisterUserOutputBoundary): any;
}
