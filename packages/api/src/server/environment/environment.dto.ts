import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { MAX, MESSAGE, MIN, VALIDATION } from 'src/configuration';

export class CreateEnvironmentDto {
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
  @IsString()
  @IsNotEmpty()
  @Length(MIN.DEFAULT, MAX.CLUSTER, { message: MESSAGE.INVALID_LENGTH, always: true })
  @Matches(VALIDATION.CLUSTER, { message: MESSAGE.INVALID_CLUSTER, always: true })
  cluster: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(MIN.DEFAULT, MAX.DEFAULT, { message: MESSAGE.INVALID_LENGTH, always: true })
  @Matches(VALIDATION.URL, { message: MESSAGE.INVALID_URL, always: true })
  url: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  createdBy: string;
}

export class SyncEnvironmentDto {
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
  @IsString()
  @IsNotEmpty()
  sync: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  createdBy: string;
}
