import { Controller, Get, Param, Query, Sse, UseGuards } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthenticationGuard } from '../auth/guard';
import { ActivityStream } from './entity';
import { DeploymentCount } from './deployment-count-response.dto';
import { DeploymentTime } from './deployment-time-response.dto';
import { AnalyticsService } from './service';
import { UserAnalytics } from './user-analytics-response.dto';

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
    @Query('action') action: string,
    @Query('skip') skip: number,
    @Query('limit') limit: number
  ): Promise<ActivityStream[]> {
    return this.analyticsService.getActivityStream(propertyIdentifier, applicationIdentifier, action, skip, limit);
  }

  @Sse('events/:propertyIdentifier')
  events(@Param('propertyIdentifier') propertyIdentifier: string) {
    return this.analyticsService.subscribe(propertyIdentifier);
  }

  @Get('/deployment/count')
  @ApiCreatedResponse({ status: 200, description: 'Get the Deployment Count for all the Properties.', type: DeploymentCount, isArray: true })
  @ApiOperation({ description: 'Get the Deployment Count for all the Properties.' })
  async getDeploymentCount(@Query('propertyIdentifier') propertyIdentifier: string): Promise<DeploymentCount[]> {
    return this.analyticsService.getDeploymentCount(propertyIdentifier);
  }

  @Get('/deployment/env')
  @ApiCreatedResponse({
    status: 200,
    description: 'Get the Deployment Count for the Environments of the Properties.',
    type: DeploymentCount,
    isArray: true
  })
  @ApiOperation({ description: 'Get the Deployment Count for the Environments of the Properties.' })
  async getDeploymentCountForEnv(
    @Query('propertyIdentifier') propertyIdentifier: string,
    @Query('applicationIdentifier') applicationIdentifier: string
  ): Promise<DeploymentCount[]> {
    return this.analyticsService.getDeploymentCountForEnv(propertyIdentifier, applicationIdentifier);
  }

  @Get('/deployment/env/month')
  @ApiOperation({ description: 'Get the Deployment Count for the Environment for a monhth.' })
  async getMonthlyDeploymentCount(
    @Query('propertyIdentifier') propertyIdentifier: string,
    @Query('applicationIdentifier') applicationIdentifier: string,
    @Query('previous') previous: string
  ): Promise<any> {
    return this.analyticsService.getMonthlyDeploymentCount(propertyIdentifier, applicationIdentifier, Number(previous));
  }

  @Get('/deployment/time')
  @ApiCreatedResponse({ status: 200, description: 'Details for the average time to deployment.', type: DeploymentTime })
  @ApiOperation({ description: 'Get the Average time for the Deployments & the time saved by SPAship.' })
  async getAverageDeploymentTime(
    @Query('propertyIdentifier') propertyIdentifier: string,
    @Query('days') days: number,
    @Query('isEph') isEph: string,
    @Query('save') save: boolean,
    @Query('averageDeploymentTimeInSecs') averageDeploymentTimeInSecs: string
  ): Promise<any> {
    if (save) return this.analyticsService.getDeploymentTimeSaved(averageDeploymentTimeInSecs);
    return this.analyticsService.getAverageDeploymentTime(propertyIdentifier, isEph, days);
  }

  @Get('/developer')
  @ApiCreatedResponse({ status: 200, description: 'Details for the average time to deployment.', type: DeploymentTime })
  @ApiOperation({ description: 'Get the Average time for the Deployments & the time saved by SPAship.' })
  async getDeveloperMetrics(
    @Query('month') month: string,
    @Query('cluster') cluster: string,
    @Query('type') type: string,
    @Query('averageDeploymentTimeInSecs') averageDeploymentTimeInSecs: string,
    @Query('mode') mode: string
  ): Promise<any> {
    return this.analyticsService.getDeveloperMetrics(Number(month), cluster, type, mode, averageDeploymentTimeInSecs);
  }

  @Get('/deployment/time-saved')
  @ApiCreatedResponse({ status: 200, description: 'Get the Average time for the Deployments saved by SPAship.', type: DeploymentTime })
  @ApiOperation({ description: 'Get the Average time for the Deployments saved by SPAship.' })
  async getAverageDeploymentTimeSaved(@Query('averageDeploymentTimeInSecs') averageDeploymentTimeInSecs: string): Promise<any> {
    return this.analyticsService.getDeploymentTimeSaved(averageDeploymentTimeInSecs);
  }

  @Get('/user/:email')
  @ApiOperation({ description: 'Get the analytics based on the user' })
  @ApiCreatedResponse({ status: 201, description: 'User personalised analytics.', type: Array<UserAnalytics> })
  async homePage(@Param('email') email: string): Promise<UserAnalytics[]> {
    return this.analyticsService.getUserPropertyDetails(email);
  }
}
