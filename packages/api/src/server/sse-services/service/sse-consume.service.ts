import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import * as EventSource from 'eventsource';
import { LoggerService } from 'src/configuration/logger/logger.service';
import { IDataServices } from 'src/repository/data-services.abstract';
import { EventTimeTrace } from '../event-time-trace.entity';
import { Event } from '../event.entity';

@Injectable()
export class SSEConsumeService implements OnApplicationBootstrap {
  constructor(private dataServices: IDataServices, private loggerService: LoggerService) {}

  async onApplicationBootstrap() {
    const deploymentConnections = await this.dataServices.deploymentConnection.getAll();
    deploymentConnections.forEach((connection) => {
      this.loggerService.log('DeploymentConnection', JSON.stringify(connection));
      const eventUrl = `${connection.baseurl}/api/event`;
      const tmpDataService = this.dataServices;
      const tmpLoggerService = this.loggerService;
      new EventSource(eventUrl).onmessage = async function (eventResponse) {
        tmpLoggerService.log('EventSource', eventUrl);
        tmpLoggerService.log('EventResponse', eventResponse.data);
        const response = JSON.parse(eventResponse.data);
        const event = processEvent(response);
        tmpLoggerService.log('Event', JSON.stringify(event));
        await tmpDataService.event.create(event);
        if (event.code === 'APPLICATION_CREATED') {
          const searchApplication = { propertyIdentifier: event.propertyIdentifier, env: event.env, identifier: event.applicationName };
          const latestApplication = (await tmpDataService.applications.getByAny(searchApplication))[0];
          if (!latestApplication?.accessUrl) return;
          latestApplication.accessUrl = event.accessUrl;
          latestApplication.ref = latestApplication.nextRef;
          await tmpDataService.applications.updateOneByAny(searchApplication, latestApplication);
          tmpLoggerService.log('UpdatedApplication', JSON.stringify(latestApplication));
          const eventRequest = (await tmpDataService.event.getByAny({ traceId: response.uuid }))[0];
          const currentTime = new Date();
          const diff = (eventRequest.createdAt.getTime() - currentTime.getTime()) / 1000;
          const consumedTime = Math.abs(diff).toString();
          tmpLoggerService.log('TimeToDeploy', `${consumedTime} seconds`);
          const eventTimeTrace = processDeploymentTime(event, consumedTime);
          await tmpDataService.eventTimeTrace.create(eventTimeTrace);
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
  eventTimeTrace.applicationName = event.applicationName;
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

function getCode(state: string): string {
  const property = { APPLICATION_CREATED: 'APPLICATION_CREATED', APPLICATION_CREATION_STARTED: 'APPLICATION_CREATION_STARTED' };
  if (state === 'spa deployment ops performed') return property.APPLICATION_CREATED;
  return property.APPLICATION_CREATION_STARTED;
}

function processEvent(response: any): Event {
  const NA = 'NA';
  const event = new Event();
  event.propertyIdentifier = response?.websiteName || NA;
  event.applicationName = response?.spaName || NA;
  event.version = response?.applicationName || 'v1';
  event.env = response?.environmentName || NA;
  event.branch = response?.environmentName || 'main';
  event.state = response.state;
  event.path = getPath(response.contextPath);
  event.accessUrl = getUrl(response.accessUrl);
  event.code = getCode(response.state);
  event.traceId = response?.uuid;
  return event;
}
