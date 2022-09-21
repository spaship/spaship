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

export type TSPADeploymentCount = {
  propertyName: string;
  spaName: string;
  code: string;
  env: string;
  count: number;
};

export type TSPAMonthlyDeploymentCount = {
  spaName: string;
  env: string;
  count: number;
  startDate: string;
  endDate: string;
};
