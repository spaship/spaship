import { Injectable } from '@nestjs/common';
import { RoleDto } from '../dto';
import { Role } from '../entity';

@Injectable()
export class RoleFactory {
  createNewRole(createRoleDto: RoleDto): Role {
    const role = new Role();
    role.name = createRoleDto.name;
    role.actions = createRoleDto.actions;
    return role;
  }
}
