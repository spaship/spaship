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

  //----------------------------------------------------------------

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isSSR: boolean;

  @ApiProperty()
  @IsString()
  @IsOptional()
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
  @IsOptional()
  env: string;

  @ApiProperty()
  @IsObject()
  @IsOptional()
  config: object;

  createdBy: string;
}
