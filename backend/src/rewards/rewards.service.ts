import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoyaltyPointEntity } from '../entities/loyalty-point.entity';
import { PointTransactionEntity, TransactionType, TransactionSource } from '../entities/point-transaction.entity';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class RewardsService {
  constructor(
    @InjectRepository(LoyaltyPointEntity)
    private readonly loyaltyPointRepository: Repository<LoyaltyPointEntity>,
    @InjectRepository(PointTransactionEntity)
    private readonly transactionRepository: Repository<PointTransactionEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async getBalance(userId: string): Promise<LoyaltyPointEntity> {
    let balance = await this.loyaltyPointRepository.findOne({
      where: { user: { id: userId } },
    });

    if (!balance) {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new BadRequestException('User not found');
      }
      balance = this.loyaltyPointRepository.create({
        user,
        balance: 0,
        totalEarned: 0,
        totalRedeemed: 0,
      });
      try {
        await this.loyaltyPointRepository.save(balance);
      } catch (error: any) {
        // Postgres unique violation (23505) or SQLite equivalent
        if (error.code === '23505' || error.message.includes('UNIQUE')) {
          const existing = await this.loyaltyPointRepository.findOne({ where: { user: { id: userId } } });
          if (existing) return existing;
        }
        throw error;
      }
    }
    return balance;
  }

  async getTransactions(userId: string): Promise<PointTransactionEntity[]> {
    return this.transactionRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }

  async creditPoints(
    userId: string, 
    amount: number, 
    source: TransactionSource, 
    referenceId?: string, 
    description?: string
  ) {
    if (referenceId) {
      // Idempotency check
      const existingTx = await this.transactionRepository.findOne({
        where: { referenceId, source, user: { id: userId } }
      });
      if (existingTx) return existingTx;
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const tx = this.transactionRepository.create({
      user,
      type: TransactionType.CREDIT,
      amount,
      source,
      referenceId,
      description
    });
    
    await this.transactionRepository.save(tx);

    const balance = await this.getBalance(userId);
    balance.balance += amount;
    balance.totalEarned += amount;
    
    return this.loyaltyPointRepository.save(balance);
  }

  async deductPoints(userId: string, amount: number, source: TransactionSource, description?: string) {
    const balance = await this.getBalance(userId);
    if (balance.balance < amount) {
      throw new BadRequestException('Insufficient Wander Points');
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const tx = this.transactionRepository.create({
      user,
      type: TransactionType.DEBIT,
      amount,
      source,
      description
    });
    await this.transactionRepository.save(tx);

    balance.balance -= amount;
    balance.totalRedeemed += amount;
    
    return this.loyaltyPointRepository.save(balance);
  }
}
