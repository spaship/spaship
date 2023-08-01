import { Injectable } from '@nestjs/common';
import { CMDBResponse } from '../cmdb.response.dto';
import { CMDBFactory } from './cmdb.factory';

@Injectable()
export class CMDBService {
  constructor(private readonly cmdbFactory: CMDBFactory) {}

  /* @internal
   *  Search the Details from CMDB
   *  Details will be searched from the CMDB
   *  Transform the response to CMDB Details
   */
  async getCMDBDetailsByCode(key: string): Promise<CMDBResponse[]> {
    return this.cmdbFactory.getCMDBDetails(`u_application_id=${key}`);
  }

  /* @internal
   *  Search the Details from CMDB
   *  Details will be searched from the CMDB
   *  Transform the response to CMDB Details
   */
  async getCMDBDetailsByName(key: string): Promise<CMDBResponse[]> {
    return this.cmdbFactory.getCMDBDetails(`name=${key}`);
  }
}
