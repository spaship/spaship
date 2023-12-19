import { Injectable } from '@nestjs/common';
import { IDataServices } from 'src/repository/data-services.abstract';
import { ExceptionsService } from 'src/server/exceptions/service';
import { AuthActionLookupDto } from '../dto';
import { AuthActionLookup } from '../entity';
import { AuthActionLookupFactory } from './factory';

@Injectable()
export class AuthActionLookupService {
  constructor(
    private readonly dataServices: IDataServices,
    private readonly exceptionService: ExceptionsService,
    private readonly authActionLookupFactory: AuthActionLookupFactory
  ) {}

  // @internal get the list for all the Auth Action
  async getAuthActionLookups(): Promise<AuthActionLookup[]> {
    const response = await this.dataServices.authActionLookup.getAll();
    return response;
  }

  /* @internal
   * This will create the Auth Action
   * Every Auth Action is related to a perticular property
   * Save the details related to the Auth Action
   */
  async createAuthActionLookup(createAuthActionLookupDto: AuthActionLookupDto): Promise<AuthActionLookup> {
    const authActionLookup = this.authActionLookupFactory.createNewAuthActionLookup(createAuthActionLookupDto);
    return this.dataServices.authActionLookup.create(authActionLookup);
  }

  /* @internal
   * Update the existing Auth Action
   * Provision for updating the resource & method
   */
  async updateAuthActionLookup(updateAuthActionLookupDto: AuthActionLookupDto): Promise<AuthActionLookup> {
    const updateAuthActionLookup = (await this.dataServices.authActionLookup.getByAny({ name: updateAuthActionLookupDto.name }))[0];
    if (!updateAuthActionLookup) this.exceptionService.badRequestException({ message: `AuthActionLookup doesn't exist.` });
    updateAuthActionLookup.resource = updateAuthActionLookupDto.resource;
    updateAuthActionLookup.method = updateAuthActionLookupDto.method;
    await this.dataServices.authActionLookup.updateOne({ pname: updateAuthActionLookupDto.name }, updateAuthActionLookup);
    return updateAuthActionLookup;
  }

  // @internal Delete the Auth Action from the records
  async deleteAuthActionLookup(name: string): Promise<AuthActionLookup> {
    const authActionLookup = await this.dataServices.authActionLookup.getByAny({ name });
    if (authActionLookup.length === 0) this.exceptionService.badRequestException({ message: 'No AuthActionLookup exists.' });
    const response = await this.dataServices.authActionLookup.delete({ name });
    return response;
  }
}
