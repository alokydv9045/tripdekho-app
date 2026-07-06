import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { BookingEntity } from './booking.entity';

export enum RedemptionType {
  DIRECT_DISCOUNT = 'direct_discount',
  COUPON_THRESHOLD = 'coupon_threshold',
}

@Entity('reward_redemptions')
export class RewardRedemptionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: UserEntity;

  @ManyToOne(() => BookingEntity, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn()
  booking: BookingEntity;

  @Column({ type: 'int' })
  pointsUsed: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  discountAmount: number;

  @Column({ type: 'enum', enum: RedemptionType, default: RedemptionType.DIRECT_DISCOUNT })
  type: RedemptionType;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
