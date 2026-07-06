import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentEntity } from '../../entities/payment.entity';
import { IPaymentRepository } from '../ports/payment.repository.interface';

@Injectable()
export class PaymentRepository implements IPaymentRepository {
  constructor(
    @InjectRepository(PaymentEntity)
    private readonly paymentRepo: Repository<PaymentEntity>,
  ) {}

  async create(data: Partial<PaymentEntity>): Promise<PaymentEntity> {
    const payment = this.paymentRepo.create(data);
    return this.paymentRepo.save(payment);
  }

  async findByRazorpayPaymentId(
    razorpayPaymentId: string,
  ): Promise<PaymentEntity | null> {
    return this.paymentRepo.findOne({
      where: { razorpayPaymentId },
      relations: { booking: true, customer: true, vendor: true },
    });
  }

  async save(payment: PaymentEntity): Promise<PaymentEntity> {
    return this.paymentRepo.save(payment);
  }
}
