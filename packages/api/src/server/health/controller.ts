import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SPASHIP_VERSION } from 'src/configuration';
import { HealthService } from './service';

@Controller('health-check')
@ApiTags('HealthCheck')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOperation({ description: 'Get the Health Status of the instance.' })
  public async getInstanceHealth() {
    return { message: `SPAship Orchestrator Version ${SPASHIP_VERSION} is Running` };
  }

  @Get('database')
  @ApiOperation({ description: 'Get the Health Status of the database.' })
  public async getDatabaseHealth() {
    return this.healthService.databaseStatus();
  }
}
