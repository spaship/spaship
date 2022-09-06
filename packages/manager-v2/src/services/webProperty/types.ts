export type TWebProperty = {
  _id: string;
  propertyTitle: string;
  propertyName: string;
  env: string;
  deploymentConnectionType: string;
  namespace: string;
  url: string;
  type: string;
  createdBy: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  id: string;
};

export type TUniqueWebProperty = {
  propertyTitle: string;
  propertyName: string;
  url: string;
  createdBy: string;
};
