import { Injectable } from '@nestjs/common';
import { Rover } from '../rover.response.dto';
import { SearchFactory } from './search.factory';

@Injectable()
export class SearchService {
  constructor(private readonly searchFactory: SearchFactory) {}

  /* @internal
   *  Search the User Details from Rover
   *  Details will be searched from the Rover Group based on uid, name & email
   *  Transform the response to Rover Entity
   */
  async getRoverUserDetails(key: string): Promise<Rover[]> {
    return this.searchFactory.getRoverUserDetails(key);
  }
}
