import * as jwt from "jsonwebtoken";
import type { TokenService, AccessTokenPayload } from "../../application/ports/TokenService.js";
import { AppError } from "../../domain/errors/AppError.js";
import { env } from "../env.js";

export class JwtTokenService implements TokenService {
  signAccessToken(payload: AccessTokenPayload) {
    return jwt.sign(payload, env.JWT_SECRET as jwt.Secret, {
      expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
    });
  }

  verifyAccessToken(token: string): AccessTokenPayload {
    try {
      return jwt.verify(token, env.JWT_SECRET as jwt.Secret) as AccessTokenPayload;
    } catch {
      throw new AppError(401, "Token inválido");
    }
  }
}
