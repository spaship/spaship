export class Property {
  title: string;

  identifier: string;

  namespace: string;

  deploymentConnectionRecord: DeploymentConnectionRecord[];

  createdBy: string;

  isActive: boolean;
}

export class DeploymentConnectionRecord {
  deploymentConnectionName: string;

  cluster: string;
}
