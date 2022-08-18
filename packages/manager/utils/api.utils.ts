import { logger } from "./logger.utils";

const getDefaultHeader = async (useJSON = true, token: string) => {
  const headers = new Headers();
  headers.append("Accept", "application/json");
  headers.append("Authorization", `Bearer ${token}`);
  headers.append("rejectUnauthorized", "false")
  if (useJSON) {
    headers.append("Content-Type", "application/json");
  }
  return headers;
};

function handleResponse<T>(res: Response): Promise<T> {
  return new Promise((resolve, reject) => {
    if (res.status === 200 || res.status === 201) {
      res
        .json()
        .then((json) => resolve(getJson<T>(json)))
        .catch((err) => reject(err));
    }
    else if (res.status === 404) {
      const resposne = JSON.parse(JSON.stringify({ status: res.status }));
      res
        .json()
        .then((json) => resolve(resposne))
        .catch((err) => reject(err));
    }
    else {
      res
        .json()
        .then((json) => resolve(json.message))
        .catch((err) => reject(err));
    }
  });
}

function getJson<T>(json: any): T | PromiseLike<T> {
  if (json.data)
    return json.data;
  else return json;
}

export async function get<T>(url: string, token?: string): Promise<T> {
  const headers = await getDefaultHeader(true, token as string);
  const options: RequestInit = {
    method: "GET",
    headers,
  };
  logger.info({ url })
  logger.info({ options })
  const response = await handleResponse<T>(await fetch(url, options));
  logger.info({ response })
  return response;
}

export async function post<T>(url: string, data: object, token: string): Promise<T> {
  const headers = await getDefaultHeader(true, token as string);
  const options: RequestInit = {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  };
  logger.info({ url })
  logger.info({ options })
  const response = await handleResponse<T>(await fetch(url, options));
  logger.info({ response })
  return response;
}

export async function upload<T>(url: string, data: FormData, token: string): Promise<T> {
  const headers = await getDefaultHeader(true, token as string);
  const options: RequestInit = {
    method: "POST",
    headers,
    body: data,
  };
  const response = await fetch(url, options);
  return handleResponse<T>(response);
}

export async function put<T>(url: string, data: object, token?: string): Promise<T> {
  const headers = await getDefaultHeader(true, token as string);
  const options: RequestInit = {
    method: "PUT",
    headers,
    body: JSON.stringify(data),
  };
  const response = await handleResponse<T>(await fetch(url, options));
  return response;
}

export async function del<T>(url: string, data: object, token?: string) {
  const headers = await getDefaultHeader(true, token as string);
  const options: RequestInit = {
    method: "DELETE",
    headers,
  };
  if (data) {
    options.body = JSON.stringify(data);
  }
  const response = await handleResponse<T>(await fetch(url, options));
  return response;
}
