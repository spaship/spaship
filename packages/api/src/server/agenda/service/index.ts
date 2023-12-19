import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { Agenda } from 'agenda';
import { DATA_BASE_CONFIGURATION, JOB } from 'src/configuration';
import { LoggerService } from 'src/configuration/logger/service';
import { EnvironmentService } from '../../environment/service';
import { ExceptionsService } from '../../exceptions/service';

@Injectable()
export class AgendaService implements OnApplicationBootstrap {
  public agenda: Agenda;

  constructor(
    private readonly loggerService: LoggerService,
    private readonly environmentService: EnvironmentService,
    private readonly exceptionService: ExceptionsService
  ) {}

  async onApplicationBootstrap() {
    this.agenda = await new Agenda({
      db: { address: DATA_BASE_CONFIGURATION.mongoConnectionString, collection: 'agenda' },
      processEvery: '30 seconds'
    });
    await this.agenda.start();
    this.loggerService.log('Agenda', 'Agenda Server started.');

    await this.agenda.define(JOB.DELETE_EPH_ENV, async (job) => {
      this.loggerService.log('AgendaJob', JSON.stringify(job));
      const { propertyIdentifier, env } = job.attrs.data;
      if (!env.includes('ephemeral')) this.exceptionService.badRequestException({ message: 'Only Ephemeral Environment can be deleted.' });
      try {
        const response = await this.environmentService.deleteEnvironment(propertyIdentifier, env);
        this.loggerService.log('DeletedProps', JSON.stringify(response));
      } catch (err) {
        this.exceptionService.internalServerErrorException(err);
      }
    });
  }
}
