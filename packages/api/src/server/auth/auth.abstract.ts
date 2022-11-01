export abstract class IAuthServicePayload {
  propertyName: string;

  expiresIn: string;

  env: string[];

  label: string;

  createdBy: string;
}

export abstract class IAuthService {
  abstract checkToken(token: string): Promise<any>;
  abstract createToken(payload: IAuthServicePayload, secret: string, expiresIn: string): string;
}
