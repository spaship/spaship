export interface IEnvironment {
  name: string;
  api: string;
  domain: string;
}

export interface IConfig {
  name: string;
  isPreset?: boolean;
  environments: IEnvironment[];
}
