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
import { UserEntity } from './user.entity';
import { VendorEntity } from './vendor.entity';
import { TripEntity } from './trip.entity';
import { TripDateEntity } from './trip-date.entity';

export enum PaymentStatus {
  PENDING = 'pending',
  PARTIAL = 'partial',
  PAID = 'paid',
  REFUNDED = 'refunded',
  FAILED = 'failed',
}

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show',
  DISPUTED = 'disputed',
}

export enum RefundStatus {
  NONE = 'none',
  REQUESTED = 'requested',
  PENDING = 'pending',
  PROCESSED = 'processed',
  FAILED = 'failed',
  NOT_APPLICABLE = 'not_applicable',
}

export enum PaymentMethod {
  RAZORPAY = 'razorpay',
  UPI = 'upi',
  CARD = 'card',
  NETBANKING = 'netbanking',
  PAYPAL = 'paypal',
  BANK_TRANSFER = 'bank_transfer',
}

@Entity('bookings')
@Index(['vendor', 'status', 'createdAt'])
export class BookingEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column({ unique: true })
  bookingNumber: string;

  @ManyToOne(() => TripEntity, { onDelete: 'RESTRICT' })
  @JoinColumn()
  trip: TripEntity;

  @ManyToOne(() => UserEntity, { onDelete: 'RESTRICT' })
  @JoinColumn()
  user: UserEntity;

  @ManyToOne(() => VendorEntity, { onDelete: 'RESTRICT' })
  @JoinColumn()
  vendor: VendorEntity;

  @ManyToOne(() => TripDateEntity, { onDelete: 'RESTRICT' })
  @JoinColumn()
  departure: TripDateEntity;

  @Column({ type: 'simple-json', nullable: true })
  tripSnapshot: {
    title: string;
    slug: string;
    duration: { days: number; nights: number };
    location: { city: string; country: string };
    image: string;
  };

  @Column()
  totalGuests: number;

  @Column({ type: 'jsonb', nullable: true })
  guestDetails: {
    leadGuest: {
      name: string;
      email: string;
      phone: string;
      dateOfBirth?: Date;
      nationality?: string;
    };
    additionalGuests?: Array<{
      name: string;
      dateOfBirth?: Date;
      relationship?: string;
    }>;
    specialRequests?: string;
  };

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  basePrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  platformFee: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  serviceFee: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  taxes: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  discount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalPrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  vendorAmount: number;

  @Column({ nullable: true })
  razorpayOrderId: string;

  @Column({ nullable: true })
  razorpayPaymentId: string;

  @Column({
    type: 'simple-enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  paymentStatus: PaymentStatus;

  @Column({
    type: 'simple-enum',
    enum: PaymentMethod,
    default: PaymentMethod.RAZORPAY,
  })
  paymentMethod: PaymentMethod;

  @Column({
    type: 'simple-enum',
    enum: BookingStatus,
    default: BookingStatus.PENDING,
  })
  status: BookingStatus;

  @Column({ nullable: true })
  cancellationDate: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  refundAmount: number;

  @Column({
    type: 'simple-enum',
    enum: RefundStatus,
    default: RefundStatus.NONE,
  })
  refundStatus: RefundStatus;

  @Column({ type: 'text', nullable: true })
  refundReason: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'text', nullable: true })
  internalNotes: string;

  @Column({ nullable: true })
  confirmedAt: Date;

  @Column({ nullable: true })
  completedAt: Date;

  @Column({ default: false })
  reviewed: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
