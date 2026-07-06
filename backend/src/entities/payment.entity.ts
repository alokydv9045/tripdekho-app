import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { BookingEntity } from './booking.entity';
import { UserEntity } from './user.entity';
import { VendorEntity } from './vendor.entity';

export enum PaymentType {
  FULL_PAYMENT = 'full_payment',
  DEPOSIT = 'deposit',
  BALANCE = 'balance',
  REFUND = 'refund',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SUCCEEDED = 'succeeded',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  DISPUTED = 'disputed',
  CANCELLED = 'cancelled',
}

export enum PaymentMethod {
  CARD = 'card',
  BANK_TRANSFER = 'bank_transfer',
  PAYPAL = 'paypal',
  WALLET = 'wallet',
  UPI = 'upi',
  NETBANKING = 'netbanking',
}

@Entity('payments')
@Index(['status', 'createdAt'])
export class PaymentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => BookingEntity, { onDelete: 'RESTRICT' })
  @JoinColumn()
  booking: BookingEntity;

  @ManyToOne(() => UserEntity, { onDelete: 'RESTRICT' })
  @JoinColumn()
  customer: UserEntity;

  @ManyToOne(() => VendorEntity, { onDelete: 'RESTRICT' })
  @JoinColumn()
  vendor: VendorEntity;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ default: 'INR' })
  currency: string;

  @Column({ type: 'simple-enum', enum: PaymentType })
  type: PaymentType;

  @Index({ unique: true, sparse: true })
  @Column({ nullable: true })
  razorpayOrderId: string;

  @Column({ nullable: true })
  razorpayPaymentId: string;

  @Column({ nullable: true })
  razorpaySignature: string;

  @Column({ nullable: true })
  razorpayRefundId: string;

  @Column({
    type: 'simple-enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  status: PaymentStatus;

  @Column({ type: 'simple-enum', enum: PaymentMethod, nullable: true })
  paymentMethod: PaymentMethod;

  @Column({ type: 'simple-json', nullable: true })
  paymentMethodDetails: {
    brand?: string;
    last4?: string;
    expiryMonth?: number;
    expiryYear?: number;
    bankName?: string;
    accountLast4?: string;
  };

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  razorpayFee: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  platformFee: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  netAmount: number;

  @Column({ type: 'simple-json', nullable: true })
  refund: {
    amount: number;
    reason: string;
    requestedAt?: Date;
    processedAt?: Date;
    status: 'none' | 'pending' | 'succeeded' | 'failed';
  };

  @Column({ nullable: true })
  failureCode: string;

  @Column({ nullable: true })
  failureMessage: string;

  @Column({ nullable: true })
  ipAddress: string;

  @Column({ nullable: true })
  userAgent: string;

  @Column({ nullable: true })
  processedAt: Date;

  @Column({ nullable: true })
  settledAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
