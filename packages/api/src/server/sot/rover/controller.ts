import { Controller, Get, Param, UseGuards, Query } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthenticationGuard } from 'src/server/auth/guard';
import { Subject } from './subject.response.dto';
import { RoverService } from './service';

@Controller('sot')
@ApiTags('SOT')
@UseGuards(AuthenticationGuard)
// @internal TODO : We'll implement the Interface when there will be more than one SOT
export class RoverController {
  constructor(private readonly searchService: RoverService) {}

  @Get('/rover/user/:username')
  @ApiCreatedResponse({ status: 201, description: 'List for the users in Rover.', type: Subject, isArray: true })
  @ApiOperation({ description: 'Search the user details from Rover.' })
  async getRoverUserDetails(@Param('username') username: string): Promise<Subject[]> {
    return this.searchService.getRoverUserDetails(username);
  }

  @Get('/rover/group/:groupName')
  @ApiCreatedResponse({ status: 201, description: 'List for the users in Rover Group.', type: Subject, isArray: true })
  @ApiOperation({ description: 'Search the user details from Rover Group.' })
  async getRoverGroupDetails(@Param('groupName') groupName: string, @Query('searchByCriteria') searchByCriteria: string): Promise<Subject[]> {
    if (searchByCriteria === 'group') return this.searchService.getRoverGroupList(groupName);
    return this.searchService.getRoverGroupDetails(groupName);
  }
}
