import { Injectable } from '@nestjs/common';
import { IDataServices } from 'src/repository/data-services.abstract';
import { ExceptionsService } from 'src/server/exceptions/service';
import { RoleDto } from '../dto';
import { Role } from '../entity';
import { RoleFactory } from './factory';

@Injectable()
export class RoleService {
  constructor(
    private readonly dataServices: IDataServices,
    private readonly exceptionService: ExceptionsService,
    private readonly roleFactory: RoleFactory
  ) {}

  // @internal get the list for all the roles
  async getRoles(): Promise<Role[]> {
    const response = await this.dataServices.role.getAll();
    return response;
  }

  /* @internal
   * This will create the role
   * Every role is related to a perticular property
   * Save the details related to the role
   */
  async createRole(createRoleDto: RoleDto): Promise<Role> {
    const role = this.roleFactory.createNewRole(createRoleDto);
    return this.dataServices.role.create(role);
  }

  /* @internal
   * Update the existing Role
   * Provision for updating the Auth Actions of the Role
   */
  async updateRole(updateRoleDto: RoleDto): Promise<Role> {
    const updateRole = (await this.dataServices.role.getByAny({ name: updateRoleDto.name }))[0];
    if (!updateRole) this.exceptionService.badRequestException({ message: `Role doesn't exist.` });
    updateRole.actions = updateRoleDto.actions;
    await this.dataServices.role.updateOne({ name: updateRoleDto.name }, updateRole);
    return updateRole;
  }

  // @internal Delete the Role from the records
  async deleteRole(name: string): Promise<Role> {
    const role = await this.dataServices.role.getByAny({ name });
    if (role.length === 0) this.exceptionService.badRequestException({ message: `Role doesn't exist.` });
    const response = await this.dataServices.role.delete({ name });
    return response;
  }
}
