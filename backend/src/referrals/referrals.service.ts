import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReferralCodeEntity } from '../entities/referral-code.entity';
import { ReferralEntity, ReferralStatus } from '../entities/referral.entity';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class ReferralsService {
  constructor(
    @InjectRepository(ReferralCodeEntity)
    private readonly referralCodeRepository: Repository<ReferralCodeEntity>,
    @InjectRepository(ReferralEntity)
    private readonly referralRepository: Repository<ReferralEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  /**
   * Generates a unique referral code for a user based on their name.
   */
  async generateCodeForUser(user: UserEntity): Promise<ReferralCodeEntity> {
    // Don't create duplicate codes
    const existing = await this.referralCodeRepository.findOne({
      where: { user: { id: user.id } },
    });
    if (existing) return existing;

    const base = user.name.replace(/[^a-zA-Z]/g, '').substring(0, 5).toUpperCase() || 'USER';
    let code = '';
    let isUnique = false;
    let attempts = 0;

    while (!isUnique && attempts < 5) {
      const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
      code = `${base}${randomSuffix}`;
      const dup = await this.referralCodeRepository.findOne({ where: { code } });
      if (!dup) isUnique = true;
      attempts++;
    }

    if (!isUnique) {
      code = `REF${Date.now().toString().slice(-6)}`;
    }

    const referralCode = this.referralCodeRepository.create({
      user,
      code,
      isActive: true,
    });

    return this.referralCodeRepository.save(referralCode);
  }

  async getMyCode(userId: string): Promise<ReferralCodeEntity> {
    const code = await this.referralCodeRepository.findOne({
      where: { user: { id: userId } },
      relations: { user: true },
    });

    if (!code) {
      // Auto-generate for existing users that don't have one yet
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) throw new NotFoundException('User not found');
      return this.generateCodeForUser(user);
    }

    return code;
  }

  async validateCode(code: string): Promise<{ valid: boolean; referrerName?: string }> {
    const referralCode = await this.referralCodeRepository.findOne({
      where: { code, isActive: true },
      relations: { user: true },
    });

    if (!referralCode) return { valid: false };
    return { valid: true, referrerName: referralCode.user.name };
  }

  async getMyReferrals(userId: string): Promise<ReferralEntity[]> {
    return this.referralRepository.find({
      where: { referrer: { id: userId } },
      relations: { referredUser: true, referralCode: true },
      order: { createdAt: 'DESC' },
    });
  }

  async createReferral(referrerCodeStr: string, newUserId: string): Promise<ReferralEntity> {
    const referralCode = await this.referralCodeRepository.findOne({
      where: { code: referrerCodeStr, isActive: true },
      relations: { user: true },
    });

    if (!referralCode) throw new BadRequestException('Invalid referral code');

    // Can't refer yourself
    if (referralCode.user.id === newUserId) {
      throw new BadRequestException('Cannot use your own referral code');
    }

    const referredUser = await this.userRepository.findOne({ where: { id: newUserId } });
    if (!referredUser) throw new NotFoundException('New user not found');

    // Idempotency: don't double-refer
    const existingReferral = await this.referralRepository.findOne({
      where: { referredUser: { id: newUserId } },
    });
    if (existingReferral) return existingReferral;

    const referral = this.referralRepository.create({
      referrer: referralCode.user,
      referredUser,
      referralCode,
      status: ReferralStatus.COMPLETED,
    });

    referralCode.totalReferrals += 1;
    await this.referralCodeRepository.save(referralCode);

    return this.referralRepository.save(referral);
  }
}
