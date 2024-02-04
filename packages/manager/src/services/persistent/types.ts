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
export type TCreateSymlinkDTO = {
  propertyIdentifier: string;
  env: string;
  source: string;
  createdBy: string;
  target: string;
};

export type TCreateStaticApp = {
  propertyIdentifier: string;
  env: string;
  source: string;
  createdBy: string;
  target: string;
};

export type TCreateStaticAppOutput = {
  propertyIdentifier: string;
  env: string;
  name: string;
  path: string;
  ref: string;
  upload: FormData;
};
