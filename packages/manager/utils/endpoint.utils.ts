import { getHost } from "./config.utils";

const spashipHost = getHost();

export function getWebPropertyListUrl() {
  return `${spashipHost}/webproperty/list`;
}

export function getSpaListUrl(propertyReq: string) {
  return `${spashipHost}/webproperty/getspalist/${propertyReq}`
}

export function getAllEventCountUrl() {
  return `${spashipHost}/event/fetch/analytics/all`;
}

export function getEventAnalyticsUrl() {
  return `${spashipHost}/event/fetch/analytics/filter`;
}

export function getValidateUrl() {
  return `${spashipHost}/applications/validate`;
}

export function getNextValidateUrl() {
  return `/api/validate`;
}