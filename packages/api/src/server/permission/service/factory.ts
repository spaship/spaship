import { Injectable } from '@nestjs/common';
import { ROLE } from 'src/server/role/entity';
import { CreatePermissionDto, DeletePermissionDto } from '../dto';
import { Permission } from '../entity';

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
        if (this.checkPermissionAccess(deletePermissionDto.createdBy, permission.email, authActionLookup)) {
          const tmpPermission = new Permission();
          tmpPermission.email = permission.email;
          tmpPermission.propertyIdentifier = deletePermissionDto.propertyIdentifier;
          tmpPermission.action = authActionLookup;
          permissions.push(tmpPermission);
        }
      }
    }
    return permissions;
  }

  // @internal Property Owner can not self delete his/her Permission Creation or Permission Deletion Access, else it might get into a deadlock situation
  private checkPermissionAccess(createdBy: string, email: string, authActionLookup: string) {
    return !(createdBy === email && (authActionLookup === 'PERMISSION_CREATION' || authActionLookup === 'PERMISSION_DELETION'));
  }

  groupPermission(permissions: Permission[], allPermissionsLength: number) {
    const groupedPermissions = permissions.reduce((acc, obj) => {
      const key = obj.email;
      const group = acc[key] ?? [];
      return { ...acc, [key]: [...group, obj] };
    }, {});
    const emails = Array.from(new Set(permissions.map((item) => item.email)));
    const groupedResponse = [];
    for (const item of emails) {
      const allowedPermissions = groupedPermissions[item];
      const data = {
        email: item,
        name: allowedPermissions[0].name,
        role: allowedPermissions.length === allPermissionsLength ? ROLE.OWNER : ROLE.USER
      };
      allowedPermissions.forEach((key) => {
        data[key.action] = true;
      });
      groupedResponse.push(data);
    }
    return groupedResponse;
  }
}
