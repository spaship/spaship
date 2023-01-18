import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthenticationGuard } from 'src/server/auth/auth.guard';
import { RoleDto } from './role.dto';
import { Role } from './role.entity';
import { RoleService } from './service/role.service';

@Controller('role')
@ApiTags('Role')
@UseGuards(AuthenticationGuard)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  @ApiOperation({ description: 'Get the Role Details.' })
  async getById() {
    return this.roleService.getRoles();
  }

  @Post()
  @ApiOperation({ description: 'Create a New Auth Action.' })
  async createProperty(@Body() roleDto: RoleDto): Promise<Role> {
    return this.roleService.createRole(roleDto);
  }

  @Put()
  @ApiOperation({ description: 'Update the Role.' })
  async update(@Body() roleDto: RoleDto): Promise<Role> {
    return this.roleService.updateRole(roleDto);
  }

  @Delete('/:name')
  @ApiOperation({ description: 'Delete a Auth Action.' })
  async deleteRole(@Param('name') name: string): Promise<Role> {
    return this.roleService.deleteRole(name);
  }
}
