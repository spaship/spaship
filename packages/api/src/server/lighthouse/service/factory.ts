import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { LIGHTHOUSE_DETAILS } from 'src/configuration';
import { LoggerService } from 'src/configuration/logger/service';
import { ExceptionsService } from 'src/server/exceptions/service';
import { LighthouseMetrics, LighthouseResponseDTO } from '../dto';

@Injectable()
export class LighthouseFactory {
  constructor(
    private readonly logger: LoggerService,
    private readonly httpService: HttpService,
    private readonly exceptionService: ExceptionsService
  ) {}

  // @internal Update the secret for a Containerized application
  async registerLighthouse(request: Object): Promise<Object> {
    if (!request) this.exceptionService.badRequestException({ message: 'Please provide the request body' });
    let response;
    try {
      response = await this.httpService.axiosRef.post(`${LIGHTHOUSE_DETAILS.hostUrl}/v1/projects`, request, {
        maxBodyLength: Infinity
      });
      this.logger.log('registerLighthouseProperty', JSON.stringify(response.data));
    } catch (err) {
      this.logger.error('registerLighthouseProperty', err);
      this.exceptionService.internalServerErrorException(err);
    }
    return response.data;
  }

  // @internal Create lighthouse request for the pipeline trigger
  createLighthouseRequest(identifier: string, env: string, url: string, serverToken: string): FormData {
    const formData: any = new FormData();
    formData.append('token', LIGHTHOUSE_DETAILS.ciToken);
    formData.append('ref', 'main');
    formData.append('variables[LH_HOST]', LIGHTHOUSE_DETAILS.hostUrl);
    formData.append('variables[URL]', url);
    formData.append('variables[IDENTIFIER]', identifier);
    formData.append('variables[SERVER_BASE_URL]', LIGHTHOUSE_DETAILS.hostUrl);
    formData.append('variables[SERVER_TOKEN]', serverToken);
    return formData;
  }

  // @internal Get the List of the Pods from the Operator
  async generateLighthouseReport(request: FormData): Promise<Object> {
    if (!request) this.exceptionService.badRequestException({ message: 'Please provide the request object' });
    let response;
    try {
      response = await this.httpService.axiosRef.post(LIGHTHOUSE_DETAILS.ciUrl, request, {
        maxBodyLength: Infinity
      });
    } catch (err) {
      this.logger.error('generateLighthouseReport', err);
      this.exceptionService.badRequestException({ message: `Report Generation Failed.` });
    }
    return response.data ? { projectId: response.data.project_id, pipelineId: response.data.id } : {};
  }

  // @internal Get the report details of the build for an application
  async getLighthouseReportDetails(projectId: string, buildId: string): Promise<String[]> {
    if (!projectId) this.exceptionService.badRequestException({ message: 'Please provide the projectId' });
    if (!buildId) this.exceptionService.badRequestException({ message: 'Please provide the buildId' });
    let response;
    try {
      response = await this.httpService.axiosRef.get(`${LIGHTHOUSE_DETAILS.hostUrl}/v1/projects/${projectId}/builds/${buildId}/runs`);
    } catch (err) {
      this.logger.error('getLighthouseReportDetails', err);
      this.exceptionService.badRequestException({ message: `Error in fetching report Failed.` });
    }
    return response.data || [];
  }

  // @internal Get the list of the build for an application
  async getLighthouseReportList(projectId: string, identifier: string): Promise<String[]> {
    if (!projectId) this.exceptionService.badRequestException({ message: 'Please provide the projectId' });
    if (!identifier) this.exceptionService.badRequestException({ message: 'Please provide the identifier' });
    let response;
    try {
      response = await this.httpService.axiosRef.get(`${LIGHTHOUSE_DETAILS.hostUrl}/v1/projects/${projectId}/builds?branch=${identifier}`);
    } catch (err) {
      this.logger.error('getLighthouseReportList', err);
      this.exceptionService.badRequestException({ message: `Error in fetching report Failed.` });
    }
    return response.data || [];
  }

  // @internal Build the reponse for the lighthouse
  buildLighthouseReportResponse(reposne, propertyIdentifier: string, identifier: string, env: string): LighthouseResponseDTO[] {
    const reportDetails = [];
    for (const report of reposne) {
      const lhReport = new LighthouseResponseDTO();
      lhReport.lhProjectId = report.projectId;
      lhReport.lhBuildId = report.buildId || report.id;
      lhReport.ciBuildURL = report.externalBuildUrl;
      lhReport.propertyIdentifier = propertyIdentifier;
      lhReport.identifier = identifier;
      lhReport.env = env;
      if (report.lhr) lhReport.metrics = this.buildMetrics(report.lhr);
      lhReport.createdAt = report.createdAt;
      lhReport.updatedAt = report.updatedAt;
      reportDetails.push(lhReport);
    }
    return reportDetails;
  }

  // @internal Extract the required values from the lighthouse report
  private buildMetrics(lhr: string) {
    const metricFilter = [
      'performance',
      'accessibility',
      'best-practices',
      'seo',
      'pwa',
      'first-contentful-paint',
      'first-meaningful-paint',
      'largest-contentful-paint',
      'speed-index',
      'total-blocking-time',
      'cumulative-layout-shift'
    ];
    const metrics = JSON.parse(lhr);
    const lhMetrics = new LighthouseMetrics();
    lhMetrics.performance = metrics.categories[metricFilter[0]].score;
    lhMetrics.accessibility = metrics.categories[metricFilter[1]].score;
    lhMetrics.bestPractices = metrics.categories[metricFilter[2]].score;
    lhMetrics.seo = metrics.categories[metricFilter[3]].score;
    lhMetrics.pwa = metrics.categories[metricFilter[4]].score;
    lhMetrics.firstContentfulPaint = metrics.audits[metricFilter[5]].numericValue;
    lhMetrics.firstMeaningfulPaint = metrics.audits[metricFilter[6]].numericValue;
    lhMetrics.largestContentfulPaint = metrics.audits[metricFilter[7]].numericValue;
    lhMetrics.speedIndex = metrics.audits[metricFilter[8]].numericValue;
    lhMetrics.totalBlockingTime = metrics.audits[metricFilter[9]].numericValue;
    lhMetrics.cumulativeLayoutShift = metrics.audits[metricFilter[10]].numericValue;
    return lhMetrics;
  }

  generateLighthouseIdentifier(identifier: string, env: string, isContainerized: boolean, isGit: boolean, version: number): string {
    if (!isContainerized && !isGit) return `${identifier}_${env}_static_${version}`;
    if (isContainerized && isGit) return `${identifier}_${env}_git${version}`;
    return `${identifier}_${env}_containerized_${version}`;
  }

  // @internal Check the source for a particular url
  async checkUrlSource(url: string) {
    try {
      await this.httpService.axiosRef.head(url);
    } catch (error) {
      this.exceptionService.badRequestException({ message: 'Application not running' });
    }
  }
}
