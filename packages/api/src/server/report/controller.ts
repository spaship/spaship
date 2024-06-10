import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthenticationGuard } from 'src/server/auth/guard';
import { ReportService } from './service';
import { ReportDetails } from './response.dto';

@Controller('report')
@ApiTags('Report')
@UseGuards(AuthenticationGuard)
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get('')
  @ApiOperation({ description: 'SPAship overall report' })
  @ApiCreatedResponse({ status: 200, description: 'Report for SPAship properties.', type: ReportDetails })
  async getReport(@Query('exclude') exclude: string): Promise<ReportDetails[]> {
    return this.reportService.getReport(exclude);
  }
}
