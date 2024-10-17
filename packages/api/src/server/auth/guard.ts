import { ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import * as crypto from 'crypto';
import jwt_decode from 'jwt-decode';
import { AUTH_DETAILS, AUTH_LISTING, GLOBAL_PREFIX } from 'src/configuration';
import { IDataServices } from 'src/repository/data-services.abstract';
import { ExceptionsService } from 'src/server/exceptions/service';
import { Permission, Target } from '../permission/entity';
import { Source } from '../property/entity';

@Injectable()
export class AuthenticationGuard extends AuthGuard('jwt') {
  constructor(
    private readonly jwtService: JwtService,
    private readonly dataServices: IDataServices,
    private readonly exceptionsService: ExceptionsService
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    let bearerToken: string;
    let requesterEmail;
    let requesterName;
    let validated: boolean = false;
    const resource = context.getArgs()[0].route.path.split(GLOBAL_PREFIX)[1];
    const { method } = context.getArgs()[0];
    const propertyIdentifier = context.getArgs()[0].body.propertyIdentifier || context.getArgs()[0].params.propertyIdentifier;
    const secret: string = this.getSecretKey();
    const options: Object = { secret, algorithms: ['RS256'] };

    try {
      bearerToken = context.getArgs()[0].headers.authorization.split(' ')[1];
    } catch (err) {
      this.exceptionsService.badRequestException({ message: 'Authentication token missing.' });
    }

    try {
      const payload = jwt_decode(bearerToken);
      requesterEmail = JSON.parse(JSON.stringify(payload)).email;
      requesterName = JSON.parse(JSON.stringify(payload)).name;
    } catch (err) {
      const hashKey = this.getHashKeyForValidation(bearerToken);
      const { env } = context.getArgs()[0].params;
      const response = (await this.dataServices.apikey.getByAny({ propertyIdentifier, hashKey }))[0];
      if (!response) this.exceptionsService.UnauthorizedException({ message: 'Invalid API Key.' });
      const { expirationDate, createdAt } = response;
      requesterEmail = response.createdBy;

      if (expirationDate && expirationDate.getTime() <= new Date().getTime())
        this.exceptionsService.badRequestException({ message: 'API Key is expired.' });

      const deprecatedKey = new Date('2024-08-04');
      if (createdAt && createdAt.getTime() <= deprecatedKey.getTime()) {
        context.getArgs()[0].body.createdBy = requesterEmail;
        if (response.env && response.env.includes(env)) return true;
        this.exceptionsService.UnauthorizedException({ message: 'Invalid API Key.' });
        return;
      }
      validated = true;
    }
    context.getArgs()[0].body.createdBy = requesterEmail;
    context.getArgs()[0].body.creatorName = requesterName;
    try {
      if (!validated) this.jwtService.verify(bearerToken, options);
    } catch (err) {
      this.exceptionsService.UnauthorizedException(err.message);
    }

    try {
      await this.isAuthorized(requesterEmail, resource, method, propertyIdentifier, context);
    } catch (err) {
      this.exceptionsService.forbiddenException(err.message);
    }
    return true;
  }

  private async isAuthorized(requesterEmail: string, resource: string, method: string, propertyIdentifier: string, context: ExecutionContext) {
    const applicationIdentifier = context.getArgs()[0].body.name || context.getArgs()[0].body.applicationIdentifier;
    const env = context.getArgs()[0].body.env || context.getArgs()[0].params.env;
    let checkEnv;
    let cluster;
    if (env) {
      checkEnv = (await this.dataServices.environment.getByAny({ propertyIdentifier, env }))[0];
      cluster = checkEnv.env;
    }

    const accessResponse = await this.dataServices.authActionLookup.getByAny({ resource, method });
    let access;

    if (accessResponse.length === 1) access = accessResponse[0];
    else if (accessResponse.length === 2 && context.getArgs()[0].route.path.startsWith(AUTH_LISTING.deploymentBaseURL)) {
      const applicationDetails = await this.dataServices.application.getByAny({
        identifier: applicationIdentifier,
        propertyIdentifier
      });

      if (applicationDetails.length === 0) access = accessResponse.find((obj) => obj.name === 'APPLICATION_CREATION');
      else access = accessResponse.find((obj) => obj.name === 'APPLICATION_DEPLOYMENT');
      context.getArgs()[0].query.source = Source.MANAGER;
      context.getArgs()[0].query.createdBy = requesterEmail;
    }

    if (!access) return;

    const target = new Target();
    target.propertyIdentifier = propertyIdentifier;
    if (access.criteria.includes('cluster')) target.cluster = cluster;
    if (access.criteria.includes('applicationIdentifier')) target.applicationIdentifier = applicationIdentifier;

    await Object.keys(target).forEach((key) => (target[key] === undefined || target[key] === '') && delete target[key]);
    const checkAuth = {
      email: requesterEmail,
      action: access.name,
      'target.propertyIdentifier': target.propertyIdentifier,
      'target.cluster': target.cluster,
      'target.applicationIdentifier': target.applicationIdentifier
    };
    Object.keys(checkAuth).forEach((key) => {
      if (checkAuth[key] === undefined || checkAuth[key] === '') {
        delete checkAuth[key];
      }
    });
    const authorized = (await this.dataServices.permission.getByAny(checkAuth))[0];

    if (!authorized)
      this.exceptionsService.forbiddenException({
        message: `${requesterEmail} is not authorized to perform this action, please connect with ${propertyIdentifier} owner.`
      });

    if (access.name === 'APPLICATION_CREATION') {
      const permission = new Permission();
      permission.name = authorized.name;
      permission.email = requesterEmail;
      permission.action = 'APPLICATION_DEPLOYMENT';
      const target = new Target();
      target.propertyIdentifier = propertyIdentifier;
      target.applicationIdentifier = applicationIdentifier;
      target.cluster = 'preprod';
      permission.target = target;
      permission.createdBy = requesterEmail;
      permission.updatedBy = requesterEmail;
      await this.dataServices.permission.create(permission);
      target.cluster = 'prod';
      await this.dataServices.permission.create(permission);
    }
  }

  private getSecretKey(): string {
    const publicKey = AUTH_DETAILS.pubkey;
    if (!publicKey || publicKey.trim().length === 0) this.exceptionsService.internalServerErrorException({ message: 'Public Key not found.' });
    return this.formatAsPem(publicKey);
  }

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
