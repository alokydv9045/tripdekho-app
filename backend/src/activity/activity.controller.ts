import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ActivityService } from './activity.service';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../entities/user.entity';

@Controller('activity')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Get('logs')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.TECH_ADMIN, UserRole.SUPPORT_ADMIN, UserRole.PLATFORM_ADMIN)
  async getLogs(
    @Query('page') page = 1,
    @Query('limit') limit = 50,
    @Query('action') action?: string,
  ) {
    const data = await this.activityService.getActivities(Number(page), Number(limit), action);
    return { success: true, data };
  }
}
