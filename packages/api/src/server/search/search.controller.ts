import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthenticationGuard } from 'src/server/auth/auth.guard';
import { UserDetails } from './user-detaills.response.dto';
import { SearchService } from './service/search.service';

@Controller('search')
@ApiTags('Search')
@UseGuards(AuthenticationGuard)
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('/rover/user/:username')
  @ApiCreatedResponse({ status: 201, description: 'List for the users in Rover.', type: UserDetails, isArray: true })
  @ApiOperation({ description: 'Search the user details from Rover.' })
  async getRoverUserDetails(@Param('username') username: string): Promise<UserDetails[]> {
    return this.searchService.getRoverUserDetails(username);
  }

  @Get('/rover/group/:groupname')
  @ApiCreatedResponse({ status: 201, description: 'List for the users in Rover Group.', type: UserDetails, isArray: true })
  @ApiOperation({ description: 'Search the user details from Rover Group.' })
  async getRoverGroupDetails(@Param('groupname') username: string): Promise<UserDetails[]> {
    return this.searchService.getRoverGroupDetails(username);
  }
}
