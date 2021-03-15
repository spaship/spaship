import { IApplicationResponse, IApplicationPayload, IApplication } from "../models/Application";
import { IEnvironment } from "../config";
import { get, upload } from "../utils/APIUtil";

export const getApplication = async (environment: IEnvironment, name: string) => {
  try {
    const application = await get<IApplicationResponse>(`${environment.api}/applications/${name}`);
    return application;
  } catch (error) {
    console.error(error);
  }
  return null;
};

export const getApplicationList = async (environment: IEnvironment) => {
  try {
    const applications = await get<IApplicationResponse[]>(`${environment.api}/applications`);
    return applications;
  } catch (error) {
    console.error(error);
  }
  return [];
};

export const deployApplication = async (environment: IEnvironment, payload: IApplicationPayload) => {
  try {
    const data = new FormData();
    data.append("name", payload.name);
    data.append("path", payload.path);
    data.append("ref", payload.ref);
    payload.upload && data.append("upload", payload.upload);

    const application = await upload<IApplicationResponse>(`${environment.api}/applications/deploy`, data);
    return application;
  } catch (error) {
    console.error(error);
  }
  return null;
};

export const fetchApplications = async (environments: IEnvironment[] = []) => {
  const fetchJobs = environments.map((env) => getApplicationList(env));
  const results = await Promise.all(fetchJobs);
  const applications: IApplication[] = [];
  let accessError;

  environments.forEach((env, index) => {
    const hasAccess = Array.isArray(results[index]);
    if (hasAccess) {
      const envAppList = results[index] || [];
      envAppList.forEach((apiApp: IApplicationResponse) => {
        const match = applications.find((app) => app.path === apiApp.path);
        if (match) {
          match.environments = [...match.environments, { name: env.name, ref: apiApp.ref, timestamp: apiApp.timestamp }];
        } else {
          applications.push({
            ...apiApp,
            environments: [{ name: env.name, ref: apiApp.ref, timestamp: apiApp.timestamp }],
          });
        }
      });
    } else {
      accessError = results[index];
    }
  });
  return [applications, accessError];
};

export const fetchApplication = async (name: string, environments: IEnvironment[] = []) => {
  const fetchJobs = environments.map((env) => getApplication(env, name));
  const results = await Promise.all(fetchJobs);

  const application: Partial<IApplication> = {
    environments: [],
  };

  environments.forEach((env, index) => {
    const app = results[index];
    if (app && app.name) {
      application.name = app.name;
      application.path = app.path;
      application.environments?.push({
        name: env.name,
        ref: app.ref,
        timestamp: app.timestamp,
      });
    }
  });

  return application as IApplication;
};
