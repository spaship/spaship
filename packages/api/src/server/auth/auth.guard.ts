import { ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import * as crypto from 'crypto';
import jwt_decode from 'jwt-decode';
import { AUTH_DETAILS } from 'src/configuration';
import { IDataServices } from 'src/repository/data-services.abstract';
import { ExceptionsService } from 'src/server/exceptions/exceptions.service';

@Injectable()
export class AuthenticationGuard extends AuthGuard('jwt') {
  constructor(
    private readonly jwtService: JwtService,
    private readonly dataServices: IDataServices,
    private readonly exceptionsService: ExceptionsService
  ) {
    super();
  }

  /* @internal
   * Validating JWT and API Key
   * Token Format : Bearer {JWT} / Bearer {APIKey}
   * TODO : This should be improvised with Authorization
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    let bearerToken: string;
    try {
      /* eslint-disable prefer-destructuring */
      bearerToken = context.getArgs()[0].headers.authorization.split(' ')[1];
    } catch (err) {
      this.exceptionsService.badRequestException({ message: 'Authentication token missing.' });
    }
    try {
      // @internal Checking that token is JWT or API Key
      jwt_decode(bearerToken);
    } catch (err) {
      // @internal Validating the API Key
      const { propertyIdentifier, env } = context.getArgs()[0].params;
      if (propertyIdentifier && env) {
        const hashKey = this.getHashKeyForValidation(bearerToken);
        const response = (await this.dataServices.apikey.getByAny({ propertyIdentifier, env, hashKey }))[0];
        if (response) {
          const { expiredDate } = response;
          if (expiredDate && expiredDate.getTime() <= new Date().getTime())
            this.exceptionsService.badRequestException({ message: 'API Key is expired.' });
          return true;
        }
        this.exceptionsService.UnauthorizedException({ message: 'Invalid API Key.' });
      }
    }
    const secret: string = this.getSecretKey();
    const options: Object = { secret, algorithms: ['RS256'] };
    let validated: boolean = false;
    try {
      // @internal Validating the JWT Token
      validated = Boolean(this.jwtService.verify(bearerToken, options));
      if (validated) return true;
    } catch (err) {
      this.exceptionsService.UnauthorizedException(err.message);
    }
    return false;
  }

  // @internal Get the Secret key for the JWT Validation
  private getSecretKey(): string {
    const publicKey = AUTH_DETAILS.pubkey;
    if (!publicKey || publicKey.trim().length === 0) this.exceptionsService.internalServerErrorException({ message: 'Public Key not found.' });
    return this.formatAsPem(publicKey);
  }

  // @internal Construction of PEM for the JWT Secret
  private formatAsPem(key: string): string {
    const keyHeader = '-----BEGIN PUBLIC KEY-----';
    const keyFooter = '-----END PUBLIC KEY-----';
    let formatKey = '';
    if (key.startsWith(keyHeader) && key.endsWith(keyFooter)) {
      return key;
    }
    if (key.split('\n').length === 1) {
      while (key.length > 0) {
        formatKey += `${key.substring(0, 64)}\n`;
        key = key.substring(64);
      }
    }
    return `${keyHeader}\n${formatKey}${keyFooter}`;
  }

  getHashKeyForValidation(key: string): string {
    return crypto.createHash('sha256').update(key).digest('hex');
  }
}
