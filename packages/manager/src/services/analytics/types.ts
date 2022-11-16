export type TDeploymentCount = {
  propertyIdentifier: string;
  code: string;
  count: number;
};

export type TWebPropActivityStream = {
  propertyIdentifier: string;
  action: string;
  branch: string;
  env: string;
  createdAt: string;
  _id: string;
  message: string;
  latestActivityHead: string;
  latestActivityTail: string;
  props: Props;
};

export type TSPADeploymentCount = {
  propertyIdentifier: string;
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

export type Props = {
  applicationIdentifier: string;
  env: string;
};
