export class Property {
  title: string;

  identifier: string;

  namespace: string;

  deploymentRecord: DeploymentRecord[];

  cmdbCode: string;

  severity: string;

  lighthouseDetails: LighthouseDetails;

  createdBy: string;

  updatedBy: string;

  isActive: boolean;
}
export class DeploymentRecord {
  cluster: string;

  name: string;
}

export enum Source {
  GIT = 'GIT',
  MANAGER = 'MANAGER',
  CLI = 'CLI',
  OPERATOR = 'OPERATOR',
  GITLAB = 'https://gitlab',
  GITHUB = 'https://github.com'
}

export class LighthouseDetails {
  id: string;

  token: string;
}