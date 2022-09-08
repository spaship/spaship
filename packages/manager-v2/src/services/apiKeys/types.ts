export type TApiKey = {
  label: string;
  propertyName: string;
  shortKey: string;
  expirationDate: string;
  createdBy: string;
  createdAt: string;
};

export type TCreateApiKeyDTO = {
  expiresIn: string;
  env: string[];
  label: string;
  propertyName: string;
  createdBy: string;
};

export type TCreateApiKeyRes = {
  propertyName: string;
  token: string;
};

export type TDeleteApiKeyDTO = {
  propertyName: string;
  shortKey: string;
};
