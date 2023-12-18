import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthenticationGuard } from 'src/server/auth/guard';
import { LighthouseResponseDTO, LighthouseRequestDTO } from './dto';
import { LighthouseService } from './service';

@Controller('lighthouse')
@ApiTags('Lighthouse')
@UseGuards(AuthenticationGuard)
export class LighthouseController {
  constructor(private readonly lighthouseService: LighthouseService) {}

  @Post('/register/:propertyIdentifier')
  @ApiOperation({ description: 'Get the Build, Deployment & Pod logs.' })
  async registerLighthouse(@Param('propertyIdentifier') propertyIdentifier: string) {
    return this.lighthouseService.registerLighthouse(propertyIdentifier);
  }

  @Post('/generate')
  @ApiOperation({ description: 'Genrate the Lighthouse Report.' })
  async generateLighthouseReport(@Body() lighthouseRequestDTO: LighthouseRequestDTO): Promise<any> {
    return this.lighthouseService.generateLighthouseReport(
      lighthouseRequestDTO.propertyIdentifier,
      lighthouseRequestDTO.env,
      lighthouseRequestDTO.identifier,
      lighthouseRequestDTO.isContainerized,
      lighthouseRequestDTO.isGit,
      lighthouseRequestDTO.createdBy
    );
  }

  @Get('/:propertyIdentifier/:env/:identifier')
  @ApiOperation({ description: 'Get the Lighthouse Report.' })
  @ApiCreatedResponse({ status: 201, description: 'Lighthouse Report Generated successfully.', type: LighthouseResponseDTO })
  async getLighthouseReports(
    @Param('propertyIdentifier') propertyIdentifier: string,
    @Param('env') env: string,
    @Param('identifier') identifier: string,
    @Query('buildId') buildId: string
  ): Promise<any> {
    return this.lighthouseService.getlighthouseReport(propertyIdentifier, env, identifier, buildId);
  }
}
