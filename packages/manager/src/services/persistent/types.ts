export type TEnv = {
  _id: string;
  propertyIdentifier: string;
  url: string;
  cluster: string;
  isEph: boolean;
  env: string;
  sync?: string;
  createdBy: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  symlink: [];
};

export type TCreateEnvDTO = {
  propertyIdentifier: string;
  env: string;
  url: string;
  createdBy: string;
  cluster: string;
};
