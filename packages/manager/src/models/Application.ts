import { IEnvironment } from "../config";

export interface IApplicationBase {
  name: string;
  path: string;
  ref: string;
}

export interface IApplicationPayload extends IApplicationBase {
  upload?: File | string;
}

export interface IApplicationResponse extends IApplicationBase {
  timestamp: string;
}

export interface IApplication {
  name: string;
  path: string;
  environments: IApplicationEnvironment[];
}

export interface IApplicationEnvironment extends Partial<IEnvironment> {
  ref: string;
  timestamp: string;
}


export interface IApplicationChartResponse extends IApplicationBase {
  data: any;
}
