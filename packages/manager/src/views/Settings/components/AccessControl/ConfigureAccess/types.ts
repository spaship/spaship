export type GroupItem = {
  email: string;
  name: string;
  role: 'OWNER' | 'USER';
  APIKEY_CREATION?: boolean;
  ENV_CREATION?: boolean;
  ENV_SYNC?: boolean;
  PERMISSION_DELETION?: boolean;
  APIKEY_DELETION?: boolean;
  PERMISSION_CREATION?: boolean;
  APPLICATION_CREATION?: boolean;
};
export type GroupItem1 = {
  email: string;
  name: string;
  role: 'OWNER' | 'USER';
  [key: string]: boolean | string;
};
export type GroupDTO = {
  data: GroupItem1[];
};
export type AddPermType = {
  actions: string[];
  email: string;
  name: string;
}[];
export type AddDataType = {
  propertyIdentifier: string;
  permissionDetails: AddPermType;
};

export type PermissionDetail = {
  email: string;
  name: string;
  actions: string[];
};
export type DeleteDataType = {
  propertyIdentifier: string;
  permissionDetails: PermissionDetail[];
};
