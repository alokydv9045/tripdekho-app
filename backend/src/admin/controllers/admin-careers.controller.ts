import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../entities/user.entity';
import { CareersService } from '../../careers/careers.service';
import {
  CreateCareerPositionDto,
  UpdateCareerPositionDto,
  UpdateApplicationStatusDto,
  CreateGalleryImageDto,
} from '../dto/admin-careers.dto';

@Roles(UserRole.SUPER_ADMIN, UserRole.GROWTH_ADMIN)
@Controller('admin/careers')
export class AdminCareersController {
  constructor(private readonly careersService: CareersService) {}

  // ─── Position Management ───

  @Get('positions')
  async getPositions(@Query() query: any) {
    const data = await this.careersService.getAllPositions(query);
    return { success: true, data };
  }

  @Post('positions')
  async createPosition(@Body() dto: CreateCareerPositionDto) {
    const data = await this.careersService.createPosition(dto);
    return { success: true, data };
  }

  @Patch('positions/:id')
  async updatePosition(
    @Param('id') id: string,
    @Body() dto: UpdateCareerPositionDto,
  ) {
    const data = await this.careersService.updatePosition(id, dto);
    return { success: true, data };
  }

  @Patch('positions/:id/toggle')
  async togglePosition(@Param('id') id: string) {
    const data = await this.careersService.togglePosition(id);
    return { success: true, data };
  }

  @Delete('positions/:id')
  async deletePosition(@Param('id') id: string) {
    const data = await this.careersService.deletePosition(id);
    return { success: true, data };
  }

  // ─── Application Management ───

  @Get('applications')
  async getApplications(@Query() query: any) {
    const data = await this.careersService.getApplications(query);
    return { success: true, data };
  }

  @Patch('applications/:id/status')
  async updateApplicationStatus(
    @Param('id') id: string,
    @Body() dto: UpdateApplicationStatusDto,
  ) {
    const data = await this.careersService.updateApplicationStatus(id, dto.status);
    return { success: true, data };
  }

  // ─── Gallery Management ───

  @Get('gallery')
  async getGalleryImages() {
    const data = await this.careersService.getAllGalleryImages();
    return { success: true, data };
  }

  @Post('gallery')
  async createGalleryImage(@Body() dto: CreateGalleryImageDto) {
    const data = await this.careersService.createGalleryImage(dto);
    return { success: true, data };
  }

  @Patch('gallery/:id/toggle')
  async toggleGalleryImage(@Param('id') id: string) {
    const data = await this.careersService.toggleGalleryImage(id);
    return { success: true, data };
  }

  @Delete('gallery/:id')
  async deleteGalleryImage(@Param('id') id: string) {
    const data = await this.careersService.deleteGalleryImage(id);
    return { success: true, data };
  }
}
