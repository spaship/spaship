export type TWebProperty = {
  env: {
    _id: string;
    cluster: string;
    createdAt: string;
    createdBy: string;
    env: string;
    isActive: boolean;
    isEph: boolean;
    propertyIdentifier: string;
    sync: string;
    updatedAt: string;
    updatedBy: string;
    url: string;
  }[];
  createdBy: string;
  title: string;
  identifier: string;
};

export type TCreateWebPropertyDTO = {
  title: string;
  identifier: string;
  env: string;
  url: string;
  createdBy: string;
  cluster: string;
};

export type TCmdbValidation = {
  name: string;
  code: string;
  url: string;
  email: string;
  severity: string;
};
