import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class FeedbackDto {
  id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  experience: string;

  createdBy: string;
}

export class DeleteFeedbackDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}
