import { PayoutLedgerEntity } from '../../entities/payout-ledger.entity';

export const IPayoutLedgerRepository = Symbol('IPayoutLedgerRepository');

export interface IPayoutLedgerRepository {
  create(data: Partial<PayoutLedgerEntity>): Promise<PayoutLedgerEntity>;
  save(ledger: PayoutLedgerEntity): Promise<PayoutLedgerEntity>;
  findByBookingId(bookingId: string): Promise<PayoutLedgerEntity[]>;
}
