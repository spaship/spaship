import { ApiProperty } from '@nestjs/swagger';

export class CMDBResponse {
  @ApiProperty()
  name: string;

  @ApiProperty()
  code: string;

  @ApiProperty()
  url: string;

  @ApiProperty()
  severity: string;

  @ApiProperty()
  email: string;
}
