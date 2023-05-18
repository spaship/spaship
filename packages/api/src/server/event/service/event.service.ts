import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import * as EventSource from 'eventsource';
import { LoggerService } from 'src/configuration/logger/logger.service';
import { IDataServices } from 'src/repository/data-services.abstract';
import { Action } from 'src/server/analytics/activity-stream.entity';
import { AnalyticsService } from 'src/server/analytics/service/analytics.service';
import { Source } from 'src/server/property/property.entity';
import { EventTimeTrace } from '../event-time-trace.entity';
import { Event } from '../event.entity';

@Injectable()
export class EventService implements OnApplicationBootstrap {
  constructor(
    private readonly dataServices: IDataServices,
    private readonly analyticsService: AnalyticsService,
    private readonly logger: LoggerService
  ) {}

  /* @internal
   * It'll open the connection for all the registered deployment url
   * All the events related to deployment will be consumed and saved
   * Process event for activity stream and final acknowledgement of deployment
   * Calculate deployment time for the application
   */
  async onApplicationBootstrap() {
    const deploymentConnections = await this.dataServices.deploymentConnection.getAll();
    deploymentConnections.forEach((connection) => {
      this.logger.log('DeploymentConnection', JSON.stringify(connection));
      const eventUrl = `${connection.baseurl}/api/event`;
      const tmpDataService = this.dataServices;
      const tmpLogger = this.logger;
      const tmpAnalyticsService = this.analyticsService;
      new EventSource(eventUrl).onmessage = async function consume(eventResponse) {
        tmpLogger.log('EventSource', eventUrl);
        tmpLogger.log('EventResponse', eventResponse.data);
        const response = JSON.parse(eventResponse.data);
        const event = processEvent(response);
        tmpLogger.log('Event', JSON.stringify(event));
        await tmpDataService.event.create(event);
        /* @internal
         * Post deployment jobs
         * Update the lasted deployed version & access url to the application
         * Calculate the time consumed for deploying an application
         */
        if (event.action === Action.APPLICATION_DEPLOYED) {
          const searchApplication = {
            propertyIdentifier: event.propertyIdentifier,
            env: event.env,
            identifier: event.applicationIdentifier,
            isContainerized: false
          };
          const latestApplication = (await tmpDataService.application.getByAny(searchApplication))[0];
          if (!latestApplication?.accessUrl) return;
          latestApplication.accessUrl = event.accessUrl;
          latestApplication.ref = latestApplication.nextRef;
          await tmpDataService.application.updateOne(searchApplication, latestApplication);
          tmpLogger.log('UpdatedApplication', JSON.stringify(latestApplication));
          const eventRequest = (await tmpDataService.event.getByAny({ traceId: response.uuid }))[0];
          const currentTime = new Date();
          const diff = (eventRequest.createdAt.getTime() - currentTime.getTime()) / 1000;
          const consumedTime = Math.abs(diff).toFixed(2).toString();
          tmpLogger.log('TimeToDeploy', `${consumedTime} seconds`);
          const eventTimeTrace = processDeploymentTime(event, consumedTime);
          const message = `Deployment Time : ${consumedTime} seconds`;
          await tmpDataService.eventTimeTrace.create(eventTimeTrace);
          await tmpAnalyticsService.createActivityStream(
            event.propertyIdentifier,
            Action.APPLICATION_DEPLOYED,
            event.env,
            event.applicationIdentifier,
            message,
            'EventStream',
            Source.OPERATOR,
            JSON.stringify({ accessUrl: event.accessUrl, path: event.path })
          );
        } else if (event.action === Action.APPLICATION_DEPLOYMENT_FAILED) {
          await tmpAnalyticsService.createActivityStream(
            event.propertyIdentifier,
            Action.APPLICATION_DEPLOYMENT_FAILED,
            event.env,
            event.applicationIdentifier
          );
        } else if (event.action === Action.APPLICATION_BUILD_FINISHED && response?.meta?.Phase === 'Complete') {
          await tmpAnalyticsService.createActivityStream(
            event.propertyIdentifier,
            Action.APPLICATION_BUILD_FINISHED,
            event.env,
            event.applicationIdentifier,
            `Build Time : ${response.meta.DurationInSecs} seconds [${response?.meta?.Name}]`,
            'EventStream',
            Source.GIT,
            JSON.stringify(event)
          );
        } else if (event.action === Action.APPLICATION_DEPLOYMENT_STARTED) {
          await tmpAnalyticsService.createActivityStream(
            event.propertyIdentifier,
            Action.APPLICATION_DEPLOYMENT_STARTED,
            event.env,
            event.applicationIdentifier,
            `Deployment Started for ${event.applicationIdentifier} [Workflow 3.0]`,
            'EventStream',
            Source.OPERATOR,
            JSON.stringify(event)
          );
          const searchApplication = {
            propertyIdentifier: event.propertyIdentifier,
            env: event.env,
            identifier: event.applicationIdentifier,
            isContainerized: true,
            isGit: true
          };
          const latestApplication = (await tmpDataService.application.getByAny(searchApplication))[0];
          if (!latestApplication?.accessUrl) return;
          latestApplication.accessUrl = event.path;
          latestApplication.ref = latestApplication.nextRef;
          await tmpDataService.application.updateOne(searchApplication, latestApplication);
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

/* @internal
 * '/' is mapped with 'ROOTSPA' in the deployment Engine
 * Rest all paths will be added followed by '/'
 */
function getPath(contextPath: string): string {
  if (contextPath === null) return 'NA';
  if (contextPath === 'ROOTSPA') return '/';
  return `/${contextPath}`;
}

function getUrl(accessUrl: string): string {
  return accessUrl === null ? 'NA' : accessUrl;
}

// @internal Final acknowledgement for application deployment
function getAction(state: string): string {
  // @internal States for Static Deployment
  if (state === 'spa deployment ops performed') return Action.APPLICATION_DEPLOYED;
  if (state === 'spa deployment ops failed') return Action.APPLICATION_DEPLOYMENT_FAILED;
  // @internal State for Workflow 3.0 Deployment
  if (state === 'DEPLOYMENT_STARTED') return Action.APPLICATION_DEPLOYMENT_STARTED;
  if (state === 'BUILD_ENDED') return Action.APPLICATION_BUILD_FINISHED;
  return Action.APPLICATION_DEPLOYMENT_PROCESSING;
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
