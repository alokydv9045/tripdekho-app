import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { TripEntity } from './trip.entity';

export enum DateStatus {
  AVAILABLE = 'available',
  FULL = 'full',
  CANCELLED = 'cancelled',
}

@Entity('trip_dates')
export class TripDateEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => TripEntity, (trip) => trip.dates, { onDelete: 'CASCADE' })
  @JoinColumn()
  trip: TripEntity;

  @Index()
  @Column()
  startDate: Date;

  @Index()
  @Column()
  endDate: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ default: 0 })
  totalSeats: number;

  @Column({ default: 0 })
  availableSeats: number;

  @Column({ default: 0 })
  bookedSeats: number;

  @Column({ type: 'simple-enum', enum: DateStatus, default: DateStatus.AVAILABLE })
  status: DateStatus;
}
