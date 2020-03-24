import { ISPAshipAPI } from "../EnvParser";
import { IAPIApplication, IApplication } from "../models/Application";

export const getApplicationList = async (environment: ISPAshipAPI) => {
  try {
    const response = await fetch(`${environment.url}/list`);
    const applications = (await response.json()) as Promise<IAPIApplication[]>;
    return applications;
  } catch (error) {
    console.error(error);
  }
};

export const getAllEnvironmentApplicationList = async (environments: ISPAshipAPI[]) => {
  try {
    const fetchApplicationJobs = environments.map(env => getApplicationList(env));
    const values = await Promise.all(fetchApplicationJobs);

    const applicationList: IApplication[] = [];
    environments.forEach((env, index) => {
      const envAppList = values[index];

      envAppList?.forEach((apiApp: IAPIApplication) => {
        const match = applicationList.find(app => app.path === apiApp.path);
        if (match) {
          match.environments = [
            ...match.environments,
            { name: env.name, deployHistory: [{ version: apiApp.ref, timestamp: new Date() }] }
          ];
        } else {
          applicationList.push({
            ...apiApp,
            environments: [{ name: env.name, deployHistory: [{ version: apiApp.ref, timestamp: new Date() }] }]
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
