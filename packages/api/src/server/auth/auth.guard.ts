import { ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import * as crypto from 'crypto';
import jwt_decode from 'jwt-decode';
import { AUTH_DETAILS, AUTH_LISTING, GLOBAL_PREFIX } from 'src/configuration';
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
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // @internal TODO : To be removed after the auth implementation in the Puzzle Application
    if (context.getArgs()[0].url.startsWith(AUTH_LISTING.gitDeploymentBaseURL)) return true;
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
      const url = context.getArgs()[0].url;
      if (url.startsWith(AUTH_LISTING.deploymentBaseURL)) return this.validateDeploymentRequest(propertyIdentifier, env, bearerToken, context);
      if (url.startsWith(AUTH_LISTING.eventsBaseURL)) return this.validateEventRequest(propertyIdentifier, bearerToken);
      if (context.getArgs()[0].method === 'GET') return this.validateGetRequest(bearerToken);
    }
    const secret: string = this.getSecretKey();
    const options: Object = { secret, algorithms: ['RS256'] };
    let validated: boolean = false;
    try {
      // @internal Validating the JWT Token
      validated = Boolean(this.jwtService.verify(bearerToken, options));
    } catch (err) {
      this.exceptionsService.UnauthorizedException(err.message);
    }
    try {
      if (validated) {
        await this.isAuthorized(bearerToken, context);
        return true;
      }
    } catch (err) {
      this.exceptionsService.forbiddenException(err.message);
    }
    return false;
  }

  private async isAuthorized(bearerToken: string, context: ExecutionContext) {
    const payload = jwt_decode(bearerToken);
    const resource = context.getArgs()[0].route.path.split(GLOBAL_PREFIX)[1];
    const method = context.getArgs()[0].method;
    const propertyIdentifier = context.getArgs()[0].body.propertyIdentifier || context.getArgs()[0].params.propertyIdentifier;
    const checkResource = (await this.dataServices.authActionLookup.getByAny({ resource, method }))[0];
    const email = JSON.parse(JSON.stringify(payload)).email;
    context.getArgs()[0].body.createdBy = email;
    if (checkResource) {
      if (!propertyIdentifier)
        this.exceptionsService.badRequestException({
          message: `Please provide the PropertyIdentifier.`
        });
      const authorized = (await this.dataServices.permission.getByAny({ propertyIdentifier, email, action: checkResource.name }))[0];
      if (!authorized)
        this.exceptionsService.UnauthorizedException({
          message: `${email} is not authorized to perform this action, please connect with ${propertyIdentifier} owner.`
        });
    }
    // @internal It'll extract the Name of the Creator specificity for the Property Creation Request
    if (context.getArgs()[0].route.path === AUTH_LISTING.propertyBaseURL)
      context.getArgs()[0].body.creatorName = JSON.parse(JSON.stringify(payload)).name;
  }

  // @internal Request authentication for deployment api
  private async validateDeploymentRequest(propertyIdentifier: string, env: string, bearerToken: string, context) {
    if (propertyIdentifier && env) {
      const hashKey = this.getHashKeyForValidation(bearerToken);
      const response = (await this.dataServices.apikey.getByAny({ propertyIdentifier, env, hashKey }))[0];
      if (response) {
        context.getArgs()[0].query.createdBy = response.createdBy;
        const { expirationDate } = response;
        if (expirationDate && expirationDate.getTime() <= new Date().getTime())
          this.exceptionsService.badRequestException({ message: 'API Key is expired.' });
        return true;
      }
      this.exceptionsService.UnauthorizedException({ message: 'Invalid API Key.' });
    }
    return false;
  }

  // @internal Request authentication for events api
  private async validateEventRequest(propertyIdentifier: string, bearerToken: string) {
    if (propertyIdentifier) {
      const hashKey = this.getHashKeyForValidation(bearerToken);
      const response = (await this.dataServices.apikey.getByAny({ propertyIdentifier, hashKey }))[0];
      if (response) {
        const { expirationDate } = response;
        if (expirationDate && expirationDate.getTime() <= new Date().getTime())
          this.exceptionsService.badRequestException({ message: 'API Key is expired.' });
        return true;
      }
      this.exceptionsService.UnauthorizedException({ message: 'Invalid API Key.' });
    }
    return false;
  }

  // @internal Request authentication for get api
  private async validateGetRequest(bearerToken: string) {
    const hashKey = this.getHashKeyForValidation(bearerToken);
    const response = (await this.dataServices.apikey.getByAny({ hashKey }))[0];
    if (response) {
      const { expirationDate } = response;
      if (expirationDate && expirationDate.getTime() <= new Date().getTime())
        this.exceptionsService.badRequestException({ message: 'API Key is expired.' });
      return true;
    }
    this.exceptionsService.UnauthorizedException({ message: 'Invalid API Key.' });
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
