import { Body, Controller, Get, Param, Post, Delete, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ActivityStream } from './activity-stream.entity';
import { AnalyticsService } from './service/analytics.service';

@Controller('analyitics')
@ApiTags('Analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) { }

  @Get('/activity-stream')
  @ApiOperation({ description: 'Get the Activity Stream.' })
  async getApiKeyByProperty(@Query('propertyIdentifier') propertyIdentifier: string): Promise<ActivityStream[]> {
    return this.analyticsService.getActivityStream(propertyIdentifier);
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
