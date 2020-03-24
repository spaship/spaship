export interface IEnvironment {
  name: string;
  api: string;
  domain: string;
}
declare global {
  interface Window {
    SPAship: {
      environments: IEnvironment[];
      keycloak: {
        url: string;
        realm: string;
        clientId: string;
      };
    };
  }
}

const config = window.SPAship;

export default config;
