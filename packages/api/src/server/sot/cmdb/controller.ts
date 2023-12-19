import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthenticationGuard } from 'src/server/auth/guard';
import { CMDBResponse } from './dto';
import { CMDBService } from './service';

@Controller('sot')
@ApiTags('SOT')
@UseGuards(AuthenticationGuard)
export class CMDBController {
  constructor(private readonly cmdbService: CMDBService) {}

  @Get('/cmdb')
  @ApiCreatedResponse({ status: 201, description: 'CMDB Details.', type: CMDBResponse, isArray: true })
  @ApiOperation({ description: 'Search the user details from CMDB.' })
  async getCMDBUserDetails(@Query('code') code: string, @Query('name') name: string): Promise<CMDBResponse[]> {
    if (code) return this.cmdbService.getCMDBDetailsByCode(code);
    return this.cmdbService.getCMDBDetailsByName(name);
  }
}
