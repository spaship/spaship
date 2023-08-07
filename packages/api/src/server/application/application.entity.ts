export class Application {
  _id: string;

  identifier: string;

  propertyIdentifier: string;

  name: string;

  path: string;

  env: string;

  ref: string;

  nextRef: string;

  accessUrl: string[];

  isActive: boolean;

  isContainerized: boolean;

  imageUrl: string;

  config: object;

  secret: object;

  healthCheckPath: string;

  version: number;

  port: number;

  isGit: boolean;

  gitRef: string;

  repoUrl: string;

  contextDir: string;

  buildArgs: object[];

  commitId: string;

  mergeId: string;

  buildName: object[];

  dockerFileName: string;

  autoSync: boolean;

  createdBy: string;

  updatedBy: string;

  updatedAt: Date;
}
