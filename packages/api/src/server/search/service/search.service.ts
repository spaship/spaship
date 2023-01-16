import { Injectable } from '@nestjs/common';
import { UserDetails } from '../user-detaills.response.dto';
import { SearchFactory } from './search.factory';

@Injectable()
export class SearchService {
  constructor(private readonly searchFactory: SearchFactory) {}

  /* @internal
   *  Search the User Details from Rover
   *  Details will be searched from the Rover Group based on uid, name & email
   *  Transform the response to User Details
   */
  async getRoverUserDetails(key: string): Promise<UserDetails[]> {
    return this.searchFactory.getRoverUserDetails(key);
  }

  /* @internal
   *  Search the User Details from Rover Group
   *  It'll search the details from a Perticular Rover Group
   *  Transform the response to User Details
   */
  async getRoverGroupDetails(key: string): Promise<UserDetails[]> {
    return this.searchFactory.getRoverGroupDetails(key);
  }
}
