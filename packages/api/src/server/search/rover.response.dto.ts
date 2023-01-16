import { ApiProperty } from '@nestjs/swagger';

export class Rover {
  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;
}
