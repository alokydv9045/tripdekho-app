import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RewardsService } from './rewards.service';
import { RewardsController } from './rewards.controller';
import { RewardsListener } from './rewards.listener';
import { LoyaltyPointEntity } from '../entities/loyalty-point.entity';
import { PointTransactionEntity } from '../entities/point-transaction.entity';
import { UserEntity } from '../entities/user.entity';
import { RewardRuleEntity } from '../entities/reward-rule.entity';
import { ReferralsModule } from '../referrals/referrals.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      LoyaltyPointEntity,
      PointTransactionEntity,
      UserEntity,
      RewardRuleEntity,
    ]),
    ReferralsModule,
  ],
  controllers: [RewardsController],
  providers: [RewardsService, RewardsListener],
  exports: [RewardsService],
})
export class RewardsModule {}
