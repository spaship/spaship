export type TDeploymentCount = {
  propertyName: string;
  code: string;
  count: number;
};

export type TWebPropActivityStream = {
  spaName: string;
  propertyName: string;
  code: string;
  branch: string;
  env: string;
  createdAt: string;
  id: string;
  latestActivityHead: string;
  latestActivityTail: string;
};
