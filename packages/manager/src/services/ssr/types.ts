export type TSSRProperty = {
  config: { [key: string]: string };
  propertyIdentifier: string;
  name: string;
  path: string;
  env: string;
  ref: string;
  imageUrl: string;
  healthCheckPath: string;
};

export type TSSRConfigure = {
  propertyIdentifier: string;
  env: string;
  identifier: string;
  config: {
    [key: string]: any;
  };
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
    isSSR: boolean;
    imageUrl: string;
    config: {
      [key: string]: any;
    };
    healthCheckPath: string;
    version: number;
    createdBy: string;
    updatedBy: string;
    _id: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
}
