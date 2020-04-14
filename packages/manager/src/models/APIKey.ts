import { IEnvironment } from "../config";

export interface IAPIKey {
  label: string;
  key?: string;
  shortKey?: string;
  expiredDate?: string;
  createdAt?: string;
  environment?: IEnvironment;
}
