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

  async getReport(exclude: string): Promise<ReportDetails[]> {
    const properties = await this.propertyService.getAllProperties();
    const query = await this.reportFactory.getReportQuerty();
    const data = await this.dataServices.application.aggregate(query);
    const processedReport = this.reportFactory.processReport(properties, data, exclude);
    return processedReport;
  }
}
