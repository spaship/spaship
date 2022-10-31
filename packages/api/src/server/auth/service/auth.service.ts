import { LoggerService } from "src/configuration/logger/logger.service";
import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { IAuthService, IAuthServicePayload } from "src/server/auth/auth.abstract";

@Injectable()
export class AuthService implements IAuthService {
  constructor(private authService: JwtService) {}

  async checkToken(token: string): Promise<any> {
    const decode = await this.authService.verifyAsync(token);
    return decode;
  }

  createToken(payload: IAuthServicePayload, secret: string, expiresIn: string): string {
    return this.authService.sign(payload, {
      secret: secret,
      expiresIn: expiresIn,
    });
  }
}
