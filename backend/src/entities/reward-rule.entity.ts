import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum RewardTrigger {
  REFERRAL_SIGNUP = 'referral_signup',
  BOOKING_MILESTONE = 'booking_milestone',
  REVIEW_CREATED = 'review_created',
  TRIP_COMPLETED = 'trip_completed',
}

export enum TargetUserType {
  CUSTOMER = 'customer',
  VENDOR = 'vendor',
  ALL = 'all',
}

export enum RecipientType {
  REFERRER = 'referrer',
  REFERRED = 'referred',
  BOTH = 'both',
}

@Entity('reward_rules')
export class RewardRuleEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: RewardTrigger })
  trigger: RewardTrigger;

  @Column({ type: 'enum', enum: TargetUserType, default: TargetUserType.ALL })
  userType: TargetUserType;

  @Column({ type: 'enum', enum: RecipientType })
  recipientType: RecipientType;

  @Column({ type: 'int' })
  points: number;

  @Column({ type: 'int', nullable: true })
  milestoneCount: number;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
