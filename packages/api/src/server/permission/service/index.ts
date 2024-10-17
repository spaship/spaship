import { Injectable } from '@nestjs/common';
import { LoggerService } from 'src/configuration/logger/service';
import { IDataServices } from 'src/repository/data-services.abstract';
import { Action } from 'src/server/analytics/entity';
import { AnalyticsService } from 'src/server/analytics/service';
import { ExceptionsService } from 'src/server/exceptions/service';
import { Source } from 'src/server/property/entity';
import { ROLE } from 'src/server/role/entity';
import { CreatePermissionDto, DeletePermissionDto, PermissionDetailsDto } from '../dto';
import { Permission } from '../entity';
import { PermissionFactory } from './factory';

@Injectable()
export class PermissionService {
  private static readonly defaultSkip: number = 0;

  private static readonly defaultLimit: number = 2000;

  constructor(
    private readonly dataServices: IDataServices,
    private readonly exceptionService: ExceptionsService,
    private readonly permissionFactory: PermissionFactory,
    private readonly loggerService: LoggerService,
    private readonly analyticsService: AnalyticsService
  ) { }

  /* @internal
   * Get the list of the Permissions
   * Permissions can be searched on Property Identifier, Name, Email and Auth Action
   */
  async getPermissions(
    propertyIdentifier: string,
    name: string,
    email: string,
    action: string,
    group: string,
    skip: number = PermissionService.defaultSkip,
    limit: number = PermissionService.defaultLimit
  ): Promise<Permission[]> {
    const keys = { propertyIdentifier, name, email, action };
    Object.keys(keys).forEach((key) => (keys[key] === undefined || keys[key] === '') && delete keys[key]);
    const response = await this.dataServices.permission.getByOptions(keys, { email: 1 }, skip, limit);
    if (group === 'email') {
      const role = (await this.dataServices.role.getByAny({ name: ROLE.OWNER }))[0];
      return this.permissionFactory.groupPermission(response, role.actions.length);
    }
    return response;
  }

  /* @internal
   * This will create the Permissions
   * Every Permissions is related to a perticular property
   * Save the details related to the Permissions
   */
  async createPermission(createPermissionDto: CreatePermissionDto): Promise<any> {
    const authActions = await this.dataServices.authActionLookup.getAll();
    const permissions = this.permissionFactory.createNewPermissions(createPermissionDto, authActions);
    const authActionLookup = new Set((await this.dataServices.authActionLookup.getAll()).map((action) => action.name));
    const grantedPermissions = [];
    const deniedPermissions = [];
    this.loggerService.log('CreatePermissions', JSON.stringify(permissions));
    for (const permission of permissions) {
      if(permission.action === 'APPLICATION_DEPLOYMENT'){
        const checkGranterAccess = {
          email: createPermissionDto.createdBy,
          action: permission.action,
          'target.propertyIdentifier': permission.target.propertyIdentifier,
          'target.cluster': permission.target.cluster,
          'target.applicationIdentifier': permission.target.applicationIdentifier
        }
        Object.keys(checkGranterAccess).forEach((key) => { if (checkGranterAccess[key] === undefined || checkGranterAccess[key] === '') { delete checkGranterAccess[key]; } });
        const granterAuth = (await this.dataServices.permission.getByAny(checkGranterAccess))[0];
        if(!granterAuth) {
          deniedPermissions.push(permission);
          continue;
        }
      }
      try {
        const checkAuth = {
          email: permission.email,
          action: permission.action,
          'target.propertyIdentifier': permission.target.propertyIdentifier,
          'target.cluster': permission.target.cluster,
          'target.applicationIdentifier': permission.target.applicationIdentifier
        }
        Object.keys(checkAuth).forEach((key) => { if (checkAuth[key] === undefined || checkAuth[key] === '') { delete checkAuth[key]; } });
        const checkUserPermission = (await this.dataServices.permission.getByAny(checkAuth))[0];
        if (!checkUserPermission && authActionLookup.has(permission.action)) {
          await this.dataServices.permission.create(permission);
          grantedPermissions.push(permission);
        }
      } catch (err) {
        this.loggerService.error('CreatePermissions', err);
      }
    }

    for (const tmpPermission of grantedPermissions) {
      await this.analyticsService.createActivityStream(
        createPermissionDto.propertyIdentifier,
        Action.PERMISSION_CREATED,
        'NA',
        'NA',
        `${tmpPermission.action} access provided for ${tmpPermission.email}`,
        createPermissionDto.createdBy,
        Source.MANAGER,
        JSON.stringify(tmpPermission)
      );
    }
    return { grantedPermissions, deniedPermissions};
  }

  // @internal Provide intial access for the Property Creator
  async provideInitialAccess(propertyIdentifier: string, createdBy: string, creatorName: string): Promise<Permission[]> {
    const name = 'OWNER';
    const role = (await this.dataServices.role.getByAny({ name }))[0];
    const createPermissionDto = new CreatePermissionDto();
    const permissionDetails = new PermissionDetailsDto();
    permissionDetails.name = creatorName;
    //permissionDetails.accessRights = role.actions;
    permissionDetails.email = createdBy;
    createPermissionDto.permissionDetails = [permissionDetails];
    createPermissionDto.propertyIdentifier = propertyIdentifier;
    createPermissionDto.createdBy = createdBy;
    this.loggerService.log('InitialPermission', JSON.stringify(createPermissionDto));
    return this.createPermission(createPermissionDto);
  }

  // @internal Delete the permission from the records
  async deletePermission(deletePermissionDto: DeletePermissionDto): Promise<any> {
    const authActions = await this.dataServices.authActionLookup.getAll();
    const permissions = this.permissionFactory.deletePermissions(deletePermissionDto, authActions);
    this.loggerService.log('DeletePermissions', JSON.stringify(permissions));
    const deletedPermissions = [];
    const deniedPermissions = [];
    for (const permission of permissions) {
      if(permission.action === 'APPLICATION_DEPLOYMENT'){
        const checkGranterAccess = {
          email: deletePermissionDto.createdBy,
          action: permission.action,
          'target.propertyIdentifier': permission.target.propertyIdentifier,
          'target.cluster': permission.target.cluster,
          'target.applicationIdentifier': permission.target.applicationIdentifier
        }
        Object.keys(checkGranterAccess).forEach((key) => { if (checkGranterAccess[key] === undefined || checkGranterAccess[key] === '') { delete checkGranterAccess[key]; } });
        const granterAuth = (await this.dataServices.permission.getByAny(checkGranterAccess))[0];
        if(!granterAuth) {
          deniedPermissions.push(permission);
          continue;
        }
      }
      try {
        const checkAuth = {
          email: permission.email,
          action: permission.action,
          'target.propertyIdentifier': permission.target.propertyIdentifier,
          'target.cluster': permission.target.cluster,
          'target.applicationIdentifier': permission.target.applicationIdentifier
        }
        Object.keys(checkAuth).forEach((key) => { if (checkAuth[key] === undefined || checkAuth[key] === '') { delete checkAuth[key]; } });
        const response = await this.dataServices.permission.delete(checkAuth);
        if (response) {
          deletedPermissions.push(permission);
          await this.analyticsService.createActivityStream(
            deletePermissionDto.propertyIdentifier,
            Action.PERMISSION_DELETED,
            'NA',
            'NA',
            `${permission.action} access removed for ${permission.email}`,
            deletePermissionDto.createdBy,
            Source.MANAGER,
            JSON.stringify(permission)
          );
        }
      } catch (err) {
        this.loggerService.error('DeletePermission', err);
      }
    }

    return { deletedPermissions, deniedPermissions};
  }
}
