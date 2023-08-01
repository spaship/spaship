import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { CMDB_DETAILS } from 'src/configuration';
import { LoggerService } from 'src/configuration/logger/logger.service';
import { CMDBResponse } from '../cmdb.response.dto';

@Injectable()
export class CMDBFactory {
  constructor(private readonly logger: LoggerService, private readonly httpService: HttpService) {}

  // @internal fetch the property details from the CMDB
  async getCMDBDetails(key: string): Promise<CMDBResponse[]> {
    const headers = { Authorization: `Basic ${CMDB_DETAILS.cred}`, rejectUnauthorized: false };
    let response;
    try {
      response = await this.httpService.axiosRef.get(`${CMDB_DETAILS.baseUrl}/api/now/table/cmdb_ci_business_app`, {
        headers,
        params: { sysparm_query: key }
      });
      return await this.transformSubject(response.data.result);
    } catch (err) {
      this.logger.error('CMDBError', err);
    }
    return response;
  }

  // @internal transform the CMDB Details into CMDBResponse
  async transformSubject(cmdbDetails): Promise<CMDBResponse[]> {
    const response = [];
    for (const cmdb of cmdbDetails) {
      const tmpDetails = new CMDBResponse();
      tmpDetails.name = cmdb.name;
      tmpDetails.code = cmdb.u_application_id;
      tmpDetails.url = cmdb.url;
      tmpDetails.email = cmdb.u_support_contact_email;
      tmpDetails.severity = cmdb.business_criticality;
      response.push(tmpDetails);
    }
    return response;
  }
}
