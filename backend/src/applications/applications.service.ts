import { Injectable } from '@nestjs/common';

@Injectable()
export class ApplicationsService {
  private hotelApplications: any[] = [];
  private agentApplications: any[] = [];

  async submitHotelApplication(data: any) {
    this.hotelApplications.push({ ...data, createdAt: new Date() });
    return { success: true, message: 'Hotel application received' };
  }

  async submitAgentApplication(data: any) {
    this.agentApplications.push({ ...data, createdAt: new Date() });
    return { success: true, message: 'Agent application received' };
  }
}
