import { Injectable } from '@nestjs/common';
import { IDataServices } from 'src/repository/data-services.abstract';
import { ApplicationService } from 'src/server/application/service';
import { PropertyService } from 'src/server/property/service';
import { ReportDetails } from '../response.dto';
import { ReportFactory } from './factory';

@Injectable()
export class ReportService {
  constructor(
    private readonly dataServices: IDataServices,
    readonly applicationService: ApplicationService,
    readonly propertyService: PropertyService,
    readonly reportFactory: ReportFactory
  ) {}

  private static readonly defaultSkip: number = 0;

  private static readonly defaultLimit: number = 100;

  async getReport(exclude: string, skip: number = ReportService.defaultSkip, limit: number = ReportService.defaultLimit): Promise<ReportDetails[]> {
    limit = Number(limit);
    skip = Number(skip);
    if (Number.isNaN(limit) || limit <= 0) limit = ReportService.defaultLimit;
    if (Number.isNaN(skip) || skip <= 0) skip = ReportService.defaultSkip;
    const properties = await this.propertyService.getAllProperties(skip, limit);
    const query = await this.reportFactory.getReportQuerty();
    const data = await this.dataServices.application.aggregate(query);
    const processedReport = this.reportFactory.processReport(properties, data, exclude);
    return processedReport;
  }
}
