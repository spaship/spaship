export type TApiKey = {
  label: string;
  env: [string];
  propertyIdentifier: string;
  shortKey: string;
  expirationDate: string;
  createdBy: string;
  createdAt: string;
};
export type TCreateApiKeyDTO = {
  expiresIn: string;
  env: string[];
  label: string;
  propertyIdentifier: string;
  createdBy: string;
};
export type TCreateApiKeyRes = {
  key: string;
};
export type TDeleteApiKeyDTO = {
  shortKey: string;
};
export type TIndividualRole = {
  // _id: 63d9fc58104165e3edd20db0,
  name: string;
  email: string;
  propertyIdentifier: string;
  action: string;
  createdBy: string;
  updatedBy: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  __v: 0;
};
export type TUserList = {
  name: string;
  email: string;
};
export type TRoverGroupList = {
  name: string;
  email: string;
};
export type TMemberforSPA = {
  email: string;
  name: string;
  role: string;
  PERMISSION_CREATION: boolean;
  PERMISSION_DELETION: boolean;
  ENV_DELETION: boolean;
  ENV_SYNC: boolean;
  ENV_CREATION: boolean;
  APIKEY_DELETION: boolean;
  APIKEY_CREATION: boolean;
  APPLICATION_CREATION: boolean;
};
export type TpermissionDetails = {
  name: string;
  email: string;
  actions: string[];
};
export type TAddPermissionDTO = {
  propertyIdentifier: string;
  permissionDetails: TpermissionDetails[];
};
export type TDeletePermissionDTO = {
  propertyIdentifier: string;
  permissionDetails: TpermissionDetails[];
};
export type TRoleforMember = {
  _id: string;
  name: string;
  actions: [];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};
