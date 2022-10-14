export type TEphemeralEnv = {
  id: string;
  propertyName: string;
  actionEnabled: boolean;
  actionId: string;
  expiresIn: number;
  env: string;
  createdBy: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  spa: TPreviewSPA[];
};

export type TPreviewSPA = {
  _id: string;
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
