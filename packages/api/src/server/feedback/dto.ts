import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class FeedbackDto {
  id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  experience: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  error: string;

  createdBy: string;
}

export class DeleteFeedbackDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}
