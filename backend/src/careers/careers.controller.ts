import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { Public } from '../common/decorators/public.decorator';
import { CareersService } from './careers.service';
import { ApplyCareerDto } from './dto/apply-career.dto';

@Controller('careers')
export class CareersController {
  constructor(private readonly careersService: CareersService) {}

  @Public()
  @Get()
  async getActivePositions() {
    const data = await this.careersService.getActivePositions();
    return { success: true, data };
  }

  @Public()
  @Get('gallery')
  async getGalleryImages() {
    const data = await this.careersService.getGalleryImages();
    return { success: true, data };
  }

  @Public()
  @Get(':id')
  async getPositionById(@Param('id') id: string) {
    const data = await this.careersService.getPositionById(id);
    return { success: true, data };
  }

  @Public()
  @Post('apply')
  async submitApplication(@Body() dto: ApplyCareerDto) {
    const data = await this.careersService.submitApplication(dto);
    return { success: true, data };
  }
}
