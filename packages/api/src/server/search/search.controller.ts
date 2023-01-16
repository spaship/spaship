import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthenticationGuard } from 'src/server/auth/auth.guard';
import { Rover } from './rover.response.dto';
import { SearchService } from './service/search.service';

@Controller('search')
@ApiTags('Search')
@UseGuards(AuthenticationGuard)
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('/rover/user/:username')
  @ApiCreatedResponse({ status: 201, description: 'List for the users in Rover.', type: Rover, isArray: true })
  @ApiOperation({ description: 'Search the user details from Rover.' })
  async getRoverUserDetails(@Param('username') username: string): Promise<Rover[]> {
    return this.searchService.getRoverUserDetails(username);
  }
}
