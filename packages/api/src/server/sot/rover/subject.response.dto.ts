import { ApiProperty } from '@nestjs/swagger';

export class Subject {
  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;
}
