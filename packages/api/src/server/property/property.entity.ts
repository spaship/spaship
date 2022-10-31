export class Property {
  propertyTitle: string;

  propertyName: string;

  namespace: string;

  deploymentConnectionRecord: DeploymentConnectionRecord[];

  createdBy: string;

  isActive: boolean;
}

export class DeploymentConnectionRecord {
  deploymentConnectionName: string;

  cluster: string;
}
