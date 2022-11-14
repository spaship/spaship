export type TWebProperty = {
  _id: string;
  title: string;
  identifier: string;
  cluster: string;
  isEph: boolean;
  url: string;
  env: string;
  type: string;
  createdBy: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  id: string;
};

export type TCreateWebPropertyDTO = {
  title: string;
  identifier: string;
  env: string;
  url: string;
  createdBy: string;
  cluster: string;
};
