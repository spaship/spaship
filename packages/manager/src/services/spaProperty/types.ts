export type TSpaProperty = {
  propertyIdentifier: string;
  name: string;
  path: string;
  ref: string;
  env: string;
  identifier: string;
  nextRef: string;
  accessUrl: string[];
  routerUrl: string[];
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
export type TSymlinkDTO = {
  propertyIdentifier: string | undefined;
  env: string;
  source: string;
  createdBy: string;
  target: string;
  identifier: string | undefined;
};
export type TAutoEnableSymlinkDTO = {
  propertyIdentifier: string | undefined;
  env: string;
  createdBy: string;
  identifier: string | undefined;
  autoSymlinkCreation: boolean;
};

export type TVirtualPath = {
  propertyIdentifier: string | undefined;
  env: string;
  basePath: string;
  identifier: string | undefined;
  virtualPath: string;
};
