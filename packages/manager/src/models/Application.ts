export interface IApplication extends IAPIApplication {
  upload?: File | string;
  environments: IEnvironment[];
}

export interface IAPIApplication {
  name: string;
  path: string;
  ref: string;
}

export interface IDeployHistory {
  version: string;
  timestamp: Date;
}
interface IEnvironment {
  name: string;
  deployHistory: IDeployHistory[];
}
