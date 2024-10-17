import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsEmail, IsNotEmpty, IsString, ValidateNested } from 'class-validator';

export class CreatePermissionDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  propertyIdentifier: string;

  @ApiProperty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PermissionDetailsDto)
  permissionDetails: PermissionDetailsDto[];

  @ApiProperty()
  createdBy: string;
}

export class DeletePermissionDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  propertyIdentifier: string;

  @ApiProperty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DeletePermissionDetailsDto)
  permissionDetails: DeletePermissionDetailsDto[];

  @ApiProperty()
  createdBy: string;
}

export class PermissionDetailsDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsArray()
  accessRights: AccessRights[];
}

export class AccessRights {
  @ApiProperty()
  action: string;

  @ApiProperty()
  cluster: string;

  @ApiProperty()
  applicationIdentifier: string;
}

export class DeletePermissionDetailsDto {
  @ApiProperty()
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsArray()
  accessRights: AccessRights[];
}
