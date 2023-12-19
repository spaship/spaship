import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ROVER_AUTH } from 'src/configuration';
import { LoggerService } from 'src/configuration/logger/service';
import { Subject } from '../subject.response.dto';

@Injectable()
export class RoverFactory {
  constructor(private readonly logger: LoggerService, private readonly httpService: HttpService) {}

  // @internal fetch the user details from the Rover
  async getRoverUserDetails(key: string): Promise<Subject[]> {
    const headers = { Authorization: `Basic ${ROVER_AUTH.cred}`, rejectUnauthorized: false };
    let response;
    try {
      response = await this.httpService.axiosRef.get(`${ROVER_AUTH.baseUrl}/groups/api/v1/users?fields=mail,cn&criteria=${key}`, {
        headers
      });
      return await this.transformSubject(response.data.result.result);
    } catch (err) {
      this.logger.error('RoverError', err);
    }
    return response;
  }

  // @internal fetch the user details from a perticular Rover Group
  async getRoverGroupDetails(key: string): Promise<Subject[]> {
    const headers = { Authorization: `Basic ${ROVER_AUTH.cred}`, rejectUnauthorized: false };
    let response;
    try {
      response = await this.httpService.axiosRef.get(`${ROVER_AUTH.baseUrl}/groups/api/v1/groups/${key}/users`, {
        headers
      });
      return await this.transformSubject(response.data.result.result);
    } catch (err) {
      this.logger.error('RoverError', err);
    }
    return response;
  }

  // @internal fetch the list of the Groups contains the key
  async getRoverGroupList(key: string): Promise<Subject[]> {
    const headers = { Authorization: `Basic ${ROVER_AUTH.cred}`, rejectUnauthorized: false };
    let response;
    try {
      response = await this.httpService.axiosRef.get(`${ROVER_AUTH.baseUrl}/groups/api/v1/groups?criteria=${key}`, {
        headers
      });
      return await this.transformSubject(response.data.result.result);
    } catch (err) {
      this.logger.error('RoverError', err);
    }
    return response;
  }

  // @internal transform the SOT Details into Subject [eg. SOT is ]
  async transformSubject(roverDetails): Promise<Subject[]> {
    const response = [];
    for (const user of roverDetails) {
      const tmpUser = new Subject();
      tmpUser.name = user.cn;
      tmpUser.email = user.mail;
      response.push(tmpUser);
    }
    return response;
  }
}
