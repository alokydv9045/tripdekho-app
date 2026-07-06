import { PaymentEntity } from '../../entities/payment.entity';

export const IPaymentRepository = Symbol('IPaymentRepository');

export interface IPaymentRepository {
  create(data: Partial<PaymentEntity>): Promise<PaymentEntity>;
  findByRazorpayPaymentId(
    razorpayPaymentId: string,
  ): Promise<PaymentEntity | null>;
  save(payment: PaymentEntity): Promise<PaymentEntity>;
}
