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

  routerUrl: string[];

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

  commitDetails: object[];

  mergeDetails: object[];

  gitProjectId: string;

  buildName: object[];

  pipelineDetails: object[];

  dockerFileName: string;

  autoGenerateLHReport: boolean;

  autoSync: boolean;

  symlink: Symlink[];

  virtualPaths: VirtualPath[];

  autoSymlinkCreation: boolean;

  cmdbCode: string;

  severity: string;

  createdBy: string;

  updatedBy: string;

  updatedAt: Date;
}

export class Symlink {
  source: string;

  target: string;

  status: string;
}

export class OperatorSymlinkRequest {
  environment: OperatorSymlinkEnvironment;

  metadata: OperatorSymlinkMetadata;

  commandType: string;
}

export class OperatorSymlinkMetadata {
  source: string;

  target: string;
}

export class PodList {
  cluster: string;

  pods: string[];
}

export class OperatorSymlinkEnvironment {
  websiteName: string;

  nameSpace: string;

  name: string;
}

export class VirtualPath {
  basePath: string;

  virtualPath: string;

  createdAt: string;
}
