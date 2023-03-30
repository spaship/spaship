export type TSpaProperty = {
  propertyIdentifier: string;
  name: string;
  path: string;
  ref: string;
  env: string;
  identifier: string;
  nextRef: string;
  accessUrl: string;
  updatedAt: string;
  _id: number;
  isSSR: boolean;
  healthCheckPath: string;
  config: {
    [key: string]: string;
  };
  imageUrl: string;
  port: string;
};
