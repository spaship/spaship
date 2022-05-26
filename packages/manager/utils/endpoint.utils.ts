import { getHost } from "./config.utils";

const spashipHost = getHost();

export function getWebPropertyListUrl() {
  return `${spashipHost}/webproperty/list`;
}

export function getSpaListUrl(propertyReq: string) {
  return `${spashipHost}/webproperty/get/applications/${propertyReq}`;
}

export function getEnvListUrl(propertyReq: string) {
  return `${spashipHost}/webproperty/alias/list/${propertyReq}`;
}

export function getAPIKeyList(propertyReq: string) {
  return `${spashipHost}/apikeys/${propertyReq}`;
}

export function getAllEventCountUrl() {
  return `${spashipHost}/event/fetch/analytics/all`;
}

export function getPropertyList() {
  return `${spashipHost}/webproperty/alias/list`;
}

export function getEventAnalyticsUrl() {
  return `${spashipHost}/event/fetch/analytics/filter`;
}

export function getOnboardWebpropertyUrl() {
  return `${spashipHost}/webproperty/alias`;
}

export function getValidateUrl() {
  return `${spashipHost}/applications/validate`;
}

export function getNextValidateUrl() {
  return `/api/validate`;
}

export function getNextOnboardWebpropertyUrl() {
  return `/api/webPropertyOnboard`;
}
