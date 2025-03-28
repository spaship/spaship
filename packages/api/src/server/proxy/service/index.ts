import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { PROXY_CHECK } from 'src/configuration';
import { LoggerService } from 'src/configuration/logger/service';
import { ExceptionsService } from 'src/server/exceptions/service';

@Injectable()
export class ProxyService {
  constructor(private logger: LoggerService, private httpService: HttpService, private exceptionsService: ExceptionsService) {}

  private async getBaseUrl(): Promise<string> {
    return PROXY_CHECK.url; // Replace with actual base URL logic
  }

  private async getAuthToken(): Promise<string> {
    return PROXY_CHECK.authToken; // Replace with actual base URL logic
  }

  async fetchIncidents() {
    try {
      const baseUrl = await this.getBaseUrl();
      const authToken = await this.getAuthToken();
      const response = await this.httpService.axiosRef.get(`${baseUrl}/incidents.json`, {
        headers: { Authorization: authToken }
      });
      this.logger.log('Fetched incidents', response.data);
      return response.data;
    } catch (err) {
      this.logger.error('Error fetching incidents', err);
      this.exceptionsService.badRequestException({ message: 'Failed to fetch incidents.' });
      return [];
    }
  }

  async fetchComponents() {
    try {
      const baseUrl = await this.getBaseUrl();
      const authToken = await this.getAuthToken();
      const response = await this.httpService.axiosRef.get(`${baseUrl}/components`, {
        headers: { Authorization: authToken }
      });
      this.logger.log('Fetched components', response.data);
      return response.data;
    } catch (err) {
      this.logger.error('Error fetching incidents', err);
      this.exceptionsService.badRequestException({ message: 'Failed to fetch components.' });
      return [];
    }
  }

  async createIncident(incident: any) {
    try {
      const baseUrl = await this.getBaseUrl();
      const authToken = await this.getAuthToken();
      const response = await this.httpService.axiosRef.post(
        `${baseUrl}/incidents`,
        { ...incident },
        {
          headers: { Authorization: authToken }
        }
      );
      this.logger.log('Incident created successfully', response.data);
      return response.data;
    } catch (err) {
      this.logger.error('Error creating incident', err);
      this.exceptionsService.badRequestException({ message: 'Failed to create incident.' });
      return [];
    }
  }

  async updateIncident(incidentId: string, updatedData: any) {
    try {
      const baseUrl = await this.getBaseUrl();
      const authToken = await this.getAuthToken();
      const response = await this.httpService.axiosRef.patch(
        `${baseUrl}/incidents/${incidentId}`,
        { ...updatedData },
        {
          headers: { Authorization: authToken }
        }
      );
      this.logger.log('Incident updated successfully', response.data);
      return response.data;
    } catch (err) {
      this.logger.error('Error updating incident', err);
      this.exceptionsService.badRequestException({ message: 'Failed to update incident.' });
      return [];
    }
  }

  async deleteIncident(incidentId: string) {
    try {
      const baseUrl = await this.getBaseUrl();
      const authToken = await this.getAuthToken();
      const response = await this.httpService.axiosRef.delete(`${baseUrl}/incidents/${incidentId}.json`, {
        headers: { Authorization: authToken }
      });
      this.logger.log('Incident deleted successfully', response.data);
      return response.data;
    } catch (err) {
      this.logger.error('Error deleting incident', err);
      this.exceptionsService.badRequestException({ message: 'Failed to delete incident.' });
      return [];
    }
  }
}
