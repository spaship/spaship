import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePermissionDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  propertyIdentifier: string;

  @ApiProperty()
  @IsNotEmpty()
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
  @IsNotEmpty()
  permissionDetails: PermissionDetailsDto[];

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
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  actions: string[];
}
