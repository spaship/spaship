import { IEnvironment } from "../config";
import { get, post, del } from "../utils/APIUtil";
import { IAPIKeyPayload, IAPIKeyResponse, IAPIKey } from "../models/APIKey";

export const getAPIKeys = async (environment: IEnvironment) => {
  try {
    const apiKeys = await get<IAPIKeyResponse[]>(`${environment.api}/apiKeys`);
    return apiKeys;
  } catch (error) {
    console.error(error);
  }
  return [];
};

export const createAPIKey = async (environment: IEnvironment, payload: IAPIKeyPayload) => {
  try {
    const apiKey = await post<IAPIKeyResponse>(`${environment.api}/apiKeys`, payload);
    return apiKey;
  } catch (error) {
    console.error(error);
  }
  return null;
};

export const createMultiAPIKeys = async (environments: IEnvironment[], payload: IAPIKeyPayload) => {
  const results = await Promise.all(environments.map((env) => createAPIKey(env, payload)));
  const apiKey: Partial<IAPIKey> = {
    environments: [],
  };

  environments.forEach((env, index) => {
    const envKey = results[index];
    if (envKey) {
      apiKey.label = envKey.label;
      apiKey.expiredDate = envKey.expiredDate;
      apiKey.environments?.push({
        name: env.name,
        key: envKey.key,
        shortKey: envKey.shortKey,
        createdAt: envKey.createdAt,
      });
    }
  });

  return apiKey as IAPIKey;
};

export const deleteAPIKey = async (environment: IEnvironment, label: string) => {
  try {
    await del(`${environment.api}/apiKeys/${label}`);
  } catch (error) {
    console.error(error);
  }
};

export const fetchAPIKeys = async (environments: IEnvironment[] = []) => {
  const fetchJobs = environments.map((env) => getAPIKeys(env));
  const results = await Promise.all(fetchJobs);

  const apiKeys: IAPIKey[] = [];
  let  accessError;

  environments.forEach((env, index) => {
    const hasAccess = Array.isArray(results[index]);
    if (hasAccess) {
      const envAPIKeys = results[index];
      if (envAPIKeys) {
        envAPIKeys.forEach((envKey: IAPIKeyResponse) => {
          const match = apiKeys.find((key) => key.label === envKey.label);
          if (match) {
            match.environments = [
              ...match.environments,
              { name: env.name, shortKey: envKey.shortKey, createdAt: envKey.createdAt },
            ];
          } else {
            apiKeys.push({
              ...envKey,
              environments: [{ name: env.name, shortKey: envKey.shortKey, createdAt: envKey.createdAt }],
            });
          }
        });
        accessError = false;
      }
    } else {
      accessError = results[index];
   }
  });

  return [apiKeys, accessError];
};
