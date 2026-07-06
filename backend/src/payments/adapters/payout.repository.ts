import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PayoutEntity } from '../../entities/payout.entity';
import { IPayoutRepository } from '../ports/payout.repository.interface';

@Injectable()
export class PayoutRepository implements IPayoutRepository {
  constructor(
    @InjectRepository(PayoutEntity)
    private readonly payoutRepo: Repository<PayoutEntity>,
  ) {}

  async create(data: Partial<PayoutEntity>): Promise<PayoutEntity> {
    const payout = this.payoutRepo.create(data);
    return this.payoutRepo.save(payout);
  }

  async findById(id: string): Promise<PayoutEntity | null> {
    return this.payoutRepo.findOne({
      where: { id },
      relations: { vendor: true },
    });
  }

  async save(payout: PayoutEntity): Promise<PayoutEntity> {
    return this.payoutRepo.save(payout);
  }
}
