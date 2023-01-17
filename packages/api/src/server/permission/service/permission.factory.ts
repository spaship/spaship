import { Injectable } from '@nestjs/common';
import { CreatePermissionDto, DeletePermissionDto } from '../permission.dto';
import { Permission } from '../permission.entity';

@Injectable()
export class PermissionFactory {
  createNewPermissions(createPermissionDto: CreatePermissionDto): Permission[] {
    const permissions = [];
    for (const action of createPermissionDto.actions) {
      const permission = new Permission();
      permission.name = createPermissionDto?.name;
      permission.email = createPermissionDto.email;
      permission.propertyIdentifier = createPermissionDto.propertyIdentifier;
      permission.action = action;
      permission.createdBy = createPermissionDto.createdBy;
      permission.updatedBy = createPermissionDto.createdBy;
      permissions.push(permission);
    }
    return permissions;
  }

  deletePermissions(deletePermissionDto: DeletePermissionDto): Permission[] {
    const permissions = [];
    for (const authActionLookup of deletePermissionDto.actions) {
      const permission = new Permission();
      permission.email = deletePermissionDto.email;
      permission.propertyIdentifier = deletePermissionDto.propertyIdentifier;
      permission.action = authActionLookup;
      permissions.push(permission);
    }
    return permissions;
  }
}
