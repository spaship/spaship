import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsOptional, IsString, Matches } from 'class-validator';
import { MESSAGE, VALIDATION } from 'src/configuration';

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
  @IsOptional()
  port: number;

  @ApiProperty()
  @IsOptional()
  repoUrl: string;

  @ApiProperty()
  @IsOptional()
  gitRef: string;

  @ApiProperty()
  @IsOptional()
  contextDir: string;

  @ApiProperty()
  @IsObject()
  @IsOptional()
  buildArgs: object;

  @ApiProperty()
  @IsOptional()
  commitId: string;

  @ApiProperty()
  @IsOptional()
  mergeId: string;

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
  accessUrl: string;

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

  port: number;
}

export class ContainerizedDeploymentResponse {
  accessUrl: string;
}

export class ContainerizedGitDeploymentRequest {
  deploymentDetails: ContainerizedDeploymentRequest;

  namespace: string;

  gitRef: string;

  repoUrl: string;

  contextDir: string;

  buildArgs: object;
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
