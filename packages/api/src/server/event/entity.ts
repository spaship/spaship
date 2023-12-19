export class Event {
  traceId: string;

  propertyIdentifier: string;

  applicationIdentifier: string;

  env: string;

  version: string;

  path: string;

  accessUrl: string;

  branch: string;

  action: string;

  state: string;

  failure: boolean;

  isActive: boolean;

  createdAt: Date;
}
