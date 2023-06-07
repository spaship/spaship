import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SPASHIP_VERSION } from 'src/configuration';

@Controller('health-check')
@ApiTags('HealthCheck')
export class HealthController {
  @Get()
  @ApiOperation({ description: 'Get the Health Status.' })
  public getHealth() {
    return { message: `SPAship Orchestrator Version ${SPASHIP_VERSION} is Running` };
  }
}
