import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RewardsService } from './rewards.service';
import { ReferralsService } from '../referrals/referrals.service';
import { RewardRuleEntity, RewardTrigger, RecipientType } from '../entities/reward-rule.entity';
import { TransactionSource } from '../entities/point-transaction.entity';
import { Events } from '../events/constants/events.constant';
import { UserRegisteredEvent } from '../events/dtos/user-registered.event';
import { UserEntity } from '../entities/user.entity';
@Injectable()
export class RewardsListener {
  private readonly logger = new Logger(RewardsListener.name);

  constructor(
    private readonly rewardsService: RewardsService,
    private readonly referralsService: ReferralsService,
    @InjectRepository(RewardRuleEntity)
    private readonly rulesRepository: Repository<RewardRuleEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  @OnEvent(Events.USER_REGISTERED)
  async handleUserRegisteredEvent(event: UserRegisteredEvent) {
    try {
      this.logger.log(`Handling user.registered event for user: ${event.userId}`);
      
      const user = await this.userRepository.findOne({ where: { id: event.userId } });
      if (!user) {
         this.logger.warn(`User ${event.userId} not found, skipping reward generation`);
         return;
      }

      // Generate a referral code for every new user automatically
      await this.referralsService.generateCodeForUser(user);

      // If the user signed up using a referral code
      if (event.referralCode) {
        this.logger.log(`User ${event.userId} signed up with referral code: ${event.referralCode}`);
        
        // 1. Create the referral link
        const referral = await this.referralsService.createReferral(event.referralCode, event.userId);
        
        // 2. Fetch the active rules for referral signup
        const rules = await this.rulesRepository.find({
          where: { trigger: RewardTrigger.REFERRAL_SIGNUP, isActive: true }
        });

        for (const rule of rules) {
          // Credit new user (Referred)
          if (rule.recipientType === RecipientType.REFERRED || rule.recipientType === RecipientType.BOTH) {
            await this.rewardsService.creditPoints(
              referral.referredUser.id,
              rule.points,
              TransactionSource.REFERRAL_SIGNUP,
              referral.id,
              `Welcome bonus for using referral code ${event.referralCode}`
            );
          }
          
          // Credit referrer
          if (rule.recipientType === RecipientType.REFERRER || rule.recipientType === RecipientType.BOTH) {
            await this.rewardsService.creditPoints(
              referral.referrer.id,
              rule.points,
              TransactionSource.REFERRAL_SIGNUP,
              referral.id,
              `Referral bonus for inviting ${event.name}`
            );
          }
        }
      }
    } catch (error) {
      this.logger.error(`Failed to handle user registered event for rewards: ${error.message}`);
    }
  }
}
