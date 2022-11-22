import { Controller, Get, Param, Query, Sse, UseGuards } from '@nestjs/common';
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
    @Query('applicationIdentifier') applicationIdentifier: string,
    @Query('skip') skip: number,
    @Query('limit') limit: number
  ): Promise<ActivityStream[]> {
    return this.analyticsService.getActivityStream(propertyIdentifier, applicationIdentifier, skip, limit);
  }

  @Sse('events/:propertyIdentifier')
  events(@Param('propertyIdentifier') propertyIdentifier: string) {
    return this.analyticsService.subscribe(propertyIdentifier);
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
