export type TSSRProperty = {
  config: Record<string, string>;
  propertyIdentifier: string;
  name: string;
  path: string;
  env: string;
  ref?: string;
  imageUrl?: string;
  healthCheckPath: string;
};

export type TSSRConfigure = {
  propertyIdentifier: string;
  env: string;
  identifier: string;
  config: Record<string, string>;
};
export interface TSSRResponse {
  data: {
    identifier: string;
    propertyIdentifier: string;
    name: string;
    env: string;
    path: string;
    ref: string;
    nextRef: string;
    accessUrl: string;
    isActive: boolean;
    isContainerized: boolean;
    isGit: boolean;
    imageUrl: string;
    config: Record<string, string>;
    healthCheckPath: string;
    version: number;
    createdBy: string;
    updatedBy: string;
    _id: string;
    createdAt: string;
    updatedAt: string;
    port: string;
    __v: number;
  };
}

export type TWorkflowResponse = TSSRResponse & {
  gitRef: string;
  type: string;
  repoUrl: string;
  contextDir: string;
  buildArgs: Record<string, unknown>;
};

export type TSSRValidate = {
  propertyIdentifier: string;
  identifier: string;
  repoUrl: string;
  gitRef: string;
  contextDir: string;
};
export type TSSRValidateResponse = {
  warning: string;
  port: string;
};
