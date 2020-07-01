export interface IEnvironment {
  name: string;
  api: string;
  domain: string;
}

export interface IConfig {
  name: string;
  selected?: boolean;
  isPreset?: boolean;
  environments: IEnvironment[];
}
