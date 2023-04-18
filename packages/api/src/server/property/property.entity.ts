export class Property {
  title: string;

  identifier: string;

  namespace: string;

  deploymentRecord: DeploymentRecord[];

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
  OPERATOR = 'OPERATOR'
}
