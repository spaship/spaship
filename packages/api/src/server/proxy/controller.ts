import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProxyService } from './service';
import { AuthGuard } from '@nestjs/passport';
import { AuthenticationGuard } from '../auth/guard';

@Controller('proxy')
@ApiTags('ProxyController')
@UseGuards(AuthenticationGuard)
export class ProxyController {
  constructor(private readonly proxyService: ProxyService) {}

  @Get('incidents.json')
  @ApiOperation({ description: 'Get the incidents.' })
  public async getStatusPageData() {
    return await this.proxyService.fetchIncidents();
  }

  @Post('incidents')
  @ApiOperation({ description: 'Create a new incident.' })
  public async createProxy(@Body() data: any) {
    return await this.proxyService.createIncident(data);
  }

  @Patch('incidents/:incidentId')
  @ApiOperation({ description: 'Update an existing incident.' })
  public async updateProxy(@Param('incidentId') incidentId: string, @Body() data: any) {
    return await this.proxyService.updateIncident(incidentId, data);
  }

  @Delete('incidents/:incidentId.json')
  @ApiOperation({ description: 'Delete a incident.' })
  public async deleteProxy(@Param('incidentId') incidentId: string) {
    return await this.proxyService.deleteIncident(incidentId);
  }

  @Get('components')
  @ApiOperation({ description: 'Get the components.' })
  public async getComponenets() {
    return await this.proxyService.fetchComponents();
  }
}
