import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthenticationGuard } from 'src/server/auth/auth.guard';
import { AuthActionDto } from './auth-actions.dto';
import { AuthAction } from './auth-actions.entity';
import { AuthActionService } from './service/auth-action.service';

@Controller('auth-action')
@ApiTags('AuthAction')
@UseGuards(AuthenticationGuard)
export class AuthActionController {
  constructor(private readonly authActionService: AuthActionService) {}

  @Get()
  @ApiOperation({ description: 'Get the Auth Action Details.' })
  async getById() {
    return this.authActionService.getAuthActions();
  }

  @Post()
  @ApiOperation({ description: 'Create a New Auth Action.' })
  async createProperty(@Body() authActionDto: AuthActionDto): Promise<AuthAction> {
    return this.authActionService.createAuthAction(authActionDto);
  }

  @Put()
  @ApiOperation({ description: 'Update the Auth Action.' })
  async update(@Body() authActionDto: AuthActionDto): Promise<AuthAction> {
    return this.authActionService.updateAuthAction(authActionDto);
  }

  @Delete('/:name')
  @ApiOperation({ description: 'Delete a Auth Action.' })
  async deleteApiKey(@Param('name') name: string): Promise<AuthAction> {
    return this.authActionService.deleteAuthAction(name);
  }
}
