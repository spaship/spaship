import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches, Length } from 'class-validator';
import { MAX, MESSAGE, MIN, VALIDATION } from 'src/configuration';

export class CreateApikeyDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(MIN.DEFAULT, MAX.DEFAULT, { message: MESSAGE.INVALID_LENGTH, always: true })
  @Matches(VALIDATION.LABEL, { message: MESSAGE.INVALID_LABEL, always: true })
  label: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(MIN.DEFAULT, MAX.PROPERTY, { message: MESSAGE.INVALID_LENGTH, always: true })
  @Matches(VALIDATION.PROPERTY_IDENTIFIER, { message: MESSAGE.INVALID_PROPERTY_IDENTIFIER, always: true })
  propertyIdentifier: string;

  @ApiProperty()
  @IsNotEmpty()
  env: string[];

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(MIN.DEFAULT, MAX.EXPIRESIN, { message: MESSAGE.INVALID_LENGTH, always: true })
  @Matches(VALIDATION.EXPIRESIN, { message: MESSAGE.INVALID_EXPIRESIN, always: true })
  expiresIn: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  createdBy: string;
}

export class ResponseApikeyDto extends PartialType(CreateApikeyDto) {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  shortKey: string;

  expirationDate: Date;

  createdAt: Date;
}

export class DeleteApikeyDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  shortKey: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(MIN.DEFAULT, MAX.PROPERTY, { message: MESSAGE.INVALID_LENGTH, always: true })
  @Matches(VALIDATION.PROPERTY_IDENTIFIER, { message: MESSAGE.INVALID_PROPERTY_IDENTIFIER, always: true })
  propertyIdentifier: string;

  createdBy: string;
}
