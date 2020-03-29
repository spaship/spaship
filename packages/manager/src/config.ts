export interface IEnvironment {
  name: string;
  api: string;
  domain: string;
}

export interface IConfig {
  environments: IEnvironment[];
  keycloak: {
    url: string;
    realm: string;
    clientId: string;
  };
}
declare global {
  interface Window {
    SPAship: IConfig;
  }
}

export default window.SPAship;
