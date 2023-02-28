export type UserDataItem = {
  email: string;
  name: string;
  role: string;
  // PERMISSION_CREATION: boolean;
  // PERMISSION_DELETION: boolean;
  // ENV_SYNC: boolean;
  // ENV_CREATION: boolean;
  // APIKEY_DELETION: boolean;
  // APIKEY_CREATION: boolean;
  isOpen: boolean;
  [key: string]: boolean | string;
};
export type UserDataDTO = {
  data: UserDataItem[];
};
export type ColumnNames = {
  NAME: string;
  APIKEY_CREATION: string;
  APIKEY_DELETION: string;
  PERMISSION_CREATION: string;
  PERMISSION_DELETION: string;
  ENV_CREATION: string;
  ENV_SYNC: string;
  [key: string]: string;
};
export type RoverItem = {
  name: string;
  email: string;
};
export type RoverUserList = RoverItem[];

export type NewRoverData = {
  email: string;
  isOpen: boolean;
  name: string;
  role: string;
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
export type UserRoleDTO = {
  [key: string]: string[];
};
