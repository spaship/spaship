import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsObject, IsOptional, IsString, IsNumber, Matches, IsArray, Length } from 'class-validator';
import { MAX, MESSAGE, MIN, VALIDATION } from 'src/configuration';

export class CreateApplicationDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Matches(VALIDATION.PATH, { message: MESSAGE.INVALID_PATH, always: true })
  path: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  ref: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  ephemeral: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Length(MIN.EPH_EXPIRESIN, MAX.EPH_EXPIRESIN, { message: MESSAGE.INVALID_EPHEXPIRESIN, always: true })
  @Matches(VALIDATION.EPH_EXPIRESIN, { message: MESSAGE.INVALID_EPHEXPIRESIN, always: true })
  expiresIn: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  actionId: string;

  /* @internal
   * It'll check the format of the provided image url
   *
   * Allowed Image Format :
   *
   * - spaship
   * - spaship:latest
   * - spaship-image:latest
   * - spaship-registry.com/spaship-image:1.0.0
   * - spaship_org/spaship_image:1.2.3-beluga
   *
   * Not Allowed Image Format :
   *
   * - SPAship (uppercase letters not allowed)
   * - SPAship_image@sha256:abc123 (invalid character @)
   * - spaship/image (slashes not allowed in repository name)
   * - spaship-image: (tag or digest cannot be empty)
   */
  @ApiProperty()
  @IsString()
  @IsOptional()
  @Matches(VALIDATION.IMAGEURL, { message: MESSAGE.INVALID_IMAGEURL, always: true })
  imageUrl: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Matches(VALIDATION.PATH, { message: MESSAGE.INVALID_HEALTH_CHECK_PATH, always: true })
  healthCheckPath: string;

  @ApiProperty()
  @IsObject()
  @IsOptional()
  config: object;

  @ApiProperty()
  @IsObject()
  @IsOptional()
  secret: object;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  port: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  repoUrl: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  gitRef: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  gitProjectId: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  contextDir: string;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  buildArgs: object[];

  @ApiProperty()
  @IsOptional()
  @IsString()
  dockerFileName: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  commitId: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  mergeId: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  reDeployment: boolean;

  createdBy: string;
}

export class ApplicationResponse {
  @ApiProperty()
  name: string;

  @ApiProperty()
  path: string;

  @ApiProperty()
  ref: string;

  @ApiProperty()
  env: string;

  @ApiProperty()
  accessUrl: string[];

  @ApiProperty()
  deployedBy: string;

  @ApiProperty()
  warning: string;
}

export class ContainerizedDeploymentRequest {
  nameSpace: string;

  environment: string;

  website: string;

  contextPath: string;

  app: string;

  imageUrl: string;

  healthCheckPath: string;

  configMap: object;

  secretMap: object;

  port: number;

  cmdbCode: string;
}

export class ContainerizedDeploymentResponse {
  accessUrl: string;
}

export class ContainerizedGitDeploymentRequest {
  deploymentDetails: ContainerizedDeploymentRequest;

  nameSpace: string;

  gitRef: string;

  repoUrl: string;

  contextDir: string;

  dockerFilePath: string;

  buildArgs: object;

  reDeployment: boolean;
}

export class UpdateConfigOrSecretRequest {
  ssrResourceDetails: ContainerizedDeploymentRequest;

  keysToDelete: string[];
}

export class ContainerizedGitDeploymentResponse {
  constructedGitFlowMeta: ContainerizedGitDeploymentRequest;

  buildName: string;

  deploymentName: string;
}

export class ApplicationConfigDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  propertyIdentifier: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  identifier: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  env: string;

  @ApiProperty()
  @IsObject()
  config: object;

  @ApiProperty()
  @IsObject()
  secret: object;

  createdBy: string;
}

export class GitValidationRequestDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  repoUrl: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  gitRef: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  contextDir: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  propertyIdentifier: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  identifier: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  dockerFileName: string;
}

export class GitDeploymentRequestDTO extends GitValidationRequestDTO {
  @ApiProperty()
  @IsOptional()
  envs: string[];

  @ApiProperty()
  @IsString()
  @IsOptional()
  projectId: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  commitId: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  mergeId: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  ephemeral: string;
}

export class EnableApplicationSyncDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  identifier: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(MIN.DEFAULT, MAX.PROPERTY, { message: MESSAGE.INVALID_LENGTH, always: true })
  @Matches(VALIDATION.PROPERTY_IDENTIFIER, { message: MESSAGE.INVALID_PROPERTY_IDENTIFIER, always: true })
  propertyIdentifier: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(MIN.DEFAULT, MAX.ENV, { message: MESSAGE.INVALID_LENGTH, always: true })
  @Matches(VALIDATION.ENV, { message: MESSAGE.INVALID_ENV, always: true })
  env: string;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  autoSync: boolean;

  createdBy: string;
}

export class DeleteApplicationSyncDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  identifier: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(MIN.DEFAULT, MAX.PROPERTY, { message: MESSAGE.INVALID_LENGTH, always: true })
  @Matches(VALIDATION.PROPERTY_IDENTIFIER, { message: MESSAGE.INVALID_PROPERTY_IDENTIFIER, always: true })
  propertyIdentifier: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(MIN.DEFAULT, MAX.ENV, { message: MESSAGE.INVALID_LENGTH, always: true })
  @Matches(VALIDATION.ENV, { message: MESSAGE.INVALID_ENV, always: true })
  env: string;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  isContainerized: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  isGit: boolean;

  createdBy: string;
}

export class GitValidateResponse {
  port: string;

  warning: string;
}

export class GitApplicationStatusRequest {
  objectName: string;

  ns: string;

  upto: string;
}

export class GitApplicationStatusResponse {
  data: string;

  status: string;
}

export class GitCommentRequest {
  commitId: string;

  mergeId: string;

  projectId: string;

  status: string;

  accessUrl: string[];

  source: string;
}

export class SymlinkDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(MIN.DEFAULT, MAX.PROPERTY, { message: MESSAGE.INVALID_LENGTH, always: true })
  @Matches(VALIDATION.PROPERTY_IDENTIFIER, { message: MESSAGE.INVALID_PROPERTY_IDENTIFIER, always: true })
  propertyIdentifier: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  identifier: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(MIN.DEFAULT, MAX.ENV, { message: MESSAGE.INVALID_LENGTH, always: true })
  @Matches(VALIDATION.ENV, { message: MESSAGE.INVALID_ENV, always: true })
  env: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  // @internal TODO : validations to be decided
  // @Matches(VALIDATION.FOLDER, { message: MESSAGE.INVALID_FOLDER, always: true })
  source: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  // @internal TODO : validations to be decided
  // @Matches(VALIDATION.FOLDER, { message: MESSAGE.INVALID_FOLDER, always: true })
  target: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  createdBy: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  autoSymlinkCreation: boolean;
}

export class VirtualPathDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(MIN.DEFAULT, MAX.PROPERTY, { message: MESSAGE.INVALID_LENGTH, always: true })
  @Matches(VALIDATION.PROPERTY_IDENTIFIER, { message: MESSAGE.INVALID_PROPERTY_IDENTIFIER, always: true })
  propertyIdentifier: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  identifier: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(MIN.DEFAULT, MAX.ENV, { message: MESSAGE.INVALID_LENGTH, always: true })
  @Matches(VALIDATION.ENV, { message: MESSAGE.INVALID_ENV, always: true })
  env: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Matches(VALIDATION.PATH, { message: MESSAGE.INVALID_PATH, always: true })
  basePath: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Matches(VALIDATION.PATH, { message: MESSAGE.INVALID_PATH, always: true })
  virtualPath: string;

  createdBy: string;
}

export class SaveVirtualPathRequest {
  incoming_path: string;

  mapped_with: string;
}
