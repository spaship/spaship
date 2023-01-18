import { Injectable } from '@nestjs/common';
import { Subject } from '../subject.response.dto';
import { RoverFactory } from './rover.factory';

@Injectable()
export class RoverService {
  constructor(private readonly searchFactory: RoverFactory) {}

  /* @internal
   *  Search the User Details from Rover
   *  Details will be searched from the Rover Group based on uid, name & email
   *  Transform the response to User Details
   */
  async getRoverUserDetails(key: string): Promise<Subject[]> {
    return this.searchFactory.getRoverUserDetails(key);
  }

  /* @internal
   *  Search the User Details from Rover Group
   *  It'll search the details from a Perticular Rover Group
   *  Transform the response to User Details
   */
  async getRoverGroupDetails(key: string): Promise<Subject[]> {
    return this.searchFactory.getRoverGroupDetails(key);
  }
}
