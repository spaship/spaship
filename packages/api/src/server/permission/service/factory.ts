import { Injectable } from '@nestjs/common';
import { ROLE } from 'src/server/role/entity';
import { create } from 'domain';
import { AuthActionLookup } from 'src/server/auth-action-lookup/entity';
import { CreatePermissionDto, DeletePermissionDto } from '../dto';
import { Permission, Target } from '../entity';

@Injectable()
export class PermissionFactory {
  createNewPermissions(createPermissionDto: CreatePermissionDto, authActions: AuthActionLookup[]): Permission[] {
    const permissions = [];
    for (const permission of createPermissionDto.permissionDetails) {
      for (const access of permission.accessRights) {
        const tmpPermission = new Permission();

        const tmpTarget = new Target();
        tmpTarget.propertyIdentifier = createPermissionDto.propertyIdentifier;
        const authAction = authActions.find((key) => key.name === access.action);
        if (authAction.criteria.includes('cluster')) tmpTarget.cluster = access.cluster;
        if (authAction.criteria.includes('applicationIdentifier')) tmpTarget.applicationIdentifier = access.applicationIdentifier;

        tmpPermission.name = permission?.name;
        tmpPermission.email = permission.email;
        tmpPermission.action = access.action;
        tmpPermission.target = tmpTarget;
        tmpPermission.createdBy = createPermissionDto.createdBy;
        tmpPermission.updatedBy = createPermissionDto.createdBy;
        Object.keys(tmpTarget).forEach((key) => tmpTarget[key] === undefined && delete tmpTarget[key]);
        permissions.push(tmpPermission);
      }
    }
    return permissions;
  }

  deletePermissions(deletePermissionDto: DeletePermissionDto, authActions: AuthActionLookup[]): Permission[] {
    const permissions = [];
    for (const permission of deletePermissionDto.permissionDetails) {
      for (const access of permission.accessRights) {
        const tmpPermission = new Permission();
        tmpPermission.email = permission.email;

        const tmpTarget = new Target();
        tmpTarget.propertyIdentifier = deletePermissionDto.propertyIdentifier;
        const authAction = authActions.find((key) => key.name === access.action);
        if (authAction.criteria.includes('cluster')) tmpTarget.cluster = access.cluster;
        if (authAction.criteria.includes('applicationIdentifier')) tmpTarget.applicationIdentifier = access.applicationIdentifier;

        Object.keys(tmpTarget).forEach((key) => tmpTarget[key] === undefined && delete tmpTarget[key]);
        tmpPermission.target = tmpTarget;
        tmpPermission.action = access.action;
        permissions.push(tmpPermission);
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
