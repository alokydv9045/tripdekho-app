import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { TripEntity } from './trip.entity';

export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
}

@Entity('trip_media')
export class TripMediaEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => TripEntity, (trip) => trip.media, { onDelete: 'CASCADE' })
  @JoinColumn()
  trip: TripEntity;

  @Column()
  url: string;

  @Column()
  publicId: string;

  @Column({ nullable: true })
  caption: string;

  @Column({ default: false })
  isPrimary: boolean;

  @Column({ type: 'simple-enum', enum: MediaType, default: MediaType.IMAGE })
  type: MediaType;
}
