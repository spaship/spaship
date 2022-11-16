export type TEnv = {
  _id: string;
  propertyIdentifier: string;
  url: string;
  cluster: string;
  isEph: boolean;
  env: string;
  createdBy: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type TCreateEnvDTO = {
  propertyIdentifier: string;
  env: string;
  url: string;
  createdBy: string;
  cluster: string;
};
