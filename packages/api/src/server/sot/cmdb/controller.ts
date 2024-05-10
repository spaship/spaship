import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Application } from 'src/server/application/entity';
import { AuthenticationGuard } from 'src/server/auth/guard';
import { CMDBDTO, CMDBResponse } from './dto';
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

  @Post('/cmdb/applications')
  @ApiCreatedResponse({ status: 201, description: 'CMDB Details save for the applications.', type: Application, isArray: true })
  @ApiOperation({ description: 'Search the user details from CMDB.' })
  async updateApplicationCMDBCode(@Body() cmdbRequest: CMDBDTO): Promise<Application[]> {
    return this.cmdbService.updateApplicationCMDBCode(cmdbRequest);
  }

  @Post('/cmdb/property')
  @ApiCreatedResponse({ status: 201, description: 'CMDB Details save for the applications.', type: Application, isArray: true })
  @ApiOperation({ description: 'Search the user details from CMDB.' })
  async propertyDetails(@Body() cmdbRequest: CMDBDTO): Promise<any> {
    return this.cmdbService.updatePropertyCMDBCode(cmdbRequest);
  }
}
