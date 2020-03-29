import { IEnvironment } from "../config";
import { IAPIApplication, IApplication } from "../models/Application";
import { keycloak } from "../keycloak";

export const getApplicationList = async (environment: IEnvironment) => {
  try {
    const response = await fetch(`${environment.api}/list`, {
      headers: {
        Authorization: `Bearer ${keycloak.token}`,
      },
    });
    const applications = (await response.json()) as Promise<IAPIApplication[]>;
    return (await applications).map((app) => ({
      ...app,
      environments: [environment],
    }));
  } catch (error) {
    console.error(error);
  }
  return [];
};

export const getAllEnvironmentApplicationList = async (environments: IEnvironment[]) => {
  try {
    const fetchApplicationJobs = environments.map((env) => getApplicationList(env));
    const values = await Promise.all(fetchApplicationJobs);

    const applicationList: IApplication[] = [];
    environments.forEach((env, index) => {
      const envAppList = values[index];
      envAppList?.forEach((apiApp: IAPIApplication) => {
        const match = applicationList.find((app) => app.path === apiApp.path);
        if (match) {
          match.environments = [
            ...match.environments,
            { name: env.name, deployHistory: [{ version: apiApp.ref, timestamp: new Date() }] },
          ];
        } else {
          applicationList.push({
            ...apiApp,
            environments: [{ name: env.name, deployHistory: [{ version: apiApp.ref, timestamp: new Date() }] }],
          });
        }
      });
    });
    return applicationList;
  } catch (error) {
    console.error(error);
  }
  return [];
};
