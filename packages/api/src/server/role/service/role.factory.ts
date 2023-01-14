import { Injectable } from '@nestjs/common';
import { RoleDto } from '../role.dto';
import { Role } from '../role.entity';

@Injectable()
export class RoleFactory {
  createNewRole(createRoleDto: RoleDto): Role {
    const role = new Role();
    role.name = createRoleDto.name;
    role.authActions = createRoleDto.authActions;
    return role;
  }
}
