export type TBuildIdForLighthouse = {
  lhProjectId: string;
  lhBuildId: string;
  ciBuildURL: string;
  propertyIdentifier: string;
  identifier: string;
  env: string;
  createdAt: string;
  updatedAt: string;
};
export type LighthouseData = {
  data?: {
    lhBuildId: string;
  }[];
};
