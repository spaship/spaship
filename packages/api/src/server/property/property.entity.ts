export class Property {
  title: string;

  identifier: string;

  namespace: string;

  deploymentRecord: DeploymentRecord[];

  createdBy: string;

  isActive: boolean;
}
export class DeploymentRecord {
  cluster: string;

  name: string;
}
