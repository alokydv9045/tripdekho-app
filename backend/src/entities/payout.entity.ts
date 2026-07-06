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

export enum PayoutStatus {
  HOLD = 'hold',
  READY = 'ready',
  PROCESSING = 'processing',
  PAID = 'paid',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

@Entity('payouts')
export class PayoutEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => VendorEntity, { onDelete: 'RESTRICT' })
  @JoinColumn()
  vendor: VendorEntity;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'simple-enum', enum: PayoutStatus, default: PayoutStatus.HOLD })
  status: PayoutStatus;

  @Column({ nullable: true })
  method: string;

  @Column({ nullable: true })
  externalId: string;

  @Column({ nullable: true })
  razorpayTransferId: string;

  @Column({ nullable: true })
  razorpayPaymentId: string;

  @Column({ type: 'text', nullable: true })
  note: string;

  @Column({ nullable: true })
  processedAt: Date;

  @Column({ type: 'text', nullable: true })
  failureReason: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
