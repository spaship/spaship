import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import * as EventSource from 'eventsource';
import { LoggerService } from 'src/configuration/logger/logger.service';
import { IDataServices } from 'src/repository/data-services.abstract';
import { Action } from 'src/server/analytics/activity-stream.entity';
import { AnalyticsService } from 'src/server/analytics/service/analytics.service';
import { EventTimeTrace } from '../event-time-trace.entity';
import { Event } from '../event.entity';

@Injectable()
export class EventService implements OnApplicationBootstrap {
  constructor(
    private readonly dataServices: IDataServices,
    private readonly analyticsService: AnalyticsService,
    private readonly logger: LoggerService
  ) {}

  async onApplicationBootstrap() {
    const deploymentConnections = await this.dataServices.deploymentConnection.getAll();
    deploymentConnections.forEach((connection) => {
      this.logger.log('DeploymentConnection', JSON.stringify(connection));
      const eventUrl = `${connection.baseurl}/api/event`;
      const tmpDataService = this.dataServices;
      const tmpLoggerService = this.logger;
      const tmpAnalyticsService = this.analyticsService;
      new EventSource(eventUrl).onmessage = async function (eventResponse) {
        tmpLoggerService.log('EventSource', eventUrl);
        tmpLoggerService.log('EventResponse', eventResponse.data);
        const response = JSON.parse(eventResponse.data);
        const event = processEvent(response);
        tmpLoggerService.log('Event', JSON.stringify(event));
        await tmpDataService.event.create(event);
        if (event.action === Action.APPLICATION_DEPLOYED) {
          const searchApplication = { propertyIdentifier: event.propertyIdentifier, env: event.env, identifier: event.applicationIdentifier };
          const latestApplication = (await tmpDataService.application.getByAny(searchApplication))[0];
          if (!latestApplication?.accessUrl) return;
          latestApplication.accessUrl = event.accessUrl;
          latestApplication.ref = latestApplication.nextRef;
          await tmpDataService.application.updateOneByAny(searchApplication, latestApplication);
          tmpLoggerService.log('UpdatedApplication', JSON.stringify(latestApplication));
          const eventRequest = (await tmpDataService.event.getByAny({ traceId: response.uuid }))[0];
          const currentTime = new Date();
          const diff = (eventRequest.createdAt.getTime() - currentTime.getTime()) / 1000;
          const consumedTime = Math.abs(diff).toString();
          tmpLoggerService.log('TimeToDeploy', `${consumedTime} seconds`);
          const eventTimeTrace = processDeploymentTime(event, consumedTime);
          const message = `Deployment Time : ${consumedTime} seconds`;
          await tmpDataService.eventTimeTrace.create(eventTimeTrace);
          await tmpAnalyticsService.createActivityStream(
            event.propertyIdentifier,
            Action.APPLICATION_DEPLOYED,
            event.env,
            event.applicationIdentifier,
            message
          );
        }
      };
    });
  }
}

function processDeploymentTime(event: Event, consumedTime: string): EventTimeTrace {
  const eventTimeTrace = new EventTimeTrace();
  eventTimeTrace.traceId = event.traceId;
  eventTimeTrace.propertyIdentifier = event.propertyIdentifier;
  eventTimeTrace.env = event.env;
  eventTimeTrace.applicationIdentifier = event.applicationIdentifier;
  eventTimeTrace.consumedTime = consumedTime;
  return eventTimeTrace;
}

function getPath(contextPath: string): string {
  if (contextPath == null) return 'NA';
  if (contextPath == 'ROOTSPA') return '/';
  return `/${contextPath}`;
}

function getUrl(accessUrl: string): string {
  return accessUrl == null ? 'NA' : accessUrl;
}

function getAction(state: string): string {
  if (state === 'spa deployment ops performed') return Action.APPLICATION_DEPLOYED;
  return Action.APPLICATION_DEPLOYMENT_STARTED;
}

function processEvent(response: any): Event {
  const NA = 'NA';
  const event = new Event();
  event.propertyIdentifier = response?.websiteName || NA;
  event.applicationIdentifier = response?.spaName || NA;
  event.version = response?.applicationIdentifier || 'v1';
  event.env = response?.environmentName || NA;
  event.branch = response?.environmentName || 'main';
  event.state = response.state;
  event.path = getPath(response.contextPath);
  event.accessUrl = getUrl(response.accessUrl);
  event.action = getAction(response.state);
  event.traceId = response?.uuid;
  return event;
}
