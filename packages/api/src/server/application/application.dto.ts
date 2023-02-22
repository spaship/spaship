import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsObject, IsOptional, IsString, Matches } from 'class-validator';
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

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isSSR: boolean;

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
  @Matches(VALIDATION.PATH, { message: MESSAGE.INVALID_PATH, always: true })
  healthCheckPath: string;

  @ApiProperty()
  @IsObject()
  @IsOptional()
  config: object;

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
}

export class SSRDeploymentRequest {
  nameSpace: string;

  environment: string;

  website: string;

  contextPath: string;

  app: string;

  imageUrl: string;

  healthCheckPath: string;

  configMap: object;
}

export class SSRDeploymentResponse {
  accessUrl: string;
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
