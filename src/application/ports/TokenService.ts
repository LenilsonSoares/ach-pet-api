export type AccessTokenPayload = {
  sub: string;
  role: "ADOPTER" | "SHELTER";
};

export type TokenService = {
  signAccessToken(payload: AccessTokenPayload): string;
  verifyAccessToken(token: string): AccessTokenPayload;
};
