import { Injectable } from '@nestjs/common';
import { ROLE } from 'src/server/role/role.entity';
import { CreatePermissionDto, DeletePermissionDto } from '../permission.dto';
import { Permission } from '../permission.entity';

@Injectable()
export class PermissionFactory {
  createNewPermissions(createPermissionDto: CreatePermissionDto): Permission[] {
    const permissions = [];
    for (const permission of createPermissionDto.permissionDetails) {
      for (const action of permission.actions) {
        const tmpPermission = new Permission();
        tmpPermission.name = permission?.name;
        tmpPermission.email = permission.email;
        tmpPermission.propertyIdentifier = createPermissionDto.propertyIdentifier;
        tmpPermission.action = action;
        tmpPermission.createdBy = createPermissionDto.createdBy;
        tmpPermission.updatedBy = createPermissionDto.createdBy;
        permissions.push(tmpPermission);
      }
    }
    return permissions;
  }

  deletePermissions(deletePermissionDto: DeletePermissionDto): Permission[] {
    const permissions = [];
    for (const permission of deletePermissionDto.permissionDetails) {
      for (const authActionLookup of permission.actions) {
        const tmpPermission = new Permission();
        tmpPermission.email = permission.email;
        tmpPermission.propertyIdentifier = deletePermissionDto.propertyIdentifier;
        tmpPermission.action = authActionLookup;
        permissions.push(tmpPermission);
      }
    }
    return permissions;
  }

  groupPermission(permissions: Permission[], matchRole: number) {
    const groupedPermissions = permissions.reduce((acc, obj) => {
      const key = obj.email;
      const group = acc[key] ?? [];
      return { ...acc, [key]: [...group, obj] };
    }, {});
    const emails = Array.from(new Set(permissions.map((item) => item.email)));
    const groupedResponse = [];
    for (const item of emails) {
      const data = {
        email: item,
        role: groupedPermissions[item].length === matchRole ? ROLE.OWNER : ROLE.USER,
        details: groupedPermissions[item]
      };
      groupedResponse.push(data);
    }
    return groupedResponse;
  }
}
