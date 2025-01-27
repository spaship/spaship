import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { HealthCheckService, MongooseHealthIndicator } from '@nestjs/terminus';
import { PROXY_CHECK } from 'src/configuration';
import { LoggerService } from 'src/configuration/logger/service';
import { ExceptionsService } from 'src/server/exceptions/service';

@Injectable()
export class HealthService {
  constructor(private healthCheck: HealthCheckService,
    private mongooseHealth: MongooseHealthIndicator,
    private logger: LoggerService,
    private httpService: HttpService,
    private exceptionsService: ExceptionsService) { }

  async databaseStatus() {
    return this.healthCheck.check([() => this.mongooseHealth.pingCheck('mongoDB')]);
  }

  async apiStatus() {
    try {
      const response = await this.httpService.axiosRef.get(
        PROXY_CHECK.url,
        {
          headers: {
            Authorization: `${PROXY_CHECK.authToken}`
          }
        }
      );
      this.logger.log('Response', response.data);
      return response.data;
    } catch (err) {
      this.logger.error('Error fetching API status', err);
      this.exceptionsService.badRequestException({ message: 'Error in fetching report. Failed.' });
    }
  }

}
