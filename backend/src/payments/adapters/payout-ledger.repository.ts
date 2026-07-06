import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PayoutLedgerEntity } from '../../entities/payout-ledger.entity';
import { IPayoutLedgerRepository } from '../ports/payout-ledger.repository.interface';

@Injectable()
export class PayoutLedgerRepository implements IPayoutLedgerRepository {
  constructor(
    @InjectRepository(PayoutLedgerEntity)
    private readonly ledgerRepo: Repository<PayoutLedgerEntity>,
  ) {}

  async create(data: Partial<PayoutLedgerEntity>): Promise<PayoutLedgerEntity> {
    const ledger = this.ledgerRepo.create(data);
    return this.ledgerRepo.save(ledger);
  }

  async save(ledger: PayoutLedgerEntity): Promise<PayoutLedgerEntity> {
    return this.ledgerRepo.save(ledger);
  }

  async findByBookingId(bookingId: string): Promise<PayoutLedgerEntity[]> {
    return this.ledgerRepo.find({
      where: { booking: { id: bookingId } },
      relations: { vendor: true, booking: true, payout: true },
    });
  }
}
