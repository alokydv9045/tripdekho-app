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
import { ReferralCodeEntity } from './referral-code.entity';

export enum ReferralStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  REVOKED = 'revoked',
}

@Entity('referrals')
@Index(['referrer', 'referredUser'])
export class ReferralEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn()
  referrer: UserEntity;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn()
  referredUser: UserEntity;

  @ManyToOne(() => ReferralCodeEntity)
  @JoinColumn()
  referralCode: ReferralCodeEntity;

  @Column({ type: 'enum', enum: ReferralStatus, default: ReferralStatus.PENDING })
  status: ReferralStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
