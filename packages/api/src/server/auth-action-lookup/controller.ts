import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthenticationGuard } from 'src/server/auth/guard';
import { AuthActionLookupDto } from './dto';
import { AuthActionLookup } from './entity';
import { AuthActionLookupService } from './service';

@Controller('auth-action')
@ApiTags('AuthActionLookup')
@UseGuards(AuthenticationGuard)
export class AuthActionLookupController {
  constructor(private readonly authActionLookupService: AuthActionLookupService) {}

  @Get()
  @ApiOperation({ description: 'Get the Auth Action Details.' })
  async getById() {
    return this.authActionLookupService.getAuthActionLookups();
  }

  @Post()
  @ApiOperation({ description: 'Create a New Auth Action.' })
  async createProperty(@Body() authActionLookupDto: AuthActionLookupDto): Promise<AuthActionLookup> {
    return this.authActionLookupService.createAuthActionLookup(authActionLookupDto);
  }

  @Put()
  @ApiOperation({ description: 'Update the Auth Action.' })
  async update(@Body() authActionLookupDto: AuthActionLookupDto): Promise<AuthActionLookup> {
    return this.authActionLookupService.updateAuthActionLookup(authActionLookupDto);
  }

  @Delete('/:name')
  @ApiOperation({ description: 'Delete a Auth Action.' })
  async deleteAuthActionLookup(@Param('name') name: string): Promise<AuthActionLookup> {
    return this.authActionLookupService.deleteAuthActionLookup(name);
  }
}
