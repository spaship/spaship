import { Controller, Get, Query } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ReportService } from './service';
import { ReportDetails } from './response.dto';

@Controller('report')
@ApiTags('Report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get('')
  @ApiOperation({ description: 'SPAship overall report' })
  @ApiCreatedResponse({ status: 200, description: 'Report for SPAship properties.', type: ReportDetails })
  async getReport(@Query('exclude') exclude: string): Promise<ReportDetails[]> {
    return this.reportService.getReport(exclude);
  }
}
