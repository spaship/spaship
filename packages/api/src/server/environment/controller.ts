import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthenticationGuard } from '../auth/guard';
import { CreateEnvironmentDto, SymlinkDTO, SyncEnvironmentDto } from './dto';
import { Environment } from './entity';
import { EnvironmentService } from './service';

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

  @Get('/property/:propertyIdentifier')
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

  @Post('/symlink')
  @ApiOperation({ description: 'Symlink Environment.' })
  async symlinkEnvironment(@Body() symlinkDTO: SymlinkDTO): Promise<Environment> {
    return this.environmentService.updateSymlink(symlinkDTO);
  }

  @Delete('/:propertyIdentifier/:env')
  @ApiOperation({ description: 'Delete environment for Property (Ephemeral).' })
  async deleteEnvironment(@Param('propertyIdentifier') propertyIdentifier: string, @Param('env') env: string) {
    return this.environmentService.deleteEnvironment(propertyIdentifier, env);
  }

  @Put()
  @ApiOperation({ description: 'Update a New Environment.' })
  async updateEnvironment(@Body() environmentDto: CreateEnvironmentDto): Promise<Environment> {
    return this.environmentService.updateEnvironment(environmentDto);
  }

  @Get('/git')
  @ApiOperation({ description: 'Get Environments for the Repository.' })
  async getByRepoUrl(@Query('repoUrl') repoUrl: string, @Query('contextDir') contextDir: string): Promise<Environment[]> {
    return this.environmentService.getEnvironmentByRepositoryUrl(repoUrl, contextDir);
  }
}
