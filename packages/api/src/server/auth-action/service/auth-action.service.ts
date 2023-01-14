import { Injectable } from '@nestjs/common';
import { IDataServices } from 'src/repository/data-services.abstract';
import { ExceptionsService } from 'src/server/exceptions/exceptions.service';
import { AuthActionDto } from '../auth-actions.dto';
import { AuthAction } from '../auth-actions.entity';
import { AuthActionFactory } from './auth-action.factory';

@Injectable()
export class AuthActionService {
  constructor(
    private readonly dataServices: IDataServices,
    private readonly exceptionService: ExceptionsService,
    private readonly authActionFactory: AuthActionFactory
  ) {}

  // @internal get the list for all the Auth Action
  async getAuthActions(): Promise<AuthAction[]> {
    const response = await this.dataServices.authAction.getAll();
    return response;
  }

  /* @internal
   * This will create the Auth Action
   * Every Auth Action is related to a perticular property
   * Save the details related to the Auth Action
   */
  async createAuthAction(createAuthActionDto: AuthActionDto): Promise<AuthAction> {
    const authAction = this.authActionFactory.createNewAuthAction(createAuthActionDto);
    return this.dataServices.authAction.create(authAction);
  }

  /* @internal
   * Update the existing Auth Action
   * Provision for updating the resource & method
   */
  async updateAuthAction(updateAuthActionDto: AuthActionDto): Promise<AuthAction> {
    const updateAuthAction = (await this.dataServices.authAction.getByAny({ name: updateAuthActionDto.name }))[0];
    if (!updateAuthAction) this.exceptionService.badRequestException({ message: `AuthAction doesn't exist.` });
    updateAuthAction.resource = updateAuthActionDto.resource;
    updateAuthAction.method = updateAuthActionDto.method;
    await this.dataServices.authAction.updateOne({ pname: updateAuthActionDto.name }, updateAuthAction);
    return updateAuthAction;
  }

  // @internal Delete the Auth Action from the records
  async deleteAuthAction(name: string): Promise<AuthAction> {
    const authAction = await this.dataServices.authAction.getByAny({ name });
    if (authAction.length === 0) this.exceptionService.badRequestException({ message: 'No AuthAction exists.' });
    const response = await this.dataServices.authAction.delete({ name });
    return response;
  }
}
