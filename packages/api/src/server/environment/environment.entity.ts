export class Environment {
  propertyIdentifier: string;

  url: string;

  cluster: string;

  env: string;

  sync: string;

  isEph: boolean;

  actionEnabled: boolean;

  actionId: string;

  expiresIn: string;

  agendaId: string;

  symlink: Symlink[];

  createdBy: string;

  updatedBy: string;

  isActive: boolean;
}

export class Symlink {
  source: string;

  target: string;
}

export enum Cluster {
  PROD = 'prod',
  PREPROD = 'preprod'
}
