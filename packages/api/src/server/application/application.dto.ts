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
  @Length(MIN.EPH_EXPIRESIN, MAX.EPH_EXPIRESIN, { message: MESSAGE.INVALID_LENGTH, always: true })
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
  @IsNotEmpty()
  config: object;

  @ApiProperty()
  @IsObject()
  @IsNotEmpty()
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
  @IsNotEmpty()
  @IsOptional()
  commitId: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  mergeId: string;
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
