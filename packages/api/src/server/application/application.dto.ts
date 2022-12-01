import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Matches, Length } from 'class-validator';
import { MAX, MESSAGE, MIN, VALIDATION } from 'src/configuration';

export class CreateApplicationDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(MIN.DEFAULT, MAX.NAME, { message: `Name ${MESSAGE.INVALID_LENGTH} [Min : ${MIN.DEFAULT}, Max : ${MAX.NAME}]`, always: true })
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(MIN.PATH, MAX.PATH, { message: `Path ${MESSAGE.INVALID_LENGTH} [Min : ${MIN.PATH}, Max : ${MAX.PATH}]`, always: true })
  @Matches(VALIDATION.PATH, { message: MESSAGE.INVALID_PATH, always: true })
  path: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Length(MIN.DEFAULT, MAX.REF, { message: `Ref ${MESSAGE.INVALID_LENGTH} [Min : ${MIN.ACTIONID}, Max : ${MAX.REF}]`, always: true })
  ref: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Length(MIN.DEFAULT, MAX.DEFAULT, { message: MESSAGE.INVALID_LENGTH, always: true })
  @Matches(VALIDATION.EPHEMERAL, { message: MESSAGE.INVALID_EPHEMREAL, always: true })
  ephemeral: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Length(MIN.ACTIONID, MAX.DEFAULT, { message: `ActionId ${MESSAGE.INVALID_LENGTH} [Min : ${MIN.ACTIONID}, Max : ${MAX.DEFAULT}]`, always: true })
  @Matches(VALIDATION.ACTIONID, { message: MESSAGE.INVALID_ACTION_ID, always: true })
  actionId: string;

  createdBy: string;
}

export class UpdateApplicationDto extends PartialType(CreateApplicationDto) {}

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
