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
  createdAt: string;
  updatedAt: string;
  id: string;
};

export type TUniqueWebProperty = {
  propertyTitle: string;
  propertyName: string;
  url: string;
  createdBy: string;
};

export type TCreateWebPropertyDTO = {
  propertyTitle: string;
  propertyName: string;
  deploymentConnectionType: string;
  url: string;
  env: string;
  createdBy: string;
  type: string;
};
