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

export type TLighthouseGenerateDTO = {
  propertyIdentifier: string;
  identifier: string;
  env: string;
  isGit: boolean;
  isContainerized: boolean;
};

export type LighthouseReport = {
  lhProjectId: string;
  lhBuildId: string;
  propertyIdentifier: string;
  identifier: string;
  env: string;
  metrics: {
    [key: string]: number | null;
    performance: number | null;
    accessibility: number;
    bestPractices: number;
    seo: number;
    pwa: number;
    firstContentfulPaint: number;
    firstMeaningfulPaint: number;
    speedIndex: number;
    totalBlockingTime: number;
    cumulativeLayoutShift: number;
  };
  createdAt: string;
  updatedAt: string;
};
