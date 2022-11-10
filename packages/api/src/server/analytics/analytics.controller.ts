import { Controller, Get, Query, Sse, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthenticationGuard } from '../auth/auth.guard';
import { ActivityStream } from './activity-stream.entity';
import { AnalyticsService } from './service/analytics.service';

@Controller('analytics')
@ApiTags('Analytics')
@UseGuards(AuthenticationGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('/activity-stream')
  @ApiOperation({ description: 'Get the Activity Stream.' })
  async getApiKeyByProperty(
    @Query('propertyIdentifier') propertyIdentifier: string,
    @Query('applicationIdentifier') applicationIdentifier: string
  ): Promise<ActivityStream[]> {
    return this.analyticsService.getActivityStream(propertyIdentifier, applicationIdentifier);
  }

  @Sse('events')
  events() {
    return this.analyticsService.subscribe();
  }

  @Get('/deployment/count')
  @ApiOperation({ description: 'Get the Deployment Count.' })
  async getDeploymentCount(@Query('propertyIdentifier') propertyIdentifier: string): Promise<any> {
    return this.analyticsService.getDeploymentCount(propertyIdentifier);
  }

  @Get('/deployment/env')
  @ApiOperation({ description: 'Get the Deployment Count for the Environment.' })
  async getDeploymentCountForEnv(
    @Query('propertyIdentifier') propertyIdentifier: string,
    @Query('applicationIdentifier') applicationIdentifier: string
  ): Promise<any> {
    return this.analyticsService.getDeploymentCountForEnv(propertyIdentifier, applicationIdentifier);
  }

  @Get('/deployment/env/month')
  @ApiOperation({ description: 'Get the Deployment Count for the Environment.' })
  async getMonthlyDeploymentCount(
    @Query('propertyIdentifier') propertyIdentifier: string,
    @Query('applicationIdentifier') applicationIdentifier: string
  ): Promise<any> {
    return this.analyticsService.getMonthlyDeploymentCount(propertyIdentifier, applicationIdentifier);
  }
}
