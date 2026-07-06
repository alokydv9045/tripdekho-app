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

export enum TransactionType {
  CREDIT = 'credit',
  DEBIT = 'debit',
}

export enum TransactionSource {
  REFERRAL_SIGNUP = 'referral_signup',
  REFERRAL_MILESTONE = 'referral_milestone',
  REVIEW_BONUS = 'review_bonus',
  TRIP_COMPLETED = 'trip_completed',
  REDEMPTION = 'redemption',
  ADMIN_ADJUSTMENT = 'admin_adjustment',
}

@Entity('point_transactions')
@Index(['user', 'createdAt'])
export class PointTransactionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: UserEntity;

  @Column({ type: 'enum', enum: TransactionType })
  type: TransactionType;

  @Column({ type: 'int' })
  amount: number;

  @Column({ type: 'enum', enum: TransactionSource })
  source: TransactionSource;

  @Column({ nullable: true })
  referenceId: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
