import { Injectable } from '@nestjs/common';
import { LoggerService } from 'src/configuration/logger/logger.service';
import { IDataServices } from 'src/repository/data-services.abstract';
import { Action } from 'src/server/analytics/activity-stream.entity';
import { AnalyticsService } from 'src/server/analytics/service/analytics.service';
import { ExceptionsService } from 'src/server/exceptions/exceptions.service';
import { Source } from 'src/server/property/property.entity';
import { CreatePermissionDto, DeletePermissionDto } from '../permission.dto';
import { Permission } from '../permission.entity';
import { PermissionFactory } from './permission.factory';

@Injectable()
export class PermissionService {
  private static readonly defaultSkip: number = 0;

  private static readonly defaultLimit: number = 100;

  constructor(
    private readonly dataServices: IDataServices,
    private readonly exceptionService: ExceptionsService,
    private readonly permissionFactory: PermissionFactory,
    private readonly loggerService: LoggerService,
    private readonly analyticsService: AnalyticsService
  ) {}

  /* @internal
   * Get the list of the Permissions
   * Permissions can be searched on Property Identifier, Name, Email and Auth Action
   */
  async getPermissions(
    propertyIdentifier: string,
    name: string,
    email: string,
    authActionLookup: string,
    skip: number = PermissionService.defaultSkip,
    limit: number = PermissionService.defaultLimit
  ): Promise<Permission[]> {
    const keys = { propertyIdentifier, name, email, authActionLookup };
    Object.keys(keys).forEach((key) => (keys[key] === undefined || keys[key] === '') && delete keys[key]);
    return this.dataServices.permission.getByOptions(keys, { createdAt: -1 }, skip, limit);
  }

  /* @internal
   * This will create the Permissions
   * Every Permissions is related to a perticular property
   * Save the details related to the Permissions
   */
  async createPermission(createPermissionDto: CreatePermissionDto): Promise<Permission[]> {
    const permissions = this.permissionFactory.createNewPermissions(createPermissionDto);
    this.loggerService.log('CreatePermissions', JSON.stringify(permissions));
    for (const permission of permissions) {
      try {
        const checkUserPermission = (
          await this.dataServices.permission.getByAny({
            email: permission.email,
            action: permission.action,
            propertyIdentifier: permission.propertyIdentifier
          })
        )[0];
        if (!checkUserPermission) await this.dataServices.permission.create(permission);
      } catch (err) {
        this.loggerService.error('CreatePermissions', err);
      }
    }
    await this.analyticsService.createActivityStream(
      createPermissionDto.propertyIdentifier,
      Action.PERMISSION_CREATED,
      'NA',
      'NA',
      `${createPermissionDto.actions.toString()} access provided for ${createPermissionDto.email}`,
      createPermissionDto.createdBy,
      Source.MANAGER,
      JSON.stringify(permissions)
    );
    return permissions;
  }

  // @internal Provide intial access for the Property Creator
  async provideInitialAccess(propertyIdentifier: string, createdBy: string, creatorName: string): Promise<Permission[]> {
    const name = 'OWNER';
    const role = (await this.dataServices.role.getByAny({ name }))[0];
    const createPermissionDto = new CreatePermissionDto();
    createPermissionDto.name = creatorName;
    createPermissionDto.propertyIdentifier = propertyIdentifier;
    createPermissionDto.actions = role.actions;
    createPermissionDto.email = createdBy;
    createPermissionDto.createdBy = createdBy;
    this.loggerService.log('InitialPermission', JSON.stringify(createPermissionDto));
    return this.createPermission(createPermissionDto);
  }

  // @internal Delete the permission from the records
  async deletePermission(deletePermissionDto: DeletePermissionDto): Promise<Permission[]> {
    const permissions = this.permissionFactory.deletePermissions(deletePermissionDto);
    this.loggerService.log('DeletePermissions', JSON.stringify(permissions));
    const deletedRecords = [];
    for (const permission of permissions) {
      try {
        const response = await this.dataServices.permission.delete({
          email: permission.email,
          action: permission.action,
          propertyIdentifier: permission.propertyIdentifier
        });
        if (response) deletedRecords.push(permission);
      } catch (err) {
        this.loggerService.error('DeletePermission', err);
      }
    }
    if (deletedRecords.length === 0)
      this.exceptionService.badRequestException({
        message: `No Permission exists for ${deletePermissionDto.email} in ${deletePermissionDto.propertyIdentifier}.`
      });
    await this.analyticsService.createActivityStream(
      deletePermissionDto.propertyIdentifier,
      Action.PERMISSION_DELETED,
      'NA',
      'NA',
      `${deletePermissionDto.actions.toString()} access deleted for ${deletePermissionDto.email}`,
      deletePermissionDto.createdBy,
      Source.MANAGER,
      JSON.stringify(deletedRecords)
    );
    return deletedRecords;
  }
}
