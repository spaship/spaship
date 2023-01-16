import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ROVER_AUTH } from 'src/configuration';
import { LoggerService } from 'src/configuration/logger/logger.service';
import { Rover } from '../rover.response.dto';

@Injectable()
export class SearchFactory {
  constructor(private readonly logger: LoggerService, private readonly httpService: HttpService) {}

  // @internal fetch the user details from the Rover
  async getRoverUserDetails(key: string): Promise<Rover[]> {
    const headers = { Authorization: `Basic ${ROVER_AUTH.cred}`, rejectUnauthorized: false };
    let response;
    try {
      response = await this.httpService.axiosRef.get(`${ROVER_AUTH.baseUrl}/groups/api/v1/users?fields=uid,cn,mail&criteria=${key}`, {
        headers
      });
      return await this.transformRoverDetails(response.data.result.result);
    } catch (err) {
      this.logger.error('RoverError', err);
    }
    return response;
  }

  async transformRoverDetails(roverDetails): Promise<Rover[]> {
    const response = [];
    for (const user of roverDetails) {
      const tmpUser = new Rover();
      tmpUser.name = user.cn;
      tmpUser.email = user.mail;
      response.push(tmpUser);
    }
    return response;
  }
}
