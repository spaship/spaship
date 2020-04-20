import { IEnvironment } from "../config";

export interface IAPIKeyBase {
  label: string;
  expiredDate?: string;
}

export interface IAPIKeyPayload extends IAPIKeyBase {}

export interface IAPIKeyReadOnly {
  readonly key?: string;
  readonly shortKey?: string;
  readonly createdAt?: string;
}

export interface IAPIKeyResponse extends IAPIKeyBase, IAPIKeyReadOnly {}

export interface IAPIKeyEnvironment extends Partial<IEnvironment>, IAPIKeyReadOnly {}

export interface IAPIKey extends IAPIKeyBase {
  environments: IAPIKeyEnvironment[];
}
