export type TCreateSync = {
  propertyIdentifier: string;
  env: string;
  sync: string;
  createdBy: string;
};

export type TSyncResponse = {
  _id: string;
  propertyIdentifier: string;
  url: string;
  cluster: string;
  isEph: boolean;
  sync: string;
  env: string;
  createdBy: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};
export type TEnableAutoSync = {
  propertyIdentifier: string;
  env: string;
  identifier: string;
  autoSync: boolean;
};
