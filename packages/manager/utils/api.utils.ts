import { getToken } from "./config.utils";

const getDefaultHeader = async (useJSON = true) => {
  const headers = new Headers();
  const token: string = getToken();
  headers.append("Accept", "application/json");
  headers.append("Authorization", token);
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
        .then((json) => resolve(json.data))
        .catch((err) => reject(err));
    } else {
      res
        .json()
        .then((json) => resolve(json.message))
        .catch((err) => reject(err));
    }
  });
}

export async function get<T>(url: string): Promise<T> {
  const headers = await getDefaultHeader();
  const options: RequestInit = {
    method: "GET",
    headers,
  };
  const res = await fetch(url, options);
  return handleResponse<T>(res);
}

export async function post<T>(url: string, data: object): Promise<T> {
  const headers = await getDefaultHeader();
  const options: RequestInit = {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  };
  const res = await fetch(url, options);
  return handleResponse<T>(res);
}

export async function upload<T>(url: string, data: FormData): Promise<T> {
  const headers = await getDefaultHeader(false);
  const options: RequestInit = {
    method: "POST",
    headers,
    body: data,
  };
  const res = await fetch(url, options);
  return handleResponse<T>(res);
}

export async function put<T>(url: string, data: object): Promise<T> {
  const headers = await getDefaultHeader();
  const options: RequestInit = {
    method: "PUT",
    headers,
    body: JSON.stringify(data),
  };
  const res = await fetch(url, options);
  return handleResponse<T>(res);
}

export async function del<T>(url: string, data?: object) {
  const headers = await getDefaultHeader();
  const options: RequestInit = {
    method: "DELETE",
    headers,
  };
  if (data) {
    options.body = JSON.stringify(data);
  }
  const res = await fetch(url, options);
  return handleResponse<T>(res);
}
