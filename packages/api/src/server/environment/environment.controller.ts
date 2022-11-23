import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthenticationGuard } from '../auth/auth.guard';
import { CreateEnvironmentDto, SyncEnvironmentDto } from './environment.dto';
import { Environment } from './environment.entity';
import { EnvironmentService } from './service/environment.service';

@Controller('environment')
@ApiTags('Environment')
@UseGuards(AuthenticationGuard)
export class EnvironmentController {
  constructor(private readonly environmentService: EnvironmentService) {}

  @Get()
  @ApiOperation({ description: 'Get the Environments.' })
  async getAllEnvironments(): Promise<Environment[]> {
    return this.environmentService.getAllEnvironments();
  }

  @Get('/:propertyIdentifier')
  @ApiOperation({ description: 'Get Environments for the Property.' })
  async getById(@Param('propertyIdentifier') propertyIdentifier: string, @Query('isEph') isEph: string): Promise<Environment[]> {
    return this.environmentService.getEnvironmentByProperty(propertyIdentifier, isEph);
  }

  @Post()
  @ApiOperation({ description: 'Create a New Environment.' })
  async createEnvironment(@Body() environmentDto: CreateEnvironmentDto): Promise<Environment> {
    return this.environmentService.createEnvironment(environmentDto);
  }

  @Post('/sync')
  @ApiOperation({ description: 'Sync Environment.' })
  async syncEnvironment(@Body() syncEnvironmentDto: SyncEnvironmentDto): Promise<Environment> {
    return this.environmentService.syncEnvironment(syncEnvironmentDto);
  }

  @Get('/delete/:propertyIdentifier/:env')
  @ApiOperation({ description: 'Delete environment for Property (Ephemeral).' })
  async deleteProperty(@Param('propertyIdentifier') propertyIdentifier: string, @Param('env') env: string) {
    return this.environmentService.deleteEnvironment(propertyIdentifier, env);
  }
}
