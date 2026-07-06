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
import { VendorEntity } from './vendor.entity';
import { BookingEntity } from './booking.entity';
import { PayoutEntity } from './payout.entity';

export enum LedgerEntryType {
  BOOKING_PAYMENT = 'booking_payment',
  PAYOUT = 'payout',
  REFUND = 'refund',
  ADJUSTMENT = 'adjustment',
  FEE = 'fee',
}

export enum LedgerStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  FAILED = 'failed',
}

export enum EscrowStatus {
  HELD = 'held',
  RELEASED = 'released',
  REFUNDED = 'refunded',
  DISPUTED = 'disputed',
}

@Entity('payout_ledgers')
@Index(['vendor', 'createdAt'])
@Index(['escrowStatus', 'escrowReleaseDate'])
export class PayoutLedgerEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => VendorEntity, { onDelete: 'RESTRICT' })
  @JoinColumn()
  vendor: VendorEntity;

  @ManyToOne(() => BookingEntity, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn()
  booking: BookingEntity;

  @ManyToOne(() => PayoutEntity, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn()
  payout: PayoutEntity;

  @Column({ type: 'simple-enum', enum: LedgerEntryType })
  type: LedgerEntryType;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  grossAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  commissionAmount: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  commissionRate: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  serviceFeeAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  taxAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  netAmount: number;

  @Column({ default: 'INR' })
  currency: string;

  @Column({ type: 'simple-enum', enum: LedgerStatus, default: LedgerStatus.PENDING })
  status: LedgerStatus;

  @Column({ type: 'simple-enum', enum: EscrowStatus, default: EscrowStatus.HELD })
  escrowStatus: EscrowStatus;

  @Column({ nullable: true })
  escrowReleaseDate: Date;

  @Column({ nullable: true })
  tripStartDate: Date;

  @Column({ nullable: true })
  tripEndDate: Date;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'simple-json', nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
