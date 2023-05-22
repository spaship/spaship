export type CommonFields = {
  propertyIdentifier: string;
  name: string;
  path: string;
  ref: string;
  env: string;
  healthCheckPath: string;
  isContainerized: boolean;
  isGit: boolean;
  config: Record<string, string>;
  port: number;
  [key: string]: any;
};
export type TDataContainerized = CommonFields & {
  imageUrl: string;
  nextRef: string;
  accessUrl: string;
  identifier: string;
  updatedAt: string;
  _id: number;
};

export type TDataWorkflow = CommonFields & {
  gitRef: string;
  type: string;
  repoUrl: string;
  contextDir: string;
  buildArgs: Array<{ [key: string]: string }>;
};
