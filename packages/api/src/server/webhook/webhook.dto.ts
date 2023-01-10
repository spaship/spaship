import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';
import { MAX, MESSAGE, MIN } from 'src/configuration';

export class CreateWebhookDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  propertyIdentifier: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  actions: string[];

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(MIN.DEFAULT, MAX.DEFAULT, { message: MESSAGE.INVALID_LENGTH, always: true })
  url: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  createdBy: string;
}

export class UpdateWebhookDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  propertyIdentifier: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  identifier: string;

  @ApiProperty()
  @IsNotEmpty()
  actions: string[];

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(MIN.DEFAULT, MAX.DEFAULT, { message: MESSAGE.INVALID_LENGTH, always: true })
  url: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  updatedBy: string;
}
