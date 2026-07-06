import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ReferralsService } from './referrals.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('referrals')
export class ReferralsController {
  constructor(private readonly referralsService: ReferralsService) {}

  @Post('validate')
  async validateCode(@Body('code') code: string) {
    return this.referralsService.validateCode(code);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('my-code')
  async getMyCode(@CurrentUser('id') userId: string) {
    return this.referralsService.getMyCode(userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('my-referrals')
  async getMyReferrals(@CurrentUser('id') userId: string) {
    return this.referralsService.getMyReferrals(userId);
  }
}
