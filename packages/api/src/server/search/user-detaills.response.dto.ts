import { ApiProperty } from '@nestjs/swagger';

export class UserDetails {
  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;
}
