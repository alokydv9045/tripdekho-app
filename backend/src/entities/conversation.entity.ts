import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  Column,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { VendorEntity } from './vendor.entity';
import { TripEntity } from './trip.entity';
import { MessageEntity } from './message.entity';

@Entity('conversations')
export class ConversationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // The customer who initiated the chat
  @ManyToOne(() => UserEntity, { eager: true, onDelete: 'CASCADE' })
  customer: UserEntity;

  // The vendor they are chatting with
  @ManyToOne(() => VendorEntity, { eager: true, onDelete: 'CASCADE' })
  vendor: VendorEntity;

  // Optional link to a specific trip context
  @ManyToOne(() => TripEntity, {
    eager: true,
    nullable: true,
    onDelete: 'SET NULL',
  })
  trip: TripEntity;

  @OneToMany(() => MessageEntity, (message) => message.conversation)
  messages: MessageEntity[];

  @Column({ type: 'boolean', default: false })
  isArchived: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
