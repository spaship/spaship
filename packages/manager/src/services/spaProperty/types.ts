export type TSpaProperty = {
  propertyIdentifier: string;
  name: string;
  path: string;
  ref: string;
  env: string;
  identifier: string;
  nextRef: string;
  accessUrl: string[];
  updatedAt: string;
  _id: number;
  isContainerized: boolean;
  isGit: boolean;
  healthCheckPath: string;
  autoSync: boolean;
  config: {
    [key: string]: string;
  };
  imageUrl: string;
  port: number;
  buildName: string[];
};
