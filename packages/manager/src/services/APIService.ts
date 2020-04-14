import { IEnvironment } from "../config";
import { IAPIApplication, IApplication } from "../models/Application";
import { keycloak } from "../keycloak";
import { IAPIKey } from "../models/APIKey";

export const getApplicationList = async (environment: IEnvironment) => {
  try {
    const response = await fetch(`${environment.api}/applications`, {
      headers: {
        Authorization: `Bearer ${keycloak.token}`,
      },
    });
    const json = await response.json();
    const applications = json.data as IAPIApplication[];
    if (applications) {
      return applications.map((app) => ({
        ...app,
        environments: [environment],
      }));
    }
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

export const getAPIKeyList = async (environment: IEnvironment) => {
  try {
    const response = await fetch(`${environment.api}/apiKeys`, {
      headers: {
        Authorization: `Bearer ${keycloak.token}`,
      },
    });
    const json = await response.json();
    const apiKeys = json.data as IAPIKey[];
    if (apiKeys && apiKeys.length > 0) {
      return apiKeys.map((apiKey) => ({
        ...apiKey,
        environment,
      }));
    }
  } catch (error) {
    console.error(error);
  }
  return [];
};

export const getAllEnvironmentAPIKeyList = async (environments: IEnvironment[]) => {
  try {
    const fetchJobs = environments.map((env: IEnvironment) => getAPIKeyList(env));
    const values = await Promise.all(fetchJobs);
    return values.reduce(function (a, b) {
      return a.concat(b);
    });
  } catch (error) {
    console.error(error);
  }
  return [];
};

export const createAPIKey = async (apiKey: IAPIKey, environment: IEnvironment) => {
  try {
    const response = await fetch(`${environment.api}/apiKeys`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${keycloak.token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        label: apiKey.label,
        expiredDate: apiKey.expiredDate,
      }),
    });
    const json = await response.json();
    if (json.status !== "success") {
      console.error(`Create APIKey ${apiKey.label} error`);
    }
    return (
      {
        ...json.data,
        environment,
      } as IAPIKey
    );
  } catch (error) {
    console.error(error);
  }
};

export const deleteAPIKey = async (apiKey: IAPIKey, environment: IEnvironment) => {
  try {
    const response = await fetch(`${environment.api}/apiKeys/${apiKey.label}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${keycloak.token}`,
      },
    });
    const json = await response.json();
    if (json.status !== "success") {
      console.error(`Delete APIKey ${apiKey.label} error`);
    }
  } catch (error) {
    console.error(error);
  }
};
