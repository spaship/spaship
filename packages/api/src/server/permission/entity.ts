export class Permission {
  name: string;

  email: string;

  target: Target;

  action: string;

  createdBy: string;

  updatedBy: string;

  isActive: boolean;
}

export class Target {
  propertyIdentifier: string;

  cluster: string;

  applicationIdentifier: string;
}
