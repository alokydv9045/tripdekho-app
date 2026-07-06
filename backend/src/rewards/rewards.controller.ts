import { Controller, Get, UseGuards } from '@nestjs/common';
import { RewardsService } from './rewards.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('rewards')
export class RewardsController {
  constructor(private readonly rewardsService: RewardsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('balance')
  async getBalance(@CurrentUser('id') userId: string) {
    return this.rewardsService.getBalance(userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('transactions')
  async getTransactions(@CurrentUser('id') userId: string) {
    return this.rewardsService.getTransactions(userId);
  }
}
