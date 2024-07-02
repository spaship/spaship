export type THistoryData = {
  _id: string;
  propertyIdentifier: string;
  action: string;
  props: {
    applicationIdentifier: string;
    env: string;
  };
  message: string;
  payload: string;
  source: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  __v: 0;
};
