import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { UserEntity } from './user.entity';

export enum ActivityAction {
  SEARCH = 'SEARCH',
  VIEW_TRIP = 'VIEW_TRIP',
  VIEW_PAGE = 'VIEW_PAGE',
}

@Entity('user_activities')
export class UserActivityEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserEntity, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ type: 'varchar', nullable: true })
  @Index()
  userId: string; // Storing userId directly helps if user is deleted or null

  @Column({ type: 'simple-enum', enum: ActivityAction })
  @Index()
  action: ActivityAction;

  @Column({ type: 'jsonb', nullable: true })
  details: any;

  @CreateDateColumn()
  @Index()
  createdAt: Date;
}
