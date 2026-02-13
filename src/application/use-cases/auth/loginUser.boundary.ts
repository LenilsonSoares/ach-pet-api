export interface LoginUserInputBoundary {
  email: string;
  password: string;
}

export interface LoginUserOutputBoundary {
  user: {
    id: string;
    name: string;
    email: string;
    role: "ADOPTER" | "SHELTER";
  };
  token: string;
}

export interface LoginUserPresenter {
  present(output: LoginUserOutputBoundary): any;
}
