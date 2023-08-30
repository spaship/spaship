export type TEphemeralEnv = {
  _id: string;
  propertyIdentifier: string;
  actionEnabled: boolean;
  actionId: string;
  expiresIn: number;
  env: string;
  createdBy: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  applications: TPreviewSPA[];
};

export type TPreviewSPA = {
  _id: string;
  propertyIdentifier: string;
  identifier: string;
  path: string;
  createdBy: string;
  updatedBy: string;
  env: string;
  ref: string;
  nextRef: string;
  namespace: string;
  accessUrl: string[];
  routerUrl: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};
