import { Controller, Post, Body } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { Public } from '../common/decorators/public.decorator';
import { SubmitHotelApplicationDto, SubmitAgentApplicationDto } from './dto/applications.dto';

@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Public()
  @Post('hotel')
  async submitHotelApplication(@Body() data: SubmitHotelApplicationDto) {
    return this.applicationsService.submitHotelApplication(data);
  }

  @Public()
  @Post('agent')
  async submitAgentApplication(@Body() data: SubmitAgentApplicationDto) {
    return this.applicationsService.submitAgentApplication(data);
  }
}
