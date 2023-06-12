import { Injectable } from '@nestjs/common';
import { HealthCheckService, MongooseHealthIndicator } from '@nestjs/terminus';

@Injectable()
export class HealthService {
  constructor(private healthCheck: HealthCheckService, private mongooseHealth: MongooseHealthIndicator) {}

  async databaseStatus() {
    return this.healthCheck.check([() => this.mongooseHealth.pingCheck('mongoDB')]);
  }
}
