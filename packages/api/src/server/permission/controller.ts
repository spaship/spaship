import { Body, Controller, Delete, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthenticationGuard } from 'src/server/auth/guard';
import { CreatePermissionDto, DeletePermissionDto } from './dto';
import { Permission } from './entity';
import { PermissionService } from './service';

@Controller('permission')
@ApiTags('Permission')
@UseGuards(AuthenticationGuard)
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Get()
  @ApiOperation({ description: 'Get the Permission Details.' })
  async getById(
    @Query('propertyIdentifier') propertyIdentifier: string,
    @Query('name') name: string,
    @Query('email') email: string,
    @Query('action') action: string,
    @Query('group') group: string,
    @Query('skip') skip: number,
    @Query('limit') limit: number
  ) {
    return this.permissionService.getPermissions(propertyIdentifier, name, email, action, group, skip, limit);
  }

  @Post()
  @ApiOperation({ description: 'Create a New Permission.' })
  async createProperty(@Body() permissionDto: CreatePermissionDto): Promise<Permission[]> {
    return this.permissionService.createPermission(permissionDto);
  }

  @Delete()
  @ApiOperation({ description: 'Delete a Permission.' })
  async deletePermission(@Body() deletePermissionDto: DeletePermissionDto): Promise<Permission[]> {
    return this.permissionService.deletePermission(deletePermissionDto);
  }
}
