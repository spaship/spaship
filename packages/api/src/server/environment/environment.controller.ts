import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateEnvironmentDto } from './environment.dto';
import { Environment } from './environment.entity';
import { EnvironmentService } from './service/environment.service';

@Controller('environment')
@ApiTags('Environment')
export class EnvironmentController {
  constructor(private readonly environmentService: EnvironmentService) { }

  @Get()
  @ApiOperation({ description: 'Get the Environments.' })
  async getAllEnvironments(): Promise<Environment[]> {
    return this.environmentService.getAllEnvironments();
  }

  @Get('/:propertyIdentifier')
  @ApiOperation({ description: 'Get Environments for the Property.' })
  async getById(@Param('propertyIdentifier') propertyIdentifier: string, @Query('isEph') isEph: boolean): Promise<Environment[]> {
    return this.environmentService.getEnvironmentByProperty(propertyIdentifier);
  }

  @Post()
  @ApiOperation({ description: 'Create a New Environment.' })
  async createEnvironment(@Body() environmentDto: CreateEnvironmentDto): Promise<Environment> {
    return this.environmentService.createEnvironment(environmentDto);
  }
}
