import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthenticationGuard } from '../auth/guard';
import { ProxyService } from './service';

@Controller('proxy')
@ApiTags('ProxyController')
@UseGuards(AuthenticationGuard)
export class ProxyController {
  constructor(private readonly proxyService: ProxyService) {}

  @Get('incidents.json')
  @ApiOperation({ description: 'Get the incidents.' })
  public async getStatusPageData() {
    return this.proxyService.fetchIncidents();
  }

  @Post('incidents')
  @ApiOperation({ description: 'Create a new incident.' })
  public async createProxy(@Body() data: any) {
    return this.proxyService.createIncident(data);
  }

  @Patch('incidents/:incidentId')
  @ApiOperation({ description: 'Update an existing incident.' })
  public async updateProxy(@Param('incidentId') incidentId: string, @Body() data: any) {
    return this.proxyService.updateIncident(incidentId, data);
  }

  @Delete('incidents/:incidentId.json')
  @ApiOperation({ description: 'Delete a incident.' })
  public async deleteProxy(@Param('incidentId') incidentId: string) {
    return this.proxyService.deleteIncident(incidentId);
  }

  @Get('components')
  @ApiOperation({ description: 'Get the components.' })
  public async getComponenets() {
    return this.proxyService.fetchComponents();
  }
}
