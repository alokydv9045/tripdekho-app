import { PayoutEntity } from '../../entities/payout.entity';

export const IPayoutRepository = Symbol('IPayoutRepository');

export interface IPayoutRepository {
  create(data: Partial<PayoutEntity>): Promise<PayoutEntity>;
  findById(id: string): Promise<PayoutEntity | null>;
  save(payout: PayoutEntity): Promise<PayoutEntity>;
}
