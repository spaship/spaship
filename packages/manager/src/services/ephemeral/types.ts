export type TEphemeralEnv = {
  propertyName: string;
  actionEnabled: boolean;
  actionId: string;
  expiresIn: number;
  env: string;
  createdBy: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  spa: TSPA;
};

export type TSPA = {
  propertyName: string;
  identifier: string;
  name: string;
  path: string;
  userId: string;
  env: string;
  ref: string;
  nextRef: string;
  namespace: string;
  accessUrl: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};
