export type TApiKey = {
  label: string;
  env: [string];
  propertyIdentifier: string;
  shortKey: string;
  expirationDate: string;
  createdBy: string;
  createdAt: string;
};

export type TCreateApiKeyDTO = {
  expiresIn: string;
  env: string[];
  label: string;
  propertyIdentifier: string;
  createdBy: string;
};

export type TCreateApiKeyRes = {
  propertyIdentifier: string;
  token: string;
};

export type TDeleteApiKeyDTO = {
  propertyIdentifier: string;
  shortKey: string;
};
