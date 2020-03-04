export interface IApplication {
  name: string;
  path: string;
  ref: string;
  upload: File | string;
  environments: IEnvironment[];
}

export interface IDeployHistory {
  version: string;
  timestamp: Date;
}
interface IEnvironment {
  name: string;
  deployHistory: IDeployHistory[];
}
