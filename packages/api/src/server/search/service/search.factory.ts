import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ROVER_AUTH } from 'src/configuration';
import { LoggerService } from 'src/configuration/logger/logger.service';
import { UserDetails } from '../user-detaills.response.dto';

@Injectable()
export class SearchFactory {
  constructor(private readonly logger: LoggerService, private readonly httpService: HttpService) { }

  // @internal fetch the user details from the Rover
  async getRoverUserDetails(key: string): Promise<UserDetails[]> {
    const headers = { Authorization: `Basic ${ROVER_AUTH.cred}`, rejectUnauthorized: false };
    let response;
    try {
      response = await this.httpService.axiosRef.get(`${ROVER_AUTH.baseUrl}/groups/api/v1/users?fields=uid,cn,mail&criteria=${key}`, {
        headers
      });
      return await this.transformUserDetails(response.data.result.result);
    } catch (err) {
      this.logger.error('RoverError', err);
    }
    return response;
  }

  // @internal fetch the user details from a perticular Rover Group
  async getRoverGroupDetails(key: string): Promise<UserDetails[]> {
    const headers = { Authorization: `Basic ${ROVER_AUTH.cred}`, rejectUnauthorized: false };
    let response;
    try {
      response = await this.httpService.axiosRef.get(`${ROVER_AUTH.baseUrl}/groups/api/v1/groups/${key}/users`, {
        headers
      });
      return await this.transformUserDetails(response.data.result.result);
    } catch (err) {
      this.logger.error('RoverError', err);
    }
    return response;
  }

  // @internal transform the SOT Details into User Details [eg. SOT is ]
  async transformUserDetails(roverDetails): Promise<UserDetails[]> {
    const response = [];
    for (const user of roverDetails) {
      const tmpUser = new UserDetails();
      tmpUser.name = user.cn;
      tmpUser.email = user.mail;
      response.push(tmpUser);
    }
    return response;
  }
}
